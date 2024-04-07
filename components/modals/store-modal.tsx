"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { StoreSchema } from "@/schema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createStoreAction } from "@/actions/store-action";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof StoreSchema>>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof StoreSchema>) => {
    startTransition(() => {
      createStoreAction(values).then((res) => {
        if (res.error) {
          console.log(res.error);
        } else {
          console.log(res.success);
        }
      });
    });
  };

  return (
    <Modal
      title="Create a new store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Store name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex pt-6 space-x-2 items-center justify-end w-full">
                <Button variant="outline" onClick={storeModal.onClose}>
                  Cancel
                </Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
