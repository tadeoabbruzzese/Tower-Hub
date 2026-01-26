"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import AdminGuard from "@/components/AdminGuard"
import { Users, Plus, Edit3, ImageOff } from "lucide-react"

// --- HELPER PARA COLORES (Igual que en la galería pública) ---
const getElementColor = (element) => {
  const mainElement = element ? element.split("-")[0].toLowerCase() : 'altered';
  
  const colors = {
    volt: "text-purple-400 border-purple-500/50 hover:shadow-purple-500/20",
    ice: "text-cyan-400 border-cyan-500/50 hover:shadow-cyan-500/20",
    flame: "text-orange-400 border-orange-500/50 hover:shadow-orange-500/20",
    physical: "text-yellow-400 border-yellow-500/50 hover:shadow-yellow-500/20",
    altered: "text-green-400 border-green-500/50 hover:shadow-green-500/20",
  }
  return colors[mainElement] || colors.altered
}

export default function AdminCharacters() {
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    const load = async () => {
      // Ordenamos por fecha para que los nuevos salgan primero en el admin también
      const q = query(collection(db, "characters"), orderBy("releaseDate", "desc"))
      const snap = await getDocs(q)
      setCharacters(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [])

  return (
    <AdminGuard>
      <div className="container py-20 space-y-12 animate-fade-in">
        {/* ===============================
            HEADER
        ================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-primary font-mono text-sm uppercase tracking-widest">
              <Users size={18} />
              <span>Admin · Characters</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Character <span className="text-primary">Database</span>
            </h1>

            <p className="text-foreground/50 max-w-2xl">
              Gestión de Simulacrums. Estas entradas alimentan la galería pública.
            </p>
          </div>

          <Link
            href="/admin/characters/new"
            className="btn btn-primary gap-3 self-start md:self-auto shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Create Character
          </Link>
        </div>

        {/* ===============================
            GRID VISUAL (Estilo Gallery)
        ================================ */}
        {characters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((c, idx) => {
              // Obtenemos estilos dinámicos basados en el elemento
              const themeClass = getElementColor(c.element);

              return (
                <Link
                  key={c.id}
                  href={`/admin/characters/${c.id}`} // Asumiendo que esta ruta es para editar
                  className={`
                    group relative h-80 rounded-xl overflow-hidden border bg-card transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl
                    ${themeClass} border-border hover:border-current
                  `}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* --- IMAGEN DE FONDO --- */}
                  <div className="absolute inset-0 z-0">
                    {c.images?.character ? (
                      <img 
                        src={c.images.character} 
                        alt={c.simulacrumName} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-top"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <ImageOff size={32} opacity={0.5} />
                        <span className="text-xs font-mono uppercase">No Image</span>
                      </div>
                    )}
                    {/* Gradiente Oscuro para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  </div>

                  {/* --- ICONO DE EDICIÓN (Overlay Hover) --- */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/20 text-white">
                      <Edit3 size={16} />
                    </div>
                  </div>

                  {/* --- CONTENIDO DE TEXTO --- */}
                  <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                    {/* Badges pequeños */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-black/60 backdrop-blur border border-white/10 px-2 py-0.5 rounded text-white uppercase tracking-wider">
                          {c.element || "Unknown"}
                        </span>
                        <span className="text-[10px] font-bold bg-black/60 backdrop-blur border border-white/10 px-2 py-0.5 rounded text-gray-300 uppercase tracking-wider">
                          {c.resonance || "DPS"}
                        </span>
                    </div>

                    {/* Nombre */}
                    <h3 className="text-2xl font-black text-white uppercase italic leading-none mb-1">
                      {c.simulacrumName || c.name || "Unnamed"}
                    </h3>
                    
                    {/* Arma */}
                    <p className="text-xs text-gray-400 font-mono truncate">
                      WP: {c.weaponName || "Unknown Weapon"}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-border/60 bg-card/30">
            <div className="w-16 h-16 rounded-full bg-card-hover flex items-center justify-center mb-4 border border-border">
              <Users className="text-foreground/40" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">No characters yet</h3>
            <p className="text-foreground/50 max-w-md mb-6">
              Comienza creando tu primer personaje. Esta data alimentará toda la plataforma.
            </p>
            <Link href="/admin/characters/new" className="btn btn-primary">
              <Plus size={18} />
              Create First Character
            </Link>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}