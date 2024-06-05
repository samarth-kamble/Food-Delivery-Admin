"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "../../../../../../components/data-table";
import { OrdersColumn, columns } from "./columns";

interface OrdersClientProps {
  data: OrdersColumn[];
}

const SizeClient = ({ data }: OrdersClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description=" Here you can see all the orders. You can also filter them by status."
        />
      </div>
      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default SizeClient;
