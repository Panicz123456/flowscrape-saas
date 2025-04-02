import { getPeriods } from "@/actions/analytics/getPeriods"
import { Suspense } from "react"
import { PeriodsSelector } from "./_components/PeriodsSelector"
import { Period } from "@/types/analytics"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatsCardsValues } from "@/actions/analytics/getStatsCardsValues"
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react"
import { StatsCard } from "./_components/StatsCard"

const Home = ({ searchParams }: {
  searchParams: { month?: string, year?: string }
}) => {
  const currentDate = new Date()
  const { month, year } = searchParams
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear()
  }
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectionWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="w-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  )
}

async function PeriodSelectionWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
  const periods = await getPeriods()

  return <PeriodsSelector selectedPeriod={selectedPeriod} periods={periods} />
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getStatsCardsValues(selectedPeriod)

  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data.phaseExecution}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="credits Consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {
        [1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full min-h-[120px]" />
        ))
      }
    </div>
  )
}

export default Home