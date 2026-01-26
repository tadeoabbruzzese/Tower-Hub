"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import AdminGuard from "@/components/AdminGuard"
import { Twitter, Plus, Trash2, ExternalLink, Calendar } from "lucide-react"

export default function AdminNewsList() {
  const [news, setNews] = useState([])

  // Cargar noticias
  useEffect(() => {
    const load = async () => {
      // Ordenamos por fecha de la noticia (descendente)
      const q = query(collection(db, "news"), orderBy("date", "desc"))
      const snap = await getDocs(q)
      setNews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  // Borrar noticia
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta noticia? Desaparecerá del Home.")) return
    
    try {
      await deleteDoc(doc(db, "news", id))
      setNews(news.filter(n => n.id !== id)) // Actualizar UI
    } catch (error) {
      console.error(error)
      alert("Error al eliminar")
    }
  }

  return (
    <AdminGuard>
      <div className="container py-20 space-y-10 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
             <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
               <Twitter className="text-[#1DA1F2]" size={36} />
               Hykros <span className="text-[#1DA1F2]">Comms</span>
             </h1>
             <p className="text-gray-500">Gestiona las noticias que aparecen en el Home.</p>
          </div>
          <Link href="/admin/news/new" className="btn bg-[#1DA1F2] hover:bg-[#1a91da] text-white gap-2 shadow-lg shadow-[#1DA1F2]/20">
            <Plus size={18} /> Nueva Noticia
          </Link>
        </div>

        {/* FEED LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="relative group bg-card border border-border rounded-xl p-6 hover:border-[#1DA1F2]/50 transition-all">
              
              {/* Botón Borrar (Flotante) */}
              <button 
                onClick={() => handleDelete(item.id)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-10"
                title="Eliminar Noticia"
              >
                <Trash2 size={16} />
              </button>

              {/* Header Card */}
              <div className="flex items-center gap-3 mb-4 opacity-80">
                 <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                    <Twitter size={16} fill="currentColor" />
                 </div>
                 <div className="text-xs">
                    <p className="font-bold text-white">Tower of Fantasy</p>
                    <p className="text-gray-500 flex items-center gap-1">
                      <Calendar size={10} /> {item.date}
                    </p>
                 </div>
              </div>

              {/* Contenido */}
              <p className="text-sm text-gray-300 mb-4 line-clamp-4 leading-relaxed">
                {item.content}
              </p>

              {/* Imagen (Si tiene) */}
              {item.image && (
                <div className="mb-4 h-32 rounded-lg overflow-hidden border border-border">
                  <img src={item.image} alt="News media" className="w-full h-full object-cover opacity-80" />
                </div>
              )}

              {/* Link Footer */}
              <a 
                href={item.link} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-[#1DA1F2] uppercase tracking-wider flex items-center gap-1 hover:underline"
              >
                Ver Tweet Original <ExternalLink size={12} />
              </a>

            </div>
          ))}

          {news.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-xl">
              <p className="text-gray-500">No hay noticias registradas en la base de datos.</p>
            </div>
          )}
        </div>

      </div>
    </AdminGuard>
  )
}