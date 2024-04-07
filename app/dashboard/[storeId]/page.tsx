import { prismadb } from "@/lib/prismadb";
import React from "react";
type DashboardProps = {
  params: { storeId: string };
};
const DashboardPage = async ({ params }: DashboardProps) => {
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId },
  });
  return <div>Active Store: {store?.name}</div>;
};

export default DashboardPage;
