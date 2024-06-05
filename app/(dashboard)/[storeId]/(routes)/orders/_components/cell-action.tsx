"use client";

import React, { use, useState } from "react";
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

import axios from "axios";
import { AlertModal } from "@/components/modal/alert-modal";
import { SizeColumn } from "./columns";

interface CellActionProps {
  data: SizeColumn;
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
      await axios.delete(`/api/${parmas.storeId}/sizes/${data.id}`);
      toast({
        title: "Size Deleted",
        description: "Your Size has been deleted successfully",
      });
      location.reload();
      router.push(`/${parmas.storeId}/sizes`);
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "An error occurred while deleting the Sizes",
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
            onClick={() => router.push(`/${parmas.storeId}/sizes/${data.id}`)}
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
