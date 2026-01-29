"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import AdminGuard from "@/components/AdminGuard"
import { Box, Plus, Edit3, ImageOff } from "lucide-react"

export default function AdminRelics() {
  const [relics, setRelics] = useState([])

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "relics"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      setRelics(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  return (
    <AdminGuard>
      <div className="container py-20 space-y-12 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-yellow-500 font-mono text-sm uppercase tracking-widest">
              <Box size={18} />
              <span>Admin · Relics</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Relic <span className="text-yellow-500">Database</span>
            </h1>
            <p className="text-foreground/50 max-w-2xl">
              Gestión de Reliquias SSR y SR.
            </p>
          </div>
          <Link
            href="/admin/relics/new"
            className="btn bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-3 shadow-lg shadow-yellow-500/20"
          >
            <Plus size={18} />
            Create Relic
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relics.map((relic) => (
            <Link
              key={relic.id}
              href={`/admin/relics/${relic.id}`}
              className="group relative h-64 rounded-xl overflow-hidden border border-border bg-card hover:border-yellow-500/50 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Imagen Fondo */}
              <div className="absolute inset-0 p-8 flex items-center justify-center bg-[#0b0c15]">
                 {relic.image ? (
                   <img src={relic.image} alt={relic.name} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                 ) : (
                   <div className="flex flex-col items-center text-muted-foreground gap-2"><ImageOff size={24} /><span className="text-xs">No Icon</span></div>
                 )}
              </div>
              
              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mb-2 inline-block ${relic.rarity === 'SSR' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-purple-500/20 text-purple-500 border-purple-500/30'}`}>
                   {relic.rarity}
                 </span>
                 <h3 className="text-xl font-black text-white uppercase italic">{relic.name}</h3>
              </div>

              {/* Edit Icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full backdrop-blur border border-white/10 text-white">
                <Edit3 size={14} />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </AdminGuard>
  )
}