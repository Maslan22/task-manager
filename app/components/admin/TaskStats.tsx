"use client"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Cell, Pie, PieChart } from "recharts"

interface TaskStatsProps {
  data: {
    status: string;
    _count: number;
  }[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
]


export function TaskStats({ data }: TaskStatsProps) {
  const chartData = data.map((item) => ({
    name: item.status,
    value: item._count,
  }))

  return (
    <ChartContainer 
      className="h-[300px]"
      config={{
        pending: {
          color: COLORS[0],
          label: "Pending",
        },
        upcoming: {
          color: COLORS[1],
          label: "Upcoming",
        },
        ongoing: {
          color: COLORS[2],
          label: "Ongoing",
        },
        completed: {
          color: COLORS[3],
          label: "Completed",
        },
      }}
    >
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <ChartTooltip />
      </PieChart>
    </ChartContainer>
  )
}