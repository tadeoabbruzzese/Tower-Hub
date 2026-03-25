import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import SimulacrumPage from "@/components/simulacra/SimulacrumPage";

function toPlainValue(value) {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(toPlainValue);
  }

  if (typeof value === "object") {
    if (
      typeof value.toDate === "function" &&
      typeof value.seconds === "number" &&
      typeof value.nanoseconds === "number"
    ) {
      return value.toDate().toISOString();
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, toPlainValue(nestedValue)])
    );
  }

  return value;
}

async function getCharacter(id) {
  const docRef = doc(db, "characters", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return toPlainValue({ id: docSnap.id, ...docSnap.data() });
}

export default async function Page({ params }) {
  const { id } = await params;
  const char = await getCharacter(id);
  if (!char) notFound();
  return <SimulacrumPage char={char} />;
}
