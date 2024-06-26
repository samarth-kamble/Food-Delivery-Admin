"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboards } from "@/types-db";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "../../../../../../components/data-table";
import { BillboardColumn, columns } from "./columns";
import APIList from "@/components/api-list";

interface BillboardsClientProps {
  data: BillboardColumn[];
}

const BillboardsClient = ({ data }: BillboardsClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Add your billboards or manage billboard for you storage"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/create`)}
        >
          <Plus className=" h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API call for categories" />
      <Separator />
      <APIList entityName="billboards" entittyNameId="billboardId" />
    </>
  );
};

export default BillboardsClient;
