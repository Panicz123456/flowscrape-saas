import { GetWorkflowExecutions } from "@/actions/workflows/GetWorkflowExecutions"
import { Topbar } from "../../_components/topbar/topbar"
import { Suspense } from "react"
import { InboxIcon, Loader2Icon } from "lucide-react"
import { ExecutionTable } from "./_components/ExecutionTable"

export default function ExecutionPage({ params }: { params: { workflowId: string } }) {
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={params.workflowId}
        hideButtons
        title="All runs"
        subtitle="List of all your workflow runs"
      />
      <Suspense fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Loader2Icon size={30} className="animate-spin stroke-primary" />
        </div>
      }>
        <ExecutionTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  )
}

async function ExecutionTableWrapper({ workflowId }: { workflowId: string }) {
  const execution = await GetWorkflowExecutions(workflowId)

  if (!execution) {
    return <div>No data</div>
  }

  if (execution.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent size-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 w-full">
      <ExecutionTable workflowId={workflowId} initialData={execution} />
    </div>
  )
}