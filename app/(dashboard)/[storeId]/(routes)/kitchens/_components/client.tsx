"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboards } from "@/types-db";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "../../../../../../components/data-table";
import { KitchensColumn, columns } from "./columns";
import APIList from "@/components/api-list";

interface KitchenClientProps {
  data: KitchensColumn[];
}

const KitchenClient = ({ data }: KitchenClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Kitchen (${data.length})`}
          description="Add your kitchens or manage kitchens for you storage"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/kitchens/create`)}
        >
          <Plus className=" h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API call for kitchens" />
      <Separator />
      <APIList entityName="kitchens" entittyNameId="kitchenId" />
    </>
  );
};

export default KitchenClient;
