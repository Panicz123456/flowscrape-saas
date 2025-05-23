"use server";

import { PeriodToDataRange } from "@/lib/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

export async function getWorkflowExecutionStats(period: Period) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const dataRange = PeriodToDataRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dataRange.startDate,
        lte: dataRange.endDate,
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dataRange.startDate,
    end: dataRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat);
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    }
    if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
