'use client'

import { RunWorkflow } from "@/actions/workflows/runWorkflows"
import { useExecutionPlan } from "@/components/hooks/useExecutionPlan"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { useReactFlow } from "@xyflow/react"
import { PlayIcon } from "lucide-react"
import { toast } from "sonner"

export const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan()
  const {toObject} = useReactFlow()

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution started", { id: "flow-execution" })
    },
    onError: () => {
      toast.error("Something went wrong", { id: "flow-execution" })
    },

  })
  return (
    <Button
      disabled={mutation.isPending}
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate()
        if (!plan) {
          return
        }

        mutation.mutate({ 
          workflowId: workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  )
}