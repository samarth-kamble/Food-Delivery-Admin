import { db } from "@/lib/firebase";
import { Cuisine } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; cuisineId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("value ID is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!params.cuisineId) {
      return new NextResponse("Cuisines ID is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const sizeRef = await getDoc(
      doc(db, "stores", params.storeId, "cuisines", params.cuisineId)
    );

    if (sizeRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "cuisines", params.cuisineId),
        {
          ...sizeRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Size not found", { status: 404 });
    }

    const size = (
      await getDoc(
        doc(db, "stores", params.storeId, "cuisines", params.cuisineId)
      )
    ).data() as Cuisine;

    return NextResponse.json(size);
  } catch (error) {
    console.error(`SIZE_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; cuisineId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    if (!params.cuisineId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 500 });
      }
    }

    const cuisinesRef = doc(
      db,
      "stores",
      params.storeId,
      "cuisines",
      params.cuisineId
    );

    await deleteDoc(cuisinesRef);

    return NextResponse.json({ message: "Cuisines deleted" });
  } catch (error) {
    console.error(`SIZE_DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
