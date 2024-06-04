import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Size } from "@/types-db";
import { format } from "date-fns";
import { ProductsColumn } from "./_components/columns";
import { formatter } from "@/lib/utils";
import ProductsClient from "./_components/client";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const productData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "products"))
  ).docs.map((doc) => doc.data()) as Product[];

  const formattedProduct: ProductsColumn[] = productData.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    isFeatured: item.isFeatured,
    isArchieved: item.isArchieved,
    category: item.category,
    size: item.size,
    kitchen: item.kitchen,
    cuisine: item.cuisine,
    images: item.images,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProduct} />
      </div>
    </div>
  );
};

export default ProductsPage;
