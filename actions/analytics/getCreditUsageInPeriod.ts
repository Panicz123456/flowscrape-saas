"use server";

import { PeriodToDataRange } from "@/lib/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

const { COMPLETED, FAILED } = ExecutionPhaseStatus;

export async function getCreditsUsageInPeriod(period: Period) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const dataRange = PeriodToDataRange(period);
  const executionsPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dataRange.startDate,
        lte: dataRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
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

  executionsPhases.forEach((phases) => {
    const date = format(phases.startedAt!, dateFormat);
    if (phases.status === COMPLETED) {
      stats[date].success += phases.creditsConsumed || 0;
    }
    if (phases.status === FAILED) {
      stats[date].failed += phases.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
