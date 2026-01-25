"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useParams, useRouter } from "next/navigation"
import AdminGuard from "@/components/AdminGuard"
import CharacterForm from "@/components/CharactersCrud/CharacterForm"
import { Edit3 } from "lucide-react"

export default function EditCharacterPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "characters", id))
      if (snap.exists()) {
        setData(snap.data())
      }
    }
    load()
  }, [id])

  const handleSave = async (updatedData) => {
    await updateDoc(doc(db, "characters", id), {
      ...updatedData,
      updatedAt: serverTimestamp(),
    })

    router.push("/admin/characters")
  }

  if (!data) return null

  return (
    <AdminGuard>
      <div className="container py-20 space-y-10 animate-fade-in">
        <div className="flex items-center gap-3 text-primary font-mono text-sm uppercase tracking-widest">
          <Edit3 size={18} />
          <span>Admin · Edit Character</span>
        </div>

        <h1 className="text-4xl font-black uppercase">
          Edit <span className="text-primary">{data.name}</span>
        </h1>

        <CharacterForm initialData={data} onSave={handleSave} />
      </div>
    </AdminGuard>
  )
}
