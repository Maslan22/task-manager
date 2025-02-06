"use client";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: {
    createdAt: Date;
    _count: {
      attendees: number;
      posts: number;
    };
  }[];
}

export function Overview({ data }: OverviewProps) {
  const chartData = data.map((item) => ({
    name: new Date(item.createdAt).toLocaleDateString(),
    attendees: item._count.attendees,
    posts: item._count.posts,
  }));

  return (
    <ChartContainer
      className="h-[350px]"
      config={{
        attendees: {
          label: "Attendees",
          color: "hsl(var(--primary))",
        },
        posts: {
          label: "Posts",
          color: "hsl(var(--secondary))",
        },
      }}
    >
      <LineChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Line
          type="monotone"
          dataKey="attendees"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "hsl(var(--primary))" },
          }}
        />
        <Line
          type="monotone"
          dataKey="posts"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "hsl(var(--secondary))" },
          }}
        />
        <ChartTooltip />
      </LineChart>
    </ChartContainer>
  );
}
