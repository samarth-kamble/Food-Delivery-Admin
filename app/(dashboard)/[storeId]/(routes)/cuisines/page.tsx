import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Size } from "@/types-db";
import { format } from "date-fns";
import SizeClient from "./_components/client";
import { CuisineColumn } from "./_components/columns";
import CuisinesClient from "./_components/client";

const CuisinePage = async ({ params }: { params: { storeId: string } }) => {
  const cuisinesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "cuisines"))
  ).docs.map((doc) => doc.data()) as Size[];

  const formattedSizes: CuisineColumn[] = cuisinesData.map((item) => ({
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
        <CuisinesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default CuisinePage;
