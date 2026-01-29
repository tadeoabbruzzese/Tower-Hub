"use client"

import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import AdminGuard from "@/components/AdminGuard"
import RelicForm from "@/components/Relics/RelicForm" // <--- Importa el nuevo form
import { Plus } from "lucide-react"
import { useState } from "react"

export default function NewRelicPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  // Slug generator (Igual que en Characters)
  const createSlug = (text) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  }

  const handleSave = async (data) => {
    if (!data.name) return alert("El nombre es obligatorio")
    setIsSaving(true)

    try {
      const generatedId = createSlug(data.name)
      await setDoc(doc(db, "relics", generatedId), { // Colección "relics"
        ...data,
        id: generatedId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      router.push("/admin/relics")
    } catch (error) {
      console.error("Error creating relic:", error)
      alert("Error al guardar.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminGuard>
      <div className="container py-20 space-y-10 animate-fade-in">
        <div className="flex items-center gap-3 text-yellow-500 font-mono text-sm uppercase tracking-widest">
          <Plus size={18} />
          <span>Admin · Create Relic</span>
        </div>
        <h1 className="text-4xl font-black uppercase">
          New <span className="text-yellow-500">Relic</span>
        </h1>
        {isSaving ? (
           <div className="text-yellow-500 font-mono">Guardando en base de datos...</div>
        ) : (
           <RelicForm onSave={handleSave} />
        )}
      </div>
    </AdminGuard>
  )
}