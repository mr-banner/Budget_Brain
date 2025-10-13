"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Value } from "@radix-ui/react-select";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { IndianRupee } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};
const AccountChart = ({ transactions }) => {
  const [dataRange, setDataRange] = useState("1M");
  const filteredData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const range = DATE_RANGES[dataRange];
    const now = new Date();

    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    if (filtered.length === 0) return [];

    const grouped = filtered?.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }

      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dataRange]);

  const totalIncome = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex items-center flex-row justify-between space-y-0">
        <CardTitle
          className={"sm:text-base text-sm font-normal text-muted-foreground"}
        >
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dataRange} onValueChange={setDataRange}>
          <SelectTrigger
            className="w-[140px] ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0"
            size="sm"
          >
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-4 mb-5">
          <div className="text-center">
            <p className="text-muted-foreground text-xs sm:text-base">
              Total Income
            </p>
            <p className="font-bold text-green-500 text-xs sm:text-base flex items-center">
              <IndianRupee className="sm:h-4 sm:w-4 h-3 w-3" />
              {totalIncome?.income.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs sm:text-base">
              Total Expense
            </p>
            <p className="font-bold text-red-500 flex items-center text-xs sm:text-base">
              <IndianRupee className="sm:h-4 sm:w-4 h-3 w-3" />
              {totalIncome?.expense.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs sm:text-base">Net</p>
            <p
              className={`font-bold text-green-500 flex items-center text-xs sm:text-base ${
                totalIncome?.income - totalIncome?.expense < 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              <IndianRupee className="sm:h-4 sm:w-4 h-3 w-3" />
              {(totalIncome?.income - totalIncome?.expense).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toFixed(2)}`, undefined]}
                contentStyle={{
                  backgroundColor: "#ede9ffba",
                  border: "1px solid #fdfdfd",
                  borderRadius: "8px",
                }}
              />
              <Legend/>
              <Bar
                dataKey="income"
                name={"Income"}
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name={"Expense"}
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;
