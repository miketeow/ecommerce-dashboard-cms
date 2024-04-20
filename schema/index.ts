import * as z from "zod";

export const StoreSchema = z.object({
  name: z.string().min(1),
});

export const settingsSchema = z.object({
  name: z.string().min(1),
});

export const billboardSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string(),
});
