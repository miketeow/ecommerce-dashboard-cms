import BillboardForm from "@/components/billboard-form";
import { prismadb } from "@/lib/prismadb";
import React from "react";

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; billboardId: string };
}) => {
  console.log(params);

  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} storeId={params.storeId} />
      </div>
    </div>
  );
};

export default BillboardPage;
