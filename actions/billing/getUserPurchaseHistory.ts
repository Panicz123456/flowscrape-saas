"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserPurchaseHistory() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthorized");
  }

  return prisma.userPurchase.findMany({
    where: {
      userId,
    },
    orderBy: { 
      date: "desc"
    }
  });
}
