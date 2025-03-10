"use client"

import { TooltipWrapper } from "@/components/TooltipWrapper"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { SaveBtn } from "./SaveButton"
import { ExecuteBtn } from "./ExecuteBtn"

interface iAppProps {
  title: string;
  workflowId: string;
  subtitle?: string;
  hideButtons?: boolean
}

export const Topbar = ({ title, subtitle, workflowId, hideButtons = false }: iAppProps) => {
  const router = useRouter()

  return (
    <header className="flex p-2 border-b-2 border-separate
    justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <h1 className="font-bold text-ellipsis truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            <SaveBtn workflowId={workflowId} />
          </>
        )}
      </div>
    </header>
  )
}
