"use client"

import { DownloadInvoice } from "@/actions/billing/DownloadInvoice"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export const InvoiceBtn = ({ id }: { id: string }) => {
  const mutation = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => {
      window.location.href = data as string
    },
    onError: () => {
      toast.error("Something went wrong")
    }
  })
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs gap-2 text-muted-foreground"
      disabled={mutation.isPending}
      onClick={() => {
        mutation.mutate(id)
      }}
    >
      Invoice
      {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
    </Button>
  )
} 