"use client";

import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface iAppProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;

  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export const CustomDialogHeader = (props: iAppProps) => {
  return (
    <DialogHeader>
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {props.icon && (
            <props.icon
              size={30}
              className={cn("stroke-primary", props.iconClassName)}
            />
          )}
          {props.title && (
						<p className={cn("text-xl text-primary", props.titleClassName)}>
							{props.title}
						</p>
					)}
					{props.subtitle && ( 
						<p className={cn("text-sm text-muted-foreground", props.subtitleClassName)}>
							{props.subtitle}
						</p>
					)}
        </div>
			</DialogTitle>
			<Separator />
    </DialogHeader>
  );
};
