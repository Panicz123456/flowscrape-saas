'use client'

import { UnPublishWorkflow } from "@/actions/workflows/UnPublishWorkflow"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { DownloadIcon } from "lucide-react"
import { toast } from "sonner"

export const UnPublishBtn = ({ workflowId }: { workflowId: string }) => {

  const mutation = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: workflowId })
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId })
    },

  })
  return (
    <Button
      disabled={mutation.isPending}
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {

        toast.loading("UnPublishing workflow...", { id: workflowId })
        mutation.mutate(workflowId)
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  )
}