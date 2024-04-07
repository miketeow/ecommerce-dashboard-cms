"use server";
import { prismadb } from "@/lib/prismadb";
import { StoreSchema } from "@/schema";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const createStoreAction = async (
  values: z.infer<typeof StoreSchema>
) => {
  const validatedFields = StoreSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid input" };
  }

  const { name } = validatedFields.data;

  const { userId } = auth();

  if (!userId) {
    return { error: "You must be logged in to create a store" };
  }

  const store = await prismadb.store.create({
    data: {
      name,
      userId,
    },
  });

  revalidatePath("/");
  return { success: `Store ${name} created successfully` };
};
