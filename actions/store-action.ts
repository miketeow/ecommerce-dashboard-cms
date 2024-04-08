"use server";
import { prismadb } from "@/lib/prismadb";
import { StoreSchema } from "@/schema";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  return { success: `Store ${name} created successfully`, data: store.id };
};

export const updateStoreNameAction = async (
  values: z.infer<typeof StoreSchema>,
  storeId: string
) => {
  const validatedFields = StoreSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid input" };
  }

  const { name } = validatedFields.data;

  const { userId } = auth();

  if (!userId) {
    return { error: "You must be logged in to change a store name" };
  }

  const store = await prismadb.store.updateMany({
    where: {
      id: storeId,
      userId,
    },
    data: {
      name,
    },
  });

  return { success: `Store ${name} renamed successfully` };
};

export const deleteStoreAction = async (storeId: string) => {
  const { userId } = auth();

  if (!userId) {
    return { error: "You must be logged in to delete a store" };
  }
  const store = await prismadb.store.deleteMany({
    where: {
      id: storeId,
      userId,
    },
  });

  return { success: `Store deleted successfully` };
};
