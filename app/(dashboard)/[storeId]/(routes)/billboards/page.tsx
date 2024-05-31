import React from "react";
import BillboardsClient from "./_components/client";

const Billboards = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsClient />
      </div>
    </div>
  );
};

export default Billboards;
