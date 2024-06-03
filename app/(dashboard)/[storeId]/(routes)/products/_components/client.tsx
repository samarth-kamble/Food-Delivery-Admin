"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboards } from "@/types-db";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "../../../../../../components/data-table";
import { ProductColumns, columns } from "./columns";
import APIList from "@/components/api-list";

interface ProductsClientProps {
  data: ProductColumns[];
}

const ProductsClient = ({ data }: ProductsClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Product (${data.length})`}
          description="Add your products or manage products for you storage"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/products/create`)}
        >
          <Plus className=" h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API call for products" />
      <Separator />
      <APIList entityName="products" entittyNameId="productId" />
    </>
  );
};

export default ProductsClient;
