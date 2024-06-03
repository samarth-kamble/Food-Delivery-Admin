"use client";

import { ImagePlus, Trash } from "lucide-react";
import React, { HTMLAttributes, useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { useToast } from "./ui/use-toast";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import Image from "next/image";
import { Button } from "./ui/button";

interface ImagesUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImagesUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImagesUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);

    setIsLoading(true);

    // Arra to store newly uploaded url
    const newUrls: string[] = [];

    // counter to keep track of the number of files uploaded
    let counterUploads = 0;

    // Loop through the files
    files.forEach((file: File) => {
      const uploadTask = uploadBytesResumable(
        ref(storage, `Images/Products/${Date.now()}-${file.name}`),
        file,
        { contentType: file.type }
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          toast({
            title: "Error",
            description: `${error.message}`,
            variant: "destructive",
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Store the newly uploaded url
            newUrls.push(downloadURL);

            // increment the counter
            counterUploads++;

            // Check if all files have been uploaded
            if (counterUploads === files.length) {
              // Call the onChange function to update the state
              onChange([...value, ...newUrls]);
              setIsLoading(false);
            }

            setIsLoading(false);
          });
        }
      );
    });
  };

  const onDelete = async (url: string) => {
    const newValue = value.filter((imageUrl) => imageUrl !== url);
    onRemove(url);
    onChange(newValue);
    deleteObject(ref(storage, url)).then(() => {
      toast({
        title: "Delete",
        description: "Image deleted successfully",
      });
    });
  };

  return (
    <div>
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div
                className="relative w-52 h-52 rounded-md overflow-hidden "
                key={url}
              >
                <Image
                  fill
                  className="object-cover"
                  src={url}
                  alt="BillboardImage"
                />
                <div className="absolute a-10 top-2 right-2">
                  <Button
                    type="button"
                    onClick={() => onDelete(url)}
                    variant={"destructive"}
                    size={"icon"}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3">
          {isLoading ? (
            <>
              <PuffLoader size={30} color="#555" />
              <p>{`${progress.toFixed(2)}%`}</p>
            </>
          ) : (
            <>
              <label>
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                  <ImagePlus className=" h-4 w-4" />
                  <p>Upload An Image</p>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  className=" w-0 h-0"
                  multiple
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagesUpload;
