import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionWithPhases"
import { Topbar } from "@/app/workflow/_components/topbar/topbar"
import { Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ExecutionViewer } from "./_components/ExecutionViewer"

const ExecutionViewerPage = ({ params }: {
  params: {
    executionId: string,
    workflowId: string
  }
}) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={params.workflowId}
        title="Workflow runs details"
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense fallback={
          <div className="flex w-full items-center justify-center">
            <Loader2 className="animate-spin size-10" />
          </div>
        }>
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  )
}

export default ExecutionViewerPage

async function ExecutionViewerWrapper({
  executionId
}: {
  executionId: string
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId)
  if (!workflowExecution) {
    return notFound()
  }

  return (
    <ExecutionViewer initialData={workflowExecution} />
  )
}