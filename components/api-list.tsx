"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation";
import ApiAlert from "./api-alert";

interface APIListProps {
  entityName: string;
  entittyNameId: string;
}

const APIList = ({ entityName, entittyNameId }: APIListProps) => {
  const router = useRouter();
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/${entittyNameId}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/${entittyNameId}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/${entittyNameId}`}
      />
    </>
  );
};

export default APIList;
