"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useParams, useRouter } from "next/navigation"
import AdminGuard from "@/components/AdminGuard"
import RelicForm from "@/components/Relics/RelicForm"
import { Edit3 } from "lucide-react"

export default function EditRelicPage() {
  const { id } = useParams() // Ahora es una promesa en Next 15, pero useParams lo maneja o necesitas await params
  const router = useRouter()
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "relics", id))
      if (snap.exists()) {
        setData(snap.data())
      }
    }
    load()
  }, [id])

  const handleSave = async (updatedData) => {
    await updateDoc(doc(db, "relics", id), {
      ...updatedData,
      updatedAt: serverTimestamp(),
    })
    router.push("/admin/relics")
  }

  if (!data) return <div className="p-20 text-center">Cargando datos de la reliquia...</div>

  return (
    <AdminGuard>
      <div className="container py-20 space-y-10 animate-fade-in">
        <div className="flex items-center gap-3 text-yellow-500 font-mono text-sm uppercase tracking-widest">
          <Edit3 size={18} />
          <span>Admin · Edit Relic</span>
        </div>
        <h1 className="text-4xl font-black uppercase">
          Edit <span className="text-yellow-500">{data.name}</span>
        </h1>
        <RelicForm initialData={data} onSave={handleSave} />
      </div>
    </AdminGuard>
  )
}