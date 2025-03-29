"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credentials";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCredential(form: createCredentialsSchemaType) {
  const { data, success } = createCredentialsSchema.safeParse(form);

  if (!success) {
    throw new Error("invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthorized");
  }

  const encryptValue = symmetricEncrypt(data.value as string);

  console.log("@test", { 
  plain: data.value,
  encrypted: encryptValue
  })

  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptValue,
    },
  });

  if (!result) {
    throw new Error("result not found");
  }

  revalidatePath("/credentials");
}
