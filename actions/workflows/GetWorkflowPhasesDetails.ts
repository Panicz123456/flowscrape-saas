"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowPhasesDetails(phaseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthorized");
  }

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc"
        }
      }
    }
  });
}
