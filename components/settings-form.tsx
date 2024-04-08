"use client";
import { Store } from "@prisma/client";
import React, { useState, useTransition } from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { settingsSchema } from "@/schema";
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
import {
  deleteStoreAction,
  updateStoreNameAction,
} from "@/actions/store-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import { ApiAlert } from "./ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

type SettingsFormProps = {
  initialData: Store;
};

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, setOpen] = useState(false);
  const [updatePending, startUpdateTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const origin = useOrigin();
  const router = useRouter();
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    startUpdateTransition(() => {
      updateStoreNameAction(values, initialData.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.refresh();
        }
      });
    });
  };

  const onDelete = async () => {
    startDeleteTransition(() => {
      deleteStoreAction(initialData.id).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res.success);
          router.refresh();
        }
      });
    });
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          onDelete();
        }}
        loading={deletePending}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            setOpen(true);
          }}
        >
          <FaTrash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={updatePending}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={updatePending} type="submit" className="ml-auto">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${initialData.id}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
