"use client";
import { PlusCircle } from "lucide-react";
import React from "react";

interface CreateNewStoreItemProps {
  onClick: () => void;
}

const CreateNewStoreItem = ({ onClick }: CreateNewStoreItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-2 py-1 cursor-pointer text-muted-foreground hover:text-primary"
    >
      <PlusCircle className="mr-2 h-5 w-5" />
      Create New Store
    </div>
  );
};

export default CreateNewStoreItem;
