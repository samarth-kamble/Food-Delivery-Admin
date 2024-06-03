import { db } from "@/lib/firebase";
import { Cuisine } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import CuisinesForm from "../_components/cuisnes-form";

const CuisinePage = async ({
  params,
}: {
  params: { storeId: string; cuisineId: string };
}) => {
  const cuisne = (
    await getDoc(
      doc(db, "stores", params.storeId, "cuisines", params.cuisineId)
    )
  ).data() as Cuisine;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisinesForm initialData={cuisne} />
      </div>
    </div>
  );
};

export default CuisinePage;
