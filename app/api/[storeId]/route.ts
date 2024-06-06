import { db, storage } from "@/lib/firebase";
import { Store } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);

    await updateDoc(docRef, { name });

    const storeDoc = await getDoc(docRef);
    if (!storeDoc.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const store = storeDoc.data() as Store;

    return NextResponse.json(store);
  } catch (error) {
    console.error(`STORES_PATCH:    `, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is missing", { status: 400 });
    }

    const storeId = params.storeId;

    const deleteSubCollection = async (subCollectionName: string) => {
      const querySnapshot = await getDocs(
        collection(db, `stores/${storeId}/${subCollectionName}`)
      );
      const deletePromises = querySnapshot.docs.map(async (doc) => {
        if (
          subCollectionName === "billboards" ||
          subCollectionName === "products" ||
          subCollectionName === "orders"
        ) {
          const imageArray = doc.data().images || doc.data().imageUrl;
          if (Array.isArray(imageArray)) {
            await Promise.all(
              imageArray.map(async (image: { url: string }) => {
                const imageRef = ref(storage, image.url);
                await deleteObject(imageRef);
              })
            );
          } else if (imageArray) {
            const imageRef = ref(storage, imageArray);
            await deleteObject(imageRef);
          }
        }
        await deleteDoc(doc.ref);
      });
      await Promise.all(deletePromises);
    };

    await Promise.all([
      deleteSubCollection("billboards"),
      deleteSubCollection("categories"),
      deleteSubCollection("sizes"),
      deleteSubCollection("kitchens"),
      deleteSubCollection("cuisines"),
      deleteSubCollection("products"),
      deleteSubCollection("orders"),
    ]);

    const docRef = doc(db, "stores", storeId);
    await deleteDoc(docRef);

    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
