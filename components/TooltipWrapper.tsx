"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface iAppProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "left" | "right" | "bottom";
}

export const TooltipWrapper = (props: iAppProps) => {
  if (!props.content) {
    return props.children
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent side={props.side}>{props.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};