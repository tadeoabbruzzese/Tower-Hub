"use client"

import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import AdminGuard from "@/components/AdminGuard"
import NewsForm from "@/components/News/NewsForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewNewsPage() {
  const router = useRouter()

  const handleSave = async (data) => {
    if (!data.content) return alert("El contenido es obligatorio")

    try {
      await addDoc(collection(db, "news"), {
        ...data,
        createdAt: serverTimestamp(), // Fecha interna de creación
      })
      router.push("/admin/news") // Volver a la lista
    } catch (error) {
      console.error("Error creating news:", error)
      alert("Error al guardar noticia.")
    }
  }

  return (
    <AdminGuard>
      <div className="container py-20 space-y-8 animate-fade-in">
        
        <Link href="/admin/news" className="text-sm text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
           <ArrowLeft size={16} /> Volver a lista de noticias
        </Link>

        <h1 className="text-3xl font-black uppercase tracking-tight">
          Nueva <span className="text-[#1DA1F2]">Transmisión</span>
        </h1>

        <NewsForm onSave={handleSave} />
      </div>
    </AdminGuard>
  )
}