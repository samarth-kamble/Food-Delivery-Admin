"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const BillboardsClient = () => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards(0)`}
          description="Add your billboards or manage billboard for you storage"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/create`)}
        >
          <Plus className=" h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
    </>
  );
};

export default BillboardsClient;
