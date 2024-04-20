"use server";
import { prismadb } from "@/lib/prismadb";
import { billboardSchema } from "@/schema";
import { auth } from "@clerk/nextjs";
import * as z from "zod";

export const createBillboardAction = async (
  values: z.infer<typeof billboardSchema>,
  storeId: string
) => {
  const validatedFields = billboardSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid input" };
  }

  const { label, imageUrl } = validatedFields.data;

  const { userId } = auth();

  if (!userId) {
    return { error: "You must be logged in to create a billboard" };
  }

  if (!storeId) {
    return { error: "Store ID is required" };
  }

  const billboard = await prismadb.billboard.create({
    data: {
      label,
      imageUrl,
      storeId,
    },
  });

  return {
    success: `Billboard ${label} created successfully`,
    data: billboard.id,
  };
};

export const updateBillboardAction = async (
  values: z.infer<typeof billboardSchema>,
  storeId: string,
  billboardId: string
) => {
  const validatedFields = billboardSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid input" };
  }

  const { label, imageUrl } = validatedFields.data;

  const { userId } = auth();

  if (!userId) {
    return { error: "You must be logged in to update a billboard" };
  }

  if (!storeId) {
    return { error: "Store ID is required" };
  }

  if (!billboardId) {
    return { error: "Billboard ID is required" };
  }

  const storeByUserId = await prismadb.store.findUnique({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!storeByUserId) {
    return { error: "Unauthorized" };
  }

  const billboard = await prismadb.billboard.update({
    where: {
      id: billboardId,
    },
    data: {
      label,
      imageUrl,
    },
  });

  return {
    success: `Billboard ${label} updated successfully`,
    data: billboard.id,
  };
};

export const deleteBillboardAction = async (
  storeId: string,
  billboardId: string
) => {
  const { userId } = auth();

  if (!userId) {
    return { error: "You must be logged in to delete a billboard" };
  }

  const storeByUserId = await prismadb.store.findUnique({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!storeByUserId) {
    return { error: "Unauthorized" };
  }

  const billboard = await prismadb.billboard.delete({
    where: {
      id: billboardId,
    },
  });

  return {
    success: `Billboard ${billboardId} deleted successfully`,
  };
};
