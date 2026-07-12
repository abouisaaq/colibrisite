"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DailyVisit = {
  day: string;
  visits: number;
  visitors: number;
};

export function VisitAnalyticsChart({ data }: { data: DailyVisit[] }) {
  const formatted = data.map((item) => ({
    ...item,
    label: new Date(item.day).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    }),
  }));

  if (formatted.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Aucune donnée</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => [
            Number(value ?? 0),
            name === "visits" ? "Visites" : "Visiteurs uniques",
          ]}
        />
        <Legend
          formatter={(value) => (value === "visits" ? "Visites" : "Visiteurs uniques")}
        />
        <Line
          type="monotone"
          dataKey="visits"
          stroke="#26A69A"
          strokeWidth={2}
          dot={{ fill: "#26A69A", r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={{ fill: "#8B5CF6", r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
