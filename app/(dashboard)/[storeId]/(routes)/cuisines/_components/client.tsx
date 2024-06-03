"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboards } from "@/types-db";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "../../../../../../components/data-table";
import { CuisineColumn, columns } from "./columns";
import APIList from "@/components/api-list";

interface CuisineClinetProps {
  data: CuisineColumn[];
}

const CuisinesClient = ({ data }: CuisineClinetProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cuisine (${data.length})`}
          description="Add your cuisines or manage cuisines for you storage"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/cuisines/create`)}
        >
          <Plus className=" h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API call for cuisines" />
      <Separator />
      <APIList entityName="cuisines" entittyNameId="cuisineId" />
    </>
  );
};

export default CuisinesClient;
