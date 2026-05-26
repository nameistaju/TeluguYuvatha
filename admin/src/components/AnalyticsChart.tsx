"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AnalyticsChart({ rows }: { rows: Array<{ name: string; revenue: number; quantity: number }> }) {
  return (
    <div className="surface h-[320px] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid stroke="#262626" vertical={false} />
          <XAxis dataKey="name" stroke="#8E8E93" tickLine={false} axisLine={false} />
          <YAxis stroke="#8E8E93" tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "#1A1A1A" }} contentStyle={{ background: "#121212", border: "1px solid #262626" }} />
          <Bar dataKey="revenue" fill="#B00020" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
