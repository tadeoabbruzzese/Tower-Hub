"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import AdminGuard from "@/components/AdminGuard"
import { Users, Plus, Sparkles } from "lucide-react"

export default function AdminCharacters() {
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "characters"))
      setCharacters(snap.docs.map(d => d.data()))
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
              Manage playable characters.  
              These entries are the source of truth for public views.
            </p>
          </div>

          <Link
            href="/admin/characters/new"
            className="btn btn-primary gap-3 self-start md:self-auto"
          >
            <Plus size={18} />
            Create Character
          </Link>
        </div>

        {/* ===============================
            GRID
        ================================ */}
        {characters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {characters.map((c, idx) => (
              <Link
                key={c.id}
                href={`/admin/characters/${c.id}`}
                className="card card-hover p-6 group animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <Sparkles className="text-primary" size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">
                        {c.name}
                      </h3>
                      <p className="text-xs text-foreground/50 uppercase tracking-widest">
                        {c.element} · {c.role}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground/60 line-clamp-3 mb-6">
                  {c.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary">
                  <span>Edit</span>
                  <span className="opacity-40 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-border/60">
            <div className="w-16 h-16 rounded-full bg-card-hover flex items-center justify-center mb-4">
              <Users className="text-foreground/40" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">
              No characters yet
            </h3>
            <p className="text-foreground/50 max-w-md mb-6">
              Start by creating your first character.  
              This data will be used across the entire platform.
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
