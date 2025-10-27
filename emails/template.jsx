import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function Email({
  userName = "",
  type = "monthly-report",
  data = {
    month: "December",
    stats: {
      totalIncome: 5000,
      totalExpenses: 3500,
      byCategory: {
        housing: 1500,
        groceries: 600,
        transportation: 400,
        entertainment: 300,
        utilities: 700,
      },
    },
    insights: [
      "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
      "Great job keeping entertainment expenses under control this month!",
      "Setting up automatic savings could help you save 20% more of your income.",
    ],
  },
}) {
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Section style={styles.logoSection}>
              <Img
                src="https://res.cloudinary.com/dwmwmdww2/image/upload/v1760365041/logo_hylw78.png"
                width="200"
                height="60"
                alt="Company Logo"
                style={styles.logo}
              />
            </Section>
            <Heading
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                background: "linear-gradient(90deg, #5E1FDB, #8E2DE2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "28px",
                fontWeight: 700,
                padding: "15px 0",
                marginBottom: "24px",
              }}
            >
              Your {data?.month} Financial Overview
            </Heading>

            <Text style={styles.greeting}>Hi {userName || "there"},</Text>
            <Text style={styles.text}>
              Here’s a quick summary of your finances for{" "}
              <strong>{data?.month}</strong>. Stay informed and make smarter
              decisions with these insights.
            </Text>
            <Section style={styles.statsCard}>
              <div style={styles.statBox}>
                <Text style={styles.statLabel}>Total Income</Text>
                <Text style={styles.statValue}>₹{data?.stats.totalIncome}</Text>
              </div>
              <div style={styles.statBox}>
                <Text style={styles.statLabel}>Total Expenses</Text>
                <Text style={styles.statValue}>
                  ₹{data?.stats.totalExpenses}
                </Text>
              </div>
              <div style={styles.statBox}>
                <Text style={styles.statLabel}>Net Savings</Text>
                <Text
                  style={{
                    ...styles.statValue,
                    color:
                      data?.stats.totalIncome - data?.stats.totalExpenses > 0
                        ? "#0E9F6E"
                        : "#E63946",
                  }}
                >
                  ₹
                  {Number(
                    data?.stats.totalIncome - data?.stats.totalExpenses
                  ).toFixed(2)}
                </Text>
              </div>
            </Section>

            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.subHeading}>
                  Expense Breakdown by Category
                </Heading>
                <table
                  width="100%"
                  cellPadding="6"
                  style={{ borderCollapse: "collapse" }}
                >
                  <tbody>
                    {Object.entries(data.stats.byCategory).map(
                      ([category, amount]) => (
                        <tr
                          key={category}
                          style={{ borderBottom: "1px solid #f1efff" }}
                        >
                          <td
                            align="left"
                            style={{
                              color: "#333",
                              textTransform: "capitalize",
                              fontSize: "15px",
                              padding: "6px 0",
                            }}
                          >
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </td>
                          <td
                            align="right"
                            style={{
                              color: "#5E1FDB",
                              fontWeight: 600,
                              padding: "6px 0",
                            }}
                          >
                            ₹{amount.toFixed(2)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Insights */}
            {data?.insights && (
              <Section style={styles.section}>
                <Heading style={styles.subHeading}>
                  Insights & Suggestions
                </Heading>
                {data.insights.map((insight, index) => (
                  <div style={styles.categoryRow}>
                    <Text key={index} style={styles.insightText}>
                      💡 {insight}
                    </Text>
                  </div>
                ))}
              </Section>
            )}

            {/* CTA */}
            <Section style={{ textAlign: "center", marginTop: "32px" }}>
              <Button
                style={styles.ctaButton}
                href="http://localhost:3000/dashboard"
              >
                View Full Report
              </Button>
            </Section>

            {/* Footer */}
            <Text style={styles.footer}>
              Thank you for using <strong>Budget Brain</strong>. Stay consistent
              and take control of your financial journey!
              <br />© {new Date().getFullYear()} Budget Brain. All rights
              reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert – You’re reaching your spending limit</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Section style={styles.logoSection}>
              <Img
                src="https://res.cloudinary.com/dwmwmdww2/image/upload/v1760365041/logo_hylw78.png"
                width="240"
                height="70"
                alt="Company Logo"
                style={styles.logo}
              />
            </Section>
            <Heading style={styles.gradientHeading}>Budget Alert</Heading>
            <Text style={styles.textPrimary}>Hello {userName},</Text>
            <Text style={styles.text}>
              You’ve used{" "}
              <strong style={{ color: "#7f5efd" }}>{data?.usage}%</strong> of
              your monthly budget. Keep an eye on your spending!
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.textLabel}>Budget Amount</Text>
                <Text style={styles.statValue}>₹{data?.budgetAmount}</Text>
              </div>

              <div style={styles.stat}>
                <Text style={styles.textLabel}>Spent So Far</Text>
                <Text style={styles.statValue}>₹{data?.totalExpenses}</Text>
              </div>

              <div style={styles.stat}>
                <Text style={styles.textLabel}>Remaining</Text>
                <Text style={styles.statValue}>
                  ₹{data?.budgetAmount - data?.totalExpenses}
                </Text>
              </div>
            </Section>
            <Section style={{ textAlign: "center", marginTop: "32px" }}>
              <Button
                style={{
                  background: "linear-gradient(to right, #8E2DE2, #4A00E0)",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                href="http://localhost:3000/dashboard"
              >
                View Detailed Report
              </Button>
            </Section>
            <Text style={styles.footer}>
              You are receiving this email because you have an active budget
              alert. Manage your preferences in your account settings.
              <br />© {new Date().getFullYear()} Your Company. All rights
              reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
}

const styles = {
  body: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "40px 0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "32px",
    borderRadius: "12px",
    maxWidth: "600px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "12px",
  },
  logo: {
    margin: "0 auto",
    borderRadius: "12px",
  },
  gradientHeading: {
    color: "#5E1FDB",
    opacity: "0.9",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    fontSize: "40px",
    fontWeight: 700,
    lineHeight: 1.25,
    textAlign: "center",
    margin: "24px 0",
  },

  textPrimary: {
    color: "#7f5efd",
    fontSize: "17px",
    marginBottom: "10px",
    fontWeight: 600,
  },
  text: {
    color: "#555",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px",
  },
  statsContainer: {
    marginTop: "28px",
    padding: "20px",
    backgroundColor: "#f9f8ff",
    borderRadius: "8px",
    border: "1px solid #e2e0fa",
  },
  stat: {
    marginBottom: "16px",
    padding: "14px 16px",
    backgroundColor: "#fff",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  textLabel: {
    color: "#7f5efd",
    fontSize: "15px",
    fontWeight: "500",
    marginBottom: "4px",
  },
  statValue: {
    color: "#1f1f1f",
    fontSize: "20px",
    fontWeight: "700",
  },
  footer: {
    color: "#888",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "36px",
    lineHeight: "1.5",
    borderTop: "1px solid #eee",
    paddingTop: "18px",
  },
  title: {
    textAlign: "center",
    background: "linear-gradient(90deg, #5E1FDB, #8E2DE2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "28px",
    fontWeight: 700,
    paddingBlock: "10px",
    marginBottom: "24px",
  },
  greeting: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#5E1FDB",
    marginBottom: "8px",
  },
  statsCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    backgroundColor: "#f9f8ff",
    borderRadius: "10px",
    padding: "20px",
    border: "1px solid #eceafd",
    marginBottom: "24px",
  },
  statBox: {
    textAlign: "left",
    flex: 1,
  },
  statLabel: {
    fontSize: "14px",
    color: "#7f5efd",
    marginBottom: "6px",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f1f1f",
  },
  section: {
    marginTop: "28px",
    padding: "20px",
    backgroundColor: "#fdfcff",
    borderRadius: "12px",
    border: "1px solid #eee9ff",
  },
  subHeading: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#5E1FDB",
    marginBottom: "12px",
  },
  categoryRow: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #f1efff",
    padding: "8px 0",
  },
  categoryLabel: {
    color: "#333",
    textTransform: "capitalize",
    fontSize: "15px",
  },
  categoryValue: {
    color: "#5E1FDB",
    fontWeight: 600,
  },
  insightText: {
    color: "#444",
    fontSize: "15px",
    lineHeight: "1.6",
    marginBottom: "8px",
  },
  ctaButton: {
    background: "linear-gradient(90deg, #8E2DE2, #4A00E0)",
    color: "#ffffff",
    fontWeight: "bold",
    padding: "12px 28px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  },
  title2: {
    color: "#FFFFFF",
    textAlign: "center",
    background: "linear-gradient(90deg, #5E1FDB, #8E2DE2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "28px",
    fontWeight: 700,
    padding: "20px 0",
    marginBottom: "24px",
  },
};
