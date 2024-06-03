import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Size } from "@/types-db";
import { format } from "date-fns";
import SizeClient from "./_components/client";
import { KitchensColumn } from "./_components/columns";

const KitchensPage = async ({ params }: { params: { storeId: string } }) => {
  const kitchenData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "kitchens"))
  ).docs.map((doc) => doc.data()) as Size[];

  const formattedSizes: KitchensColumn[] = kitchenData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default KitchensPage;
