"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Donation {
  amount: number;
  createdAt: Date;
}

export function DashboardChart({ data }: { data: Donation[] }) {
  const chartData = data.reduce<Record<string, number>>((acc, d) => {
    const month = new Date(d.createdAt).toLocaleDateString("fr-FR", {
      month: "short",
      year: "2-digit",
    });
    acc[month] = (acc[month] ?? 0) + d.amount;
    return acc;
  }, {});

  const formatted = Object.entries(chartData).map(([month, total]) => ({
    month,
    total,
  }));

  if (formatted.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-8">Aucune donnée</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [formatCurrency(Number(value ?? 0)), "Total"]} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#26A69A"
          strokeWidth={2}
          dot={{ fill: "#26A69A" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
