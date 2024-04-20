"use client";
import React from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import {
  BillboardColumn,
  columns,
} from "@/app/dashboard/[storeId]/billboards/columns";
import { DataTable } from "@/components/ui/data-table";

type BillboardClientProps = {
  data: BillboardColumn[];
};
const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() =>
            router.push(`/dashboard/${params.storeId}/billboards/new`)
          }
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};

export default BillboardClient;
