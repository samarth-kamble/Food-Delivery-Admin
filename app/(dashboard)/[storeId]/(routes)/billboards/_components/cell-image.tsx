"use client";

import Image from "next/image";
import { BillboardColumn } from "./columns";

interface CellImageProps {
  imageUrl: string;
}
const CellImage = ({ imageUrl }: CellImageProps) => {
  return (
    <div className="overflow-hidden w-32 min-h-16  h-16 min-w-32 relative rounded-md shadow-md">
      <Image fill className="object-cover" src={imageUrl} alt="billboard" />
    </div>
  );
};

export default CellImage;
