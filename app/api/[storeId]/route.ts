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

    // Create a new store with the user's ID
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId);

    await updateDoc(docRef, { name });

    const store = (await getDoc(docRef)).data() as Store;

    return NextResponse.json(store);
  } catch (error) {
    console.error(`STORES_PATCH: ${error}`);
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

    // TODO: Delete all the sub collection and along with those data file

    // billboards delete
    const billboardsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/billboards`)
    );

    billboardsQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);

      // delete the image from storage
      const imageUrl = doc.data().imageUrl;
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    });

    // categories delete
    const categoriesQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/categories`)
    );

    categoriesQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // sizes delete
    const sizesQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/sizes`)
    );

    sizesQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // kitchens delete
    const kitchensQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/kitchens`)
    );

    kitchensQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // cuisine delete
    const cuisineQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/cuisine`)
    );

    cuisineQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // products delete
    const productsQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/products`)
    );

    productsQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);

      // delete the image array from storage
      const imageArray = doc.data().images;
      if (imageArray && Array.isArray(imageArray)) {
        await Promise.all(
          imageArray.map(async (image) => {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          })
        );
      }
    });

    // orders delete
    const ordersQuerySnapshot = await getDocs(
      collection(db, `stores/${params.storeId}/orders`)
    );

    ordersQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);

      // delete the image array from storage
      const imageArray = doc.data().images;
      if (imageArray && Array.isArray(imageArray)) {
        await Promise.all(
          imageArray.map(async (orderItem) => {
            const itemImageArray = orderItem.images;
            if (itemImageArray && Array.isArray(itemImageArray)) {
              await Promise.all(
                itemImageArray.map(async (image) => {
                  const imageRef = ref(storage, image.url);
                  await deleteObject(imageRef);
                })
              );
            }
          })
        );
      }
    });

    const docRef = doc(db, "stores", params.storeId);

    await deleteDoc(docRef);

    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error(`STORES_DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
