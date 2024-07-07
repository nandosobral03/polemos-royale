"use client";
import TitledCard from "@/components/ui/titled-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PlayerHealthChart({ health }: { health: number[] }) {
  const data = [
    {
      name: "Health",
      health: 100,
    },
    ...health.map((h, i) => ({
      name: `${i + 1}`,
      health: h,
    })),
  ];

  return (
    <TitledCard title="Health" className="h-[30vh]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: "Day" }} />
          <YAxis dataKey="health" />
          <Legend />
          <Line
            dataKey="health"
            name="Health"
            type="monotone"
            stroke="var(--primary)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </TitledCard>
  );
}
