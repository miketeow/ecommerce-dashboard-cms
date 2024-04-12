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
