"use client"

import { RunWorkflow } from "@/actions/workflows/runWorkflows"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { PlayIcon } from "lucide-react"
import { toast } from "sonner"

export const RunBtn = ({ workflowId }: { workflowId: string }) => {
  const mutate = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Workflow started", { id: workflowId })
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId })
    }
  })

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      disabled={mutate.isPending}
      onClick={() => {
        toast.loading("Started...", { id: workflowId })
        mutate.mutate({
          workflowId,
        })
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  )
}