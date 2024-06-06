"use client";

import Heading from "@/components/Heading";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Cuisine } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CuisinesFormProps {
  initialData: Cuisine;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

const CuisinesForm = ({ initialData }: CuisinesFormProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const parmas = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const title = initialData ? "Edit Cuisines" : "Create Cuisines";
  const description = initialData
    ? "Edit your Cuisines"
    : "Create a new Cuisines";

  const toastMesaage = initialData
    ? "Your Cuisines has been updated successfully"
    : "Your Cuisines has been created successfully";

  const action = initialData ? "Update" : "Create";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${parmas.storeId}/cuisines/${parmas.cuisineId}`,
          data
        );
        router.refresh();
        toast({
          title: "Cuisines Updated",
          description: toastMesaage,
        });
      } else {
        await axios.post(`/api/${parmas.storeId}/cuisines`, data);

        toast({
          title: "Cuisines Created",
          description: toastMesaage,
        });
      }

      router.refresh();
      router.push(`/${parmas.storeId}/cuisines`);
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "An error occurred while updating the Cuisines",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${parmas.storeId}/cuisines/${parmas.cuisineId}`);
      router.refresh();
      toast({
        title: "Cuisines Deleted",
        description: "Your Cuisines has been deleted successfully",
      });
      router.refresh();
      router.push(`/${parmas.storeId}/cuisnes`);
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "An error occurred while deleting the Cuisines",
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
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Your cuisines Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Your cuisines value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} type="submit" size={"sm"}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CuisinesForm;
