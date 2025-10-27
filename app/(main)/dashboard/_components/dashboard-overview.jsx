"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#FF6B6B", // red
  "#4ECDC4", // teal
  "#45B7D1", // blue
  "#96CEB4", // green
  "#FFD166", // yellow
  "#D4A5A5", // soft pink
  "#9FA8DA", // lavender
  "#FCA5A5", // light red
  "#A7F3D0", // mint
  "#C084FC", // purple
];

// 1. Update this function
const CustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
  index,
  percent,
}) => {
  // Filter out labels for small slices
  if (percent < 0.05) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={COLORS[index % COLORS.length]}
        fill="none"
      />
      <circle
        cx={ex}
        cy={ey}
        r={2}
        // --- THIS IS THE FIXED LINE ---
        fill={COLORS[index % COLORS.length]}
        stroke="none"
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        dominantBaseline="central"
        className="text-xs"
      >
        {`${name}: ₹${value.toFixed(2)}`}
      </text>
    </g>
  );
};

const DashBoardOverview = ({ accounts, transactions }) => {
    const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const filteredTransactions = transactions.filter(
    (t) => t.accountId === selectedAccount
  );

  const recentTransactions = filteredTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  const currentDate = new Date();
  const currentMonthExpenses = filteredTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className={"shadow-2xl shadow-slate-300 hover:shadow-xl"}>
        <CardHeader
          className={
            "flex flex-row justify-between items-center space-y-0 pb-4"
          }
        >
          <CardTitle className={"text-base font-normal"}>
            Recent Transactions
          </CardTitle>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center",
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href={`/account/${selectedAccount}`}>
          <Button
            className=" mt-5 w-full cursor-pointer bg-transparent hover:bg-white hover:shadow-[#d5caff] hover:shadow-xl/80 transition-all duration-500 ease-in-out hover:border-[#7f5efd] hover:text-[#7f5efd]"
            variant={"outline"}
            >
            See all transactions
          </Button>
        </Link>
        </CardContent>
      </Card>

      <Card className="shadow-2xl shadow-slate-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="font-normal text-base">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses this month.
            </p>
          ) : (
            <div className="flex flex-col items-center w-full">
              {/* Chart Section */}
              <div className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius="65%"
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={<CustomizedLabel />}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) => `₹${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Section */}
              <div className="mt-4 sm:mt-6 w-full flex justify-center px-2">
                <div
                  className="flex flex-wrap justify-center gap-x-4 gap-y-2 overflow-x-auto max-w-full"
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: "1.2rem",
                    textTransform: "capitalize",
                  }}
                >
                  {pieChartData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></span>
                      <span style={{ color: COLORS[index % COLORS.length] }}>
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashBoardOverview;
