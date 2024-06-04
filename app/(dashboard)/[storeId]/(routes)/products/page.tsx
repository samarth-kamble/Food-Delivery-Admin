import React from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Size, Category, Kitchen, Cuisine } from "@/types-db";
import { format } from "date-fns";
import { ProductsColumn } from "./_components/columns";
import { formatter } from "@/lib/utils";
import ProductsClient from "./_components/client";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const productsCollection = collection(
    doc(db, "stores", params.storeId),
    "products"
  );
  const categoriesCollection = collection(
    doc(db, "stores", params.storeId),
    "categories"
  );
  const sizesCollection = collection(
    doc(db, "stores", params.storeId),
    "sizes"
  );
  const kitchensCollection = collection(
    doc(db, "stores", params.storeId),
    "kitchens"
  );
  const cuisinesCollection = collection(
    doc(db, "stores", params.storeId),
    "cuisines"
  );

  const [productDocs, categoryDocs, sizeDocs, kitchenDocs, cuisineDocs] =
    await Promise.all([
      getDocs(productsCollection),
      getDocs(categoriesCollection),
      getDocs(sizesCollection),
      getDocs(kitchensCollection),
      getDocs(cuisinesCollection),
    ]);

  const products = productDocs.docs.map((doc) => doc.data()) as Product[];
  const categories = categoryDocs.docs.map((doc) => doc.data()) as Category[];
  const sizes = sizeDocs.docs.map((doc) => doc.data()) as Size[];
  const kitchens = kitchenDocs.docs.map((doc) => doc.data()) as Kitchen[];
  const cuisines = cuisineDocs.docs.map((doc) => doc.data()) as Cuisine[];

  const categoryMap = Object.fromEntries(
    categories.map((category) => [category.id, category.name])
  );
  const sizeMap = Object.fromEntries(sizes.map((size) => [size.id, size.name]));
  const kitchenMap = Object.fromEntries(
    kitchens.map((kitchen) => [kitchen.id, kitchen.name])
  );
  const cuisineMap = Object.fromEntries(
    cuisines.map((cuisine) => [cuisine.id, cuisine.name])
  );

  const formattedProduct: ProductsColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    isFeatured: item.isFeatured,
    isArchieved: item.isArchieved,
    category: categoryMap[item.category] || item.category,
    size: sizeMap[item.size] || item.size,
    kitchen: kitchenMap[item.kitchen] || item.kitchen,
    cuisine: cuisineMap[item.cuisine] || item.cuisine,
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
