"use client"

import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Layers2 } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

type ChartData = Awaited<ReturnType<typeof getWorkflowExecutionStats>>
const chartConfig = {
  success: {
    label: "Success",
    color: "hsl(var(--chart-2))"
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-1))"
  }
}

export const ExecutionStatusChart = ({ data }: { data: ChartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Layers2 className="size-6 text-primary" />
          Workflow execution status
        </CardTitle>
        <CardDescription>
          Total daily count of successful and failed workflow runs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <AreaChart data={data} height={200} accessibilityLayer margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              }}
            />
            <ChartLegend
              content={<ChartLegendContent />}
            />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Area
              min={0}
              type={"natural"}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              fillOpacity={0.6}
              dataKey={"success"}
              stackId={"a"}
            />
            <Area
              min={0}
              type={"natural"}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              fillOpacity={0.6}
              dataKey={"failed"}
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}