import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  where,
  query,
  and,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const {
      name,
      price,
      images,
      isFeatured,
      isArchieved,
      category,
      size,
      kitchen,
      cuisine,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!category) {
      return new NextResponse("Category is missing", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const productData = {
      name,
      price,
      images,
      isFeatured,
      isArchieved,
      category,
      size,
      kitchen,
      cuisine,
      createdAt: serverTimestamp(),
    };

    const productRef = await addDoc(
      collection(db, "stores", params.storeId, "products"),
      productData
    );

    const id = productRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "products", id), {
      ...productData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...productData });
  } catch (error) {
    console.error(`PRODUCTS_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    //  get the search params request.url

    const { searchParams } = new URL(req.url);
    const productRef = collection(
      doc(db, "stores", params.storeId),
      "products"
    );

    let productQuery;

    let queryContraint = [];

    if (searchParams.has("size")) {
      queryContraint.push(where("size", "==", searchParams.get("size")));
    }
    if (searchParams.has("category")) {
      queryContraint.push(
        where("category", "==", searchParams.get("category"))
      );
    }
    if (searchParams.has("kitchen")) {
      queryContraint.push(where("kitchen", "==", searchParams.get("kitchen")));
    }
    if (searchParams.has("cuisine")) {
      queryContraint.push(where("cuisine", "==", searchParams.get("cuisine")));
    }
    if (searchParams.has("isFetured")) {
      queryContraint.push(
        where(
          "isFetured",
          "==",
          searchParams.get("isFetured") === "true" ? true : false
        )
      );
    }
    if (searchParams.has("isArchived")) {
      queryContraint.push(
        where(
          "isArchived",
          "==",
          searchParams.get("isArchived") === "true" ? true : false
        )
      );
    }

    if (queryContraint.length > 0) {
      productQuery = query(productRef, and(...queryContraint));
    } else {
      productQuery = query(productRef);
    }

    // excute the query

    const querySnapshot = await getDocs(productQuery);
    const productData: Product[] = querySnapshot.docs.map(
      (doc) => doc.data() as Product
    );

    return NextResponse.json(productData);
  } catch (error) {
    console.error(`PRODUCTS_GET: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
