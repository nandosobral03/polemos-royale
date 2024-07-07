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

export default function PlayerHealthChart({
  numberOfPlayers,
  initialCount,
}: {
  numberOfPlayers: number[];
  initialCount: number;
}) {
  const data = [
    {
      name: "Players Alive",
      value: initialCount,
    },
    ...numberOfPlayers.map((playerCount, i) => ({
      name: `${i + 1}`,
      value: playerCount,
    })),
  ];

  return (
    <TitledCard
      title="Players alive"
      className="h-[30vh]"
      titleClassName="text-primary"
    >
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
          <YAxis dataKey="value" />
          <Legend />
          <Line
            dataKey="value"
            name="Players Alive"
            type="monotone"
            stroke="var(--primary)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </TitledCard>
  );
}
