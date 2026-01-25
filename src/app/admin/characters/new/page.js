"use client"

import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import AdminGuard from "@/components/AdminGuard"
import CharacterForm from "@/components/CharactersCrud/CharacterForm" // Asegurate que la ruta sea correcta
import { Plus } from "lucide-react"
import { useState } from "react" // Agregamos estado para feedback visual

export default function NewCharacterPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  // Función para convertir "Roslyn (Ice)" a "roslyn-ice"
  const createSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Reemplaza espacios con guiones
      .replace(/[^\w\-]+/g, '') // Elimina caracteres no alfanuméricos
      .replace(/\-\-+/g, '-')   // Reemplaza múltiples guiones con uno solo
  }

  const handleSave = async (data) => {
    // 1. Validación básica
    if (!data.simulacrumName) return alert("El nombre del Simulacrum es obligatorio")

    setIsSaving(true)

    try {
      // 2. Generamos el ID a partir del nombre (Ej: "Yanuo" -> "yanuo")
      const generatedId = createSlug(data.simulacrumName)

      // 3. Guardamos en Firebase usando ese ID generado
      await setDoc(doc(db, "characters", generatedId), {
        ...data,
        id: generatedId, // Guardamos el ID también dentro del documento por si acaso
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // 4. Redirección
      router.push("/admin/characters")
      
    } catch (error) {
      console.error("Error creating character:", error)
      alert("Error al guardar. Revisa la consola.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminGuard>
      <div className="container py-20 space-y-10 animate-fade-in">
        <div className="flex items-center gap-3 text-primary font-mono text-sm uppercase tracking-widest">
          <Plus size={18} />
          <span>Admin · Create Character</span>
        </div>

        <h1 className="text-4xl font-black uppercase">
          New <span className="text-primary">Character</span>
        </h1>

        {/* Pasamos isSaving si quisieras bloquear el botón en el formulario, 
            pero por ahora solo maneja el guardado */}
        {isSaving ? (
           <div className="text-yellow-500 font-mono">Guardando en base de datos...</div>
        ) : (
           <CharacterForm onSave={handleSave} />
        )}
      </div>
    </AdminGuard>
  )
}