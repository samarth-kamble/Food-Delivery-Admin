"use client";
import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Modal } from "@/components/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
});

export const StoreModal = () => {
  const { toast } = useToast();

  const storeModal = useStoreModal();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/stores", values);
      toast({
        title: "Store Created",
        description: "Your store has been created successfully",
      });
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "An error occurred while creating the store",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create a New Store"
      description="Add a new store to manage the products and categories."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter Your Store Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isLoading}
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit" size={"sm"}>
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
