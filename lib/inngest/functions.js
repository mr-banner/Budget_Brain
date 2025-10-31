import { sendEmail } from "@/actions/send-emails";
import { db } from "../prisma";
import { inngest } from "./client";
import Email from "@/emails/template";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alert" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });
    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue;

      await step.run(`check-budget-${budget.id}`, async () => {
        const currentDate = new Date();
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
          0,
          0,
          0,
          0
        );

        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });
        console.log(budget.amount);

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount.toNumber();
        const usage = (totalExpenses / budgetAmount) * 100;

        if (
          usage >= 80 &&
          (!budget.lastAlert ||
            isNewMonth(new Date(budget.lastAlert), new Date()))
        ) {
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name} Account`,
            react: Email({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                usage: usage?.toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
                budgetAmount: parseInt(budgetAmount).toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });
          //update last alert sent
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlert: new Date() },
          });
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              { nextRecurringDate: { lte: new Date() } },
            ],
          },
        });
      }
    );

    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: { transactionId: transaction.id, userId: transaction.userId },
      }));

      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

export const processRecurringTransactions = inngest.createFunction(
  {
    id: "process-recurring-transactions",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    if (!event.data.transactionId || !event.data.userId) {
      throw new Error("Missing transactionId or userId in event data");
    }
    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;
      const now = new Date();
      const nextRecurringDate = calculateNextRecurringDate(
        now,
        transaction.recurringInterval
      );
      await db.$transaction(async (tx) => {
        // Create new transaction
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            recurringInterval: transaction.recurringInterval,
            accountId: transaction.accountId,
            isRecurring: true,
            nextRecurringDate,
          },
        });
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}
function isTransactionDue(transaction) {
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDate = new Date(transaction.nextRecurringDate);

  return nextDate <= today;
}

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        const insights = await generateInsights(stats, monthName);
        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: Email({
            userName: user.name,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
            },
          }),
        });
      });
    }
  }
);

async function generateInsights(stats, month) {
  const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
   Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: ₹${stats.totalIncome.toFixed(2)}
    - Total Expenses: ₹${stats.totalExpenses.toFixed(2)}
    - Net Savings: ₹${(stats.totalIncome - stats.totalExpenses).toFixed(2)}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: ₹${amount.toFixed(2)}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    const cleanedText = response.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

const getMonthlyStats = async (userId, month) => {
  // Define start and end of the month
  const startDate = new Date(
    month.getFullYear(),
    month.getMonth(),
    1,
    0, 0, 0, 0
  );

  const endDate = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
    23, 59, 59, 999
  );

  // Fetch transactions for the user in that month
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  const stats = transactions.reduce(
    (acc, t) => {
      const amount = Number(t.amount);

      if (t.type === "EXPENSE") {
        acc.totalExpenses += amount;
        acc.byCategory[t.category] = (acc.byCategory[t.category] || 0) + amount;
      } else if (t.type === "INCOME") {
        acc.totalIncome += amount;
      }

      return acc;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
  const formattedStats = {
    totalExpenses: parseFloat(stats.totalExpenses.toFixed(2)),
    totalIncome: parseFloat(stats.totalIncome.toFixed(2)),
    netIncome: Number((stats.totalIncome - stats.totalExpenses).toFixed(2)),
    transactionCount: stats.transactionCount,
    byCategory: Object.fromEntries(
      Object.entries(stats.byCategory).map(([category, value]) => [
        category,
        parseFloat(value.toFixed(2)),
      ])
    ),
  };

  return formattedStats;
};
