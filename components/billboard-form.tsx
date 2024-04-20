"use client";
import { Billboard } from "@prisma/client";
import React, { useState, useTransition } from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { billboardSchema } from "@/schema";
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
import { usePathname, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import { UploadButton } from "@/utils/uploadthing";
import {
  createBillboardAction,
  updateBillboardAction,
} from "@/actions/billboard-action";
import { toast } from "sonner";
import { ClientUploadedFileData } from "uploadthing/types";

type BillboardFormProps = {
  initialData: Billboard | null;
  storeId: string;
};

const BillboardForm = ({ initialData, storeId }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [createPending, startCreateTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  const router = useRouter();

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit billboard" : "Create a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<z.infer<typeof billboardSchema>>({
    resolver: zodResolver(billboardSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const handleUploadComplete = (
    res: ClientUploadedFileData<{
      uploadedBy: string;
    }>[]
  ) => {
    const imageUrl = res[0].url;
    setImageUrl(imageUrl);
  };
  //
  const onSubmit = async (values: z.infer<typeof billboardSchema>) => {
    values.imageUrl = imageUrl;

    startCreateTransition(() => {
      if (initialData) {
        updateBillboardAction(values, storeId, initialData.id).then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success(res.success);
            router.push(`/dashboard/${storeId}/billboards/${res.data}`);
          }
        });
      } else {
        createBillboardAction(values, storeId).then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success(res.success);
            router.push(`/dashboard/${storeId}/billboards`);
          }
        });
      }

      toast.success(toastMessage);
    });
  };

  const onDelete = async () => {};

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
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            <FaTrash className="h-4 w-4" />
          </Button>
        )}
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
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={createPending}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      name="imageUrl"
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                      }}
                      value={imageUrl}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                // Do something with the error.
                toast.error(`ERROR! ${error.message}`);
              }}
            />
          </div>
          <Button disabled={createPending} type="submit" className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
