"use client"

import { getCreditsUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod"
import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartColumnStackedIcon, Layers2 } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type ChartData = Awaited<ReturnType<typeof getCreditsUsageInPeriod>>
const chartConfig = {
  success: {
    label: "Success Phase Credits",
    color: "hsl(var(--chart-2))"
  },
  failed: {
    label: "Failed Phase Credits",
    color: "hsl(var(--chart-1))"
  }
}

export const CreditsUsageChart = ({
  data,
  title,
  description
}: {
  data: ChartData,
  title: string,
  description: string
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="size-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <BarChart data={data} height={200} accessibilityLayer margin={{ top: 20 }}>
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
            <Bar
              min={0}
              type={"natural"}
              radius={[0, 0, 4, 4]}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              fillOpacity={0.8}
              dataKey={"success"}
              stackId={"a"}
            />
            <Bar
              min={0}
              radius={[4, 4, 0, 0]}
              type={"natural"}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              fillOpacity={0.8}
              dataKey={"failed"}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}