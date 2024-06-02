"use client";

import React, { use, useState } from "react";
import { CategoryColoumn } from "./columns";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { AlertModal } from "@/components/modal/alert-modal";

interface CellActionProps {
  data: CategoryColoumn;
}

const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const parmas = useParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "ID Copied",
      description: "The ID has been copied to your clipboard",
    });
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${parmas.storeId}/categories/${data.id}`);
      toast({
        title: "Category Deleted",
        description: "Your Category has been deleted successfully",
      });
      router.refresh();
      router.push(`/${parmas.storeId}/categories`);
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "An error occurred while deleting the Category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${parmas.storeId}/categories/${data.id}`)
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
