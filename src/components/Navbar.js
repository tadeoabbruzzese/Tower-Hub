'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  BarChart2, 
  Shield, 
  BookOpen, 
  Newspaper, 
  Download, 
  Server, 
  Disc, 
  Zap, 
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { LogIn, LogOut, User } from "lucide-react"


// --- CONFIGURACIÓN DE NAVEGACIÓN ---
const navSections = [
  {
    category: "Principal",
    items: [
      { name: "Inicio", path: "/", icon: Home },
      
    ]
  },
  {
    category: "Base de Datos",
    items: [
      { name: "Simulacras", path: "/simulacra", icon: Users },
      { name: "Reliquias", path: "/relics", icon: Shield },
      { name: "Guías & Wiki", path: "/guides", icon: BookOpen },
      { name: "Tier List", path: "/tierlist", icon: BarChart2 },
    ]
  },
  
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, loading } = useAuth()

  const handleLogin = async () => {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

const handleLogout = async () => {
  await signOut(auth)
}


  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* =======================================
          BOTÓN FLOTANTE (HAMBURGUESA)
          ======================================= */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`
          fixed top-6 right-6 z-50 p-3 rounded-full 
          bg-background/80 backdrop-blur-md border border-border shadow-2xl
          text-foreground hover:text-primary hover:border-primary/50
          transition-all duration-300 hover:scale-110 hover:rotate-90 group
        `}
        aria-label="Abrir Menú"
      >
        <Menu size={28} />
        {/* Glow effect detrás del botón */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>

      {/* =======================================
          OVERLAY (FONDO OSCURO)
          ======================================= */}
      <div 
        className={`
          fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* =======================================
          SIDEBAR (PANEL DESLIZANTE)
          ======================================= */}
      <aside 
        className={`
          fixed top-0 right-0 z-[70] h-full w-full sm:w-[400px] 
          bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl
          transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* --- HEADER DEL SIDEBAR --- */}
        <div className="p-6 flex items-center justify-between border-b border-border/50">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">
              <span className="text-foreground">Tower </span>
              <span className="text-primary">Hub</span>
            </h2>
            <p className="text-xs text-foreground/50 tracking-widest uppercase">Sistema de Navegación</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/5 text-foreground/50 hover:text-error transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* --- CONTENIDO SCROLLABLE --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          

          {/* ===============================
    AUTH PANEL
================================ */}
<div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-md">
  {!loading && !user && (
    <button
      onClick={handleLogin}
      className="
        w-full flex items-center justify-center gap-3 py-3 rounded-lg
        bg-primary/20 hover:bg-primary/30 border border-primary/40
        text-primary font-bold transition-all
      "
    >
      <LogIn size={18} />
      Login with Google
    </button>
  )}

  {!loading && user && (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-12 h-12 rounded-full border border-border"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-card-hover flex items-center justify-center">
            <User size={20} />
          </div>
        )}

        <div className="flex-1">
          <p className="font-bold text-sm text-foreground truncate">
            {user.email}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-foreground/50">
              {role}
            </span>

            {role === "admin" && (
              <span className="px-2 py-0.5 text-[10px] font-black rounded bg-error/20 text-error border border-error/40">
                ADMIN
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="
          w-full flex items-center justify-center gap-2 py-2 rounded-lg
          bg-black/30 hover:bg-error/20 border border-border/50 hover:border-error/40
          text-foreground/70 hover:text-error transition-all
        "
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  )}
</div>
{/* ===============================
    ADMIN ACCESS (solo admin)
================================ */}
{!loading && user && role === "admin" && (
  <Link
    href="/admin"
    className="
      flex items-center justify-between gap-3 p-4 rounded-xl
      border border-error/40 bg-error/10
      text-error font-bold uppercase tracking-wider text-sm
      hover:bg-error/20 hover:border-error/60
      transition-all
    "
  >
    <div className="flex items-center gap-3">
      <ShieldCheck size={18} />
      <span>Admin Panel</span>
    </div>

    <span className="text-[10px] px-2 py-1 rounded bg-error/20 border border-error/40">
      RESTRICTED
    </span>
  </Link>
)}


          {/* Mapeo de Secciones */}
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-3 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-accent rounded-full"></span>
                {section.category}
              </h3>
              
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`
                        group flex items-center justify-between p-3 rounded-lg border transition-all duration-300
                        ${isActive 
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_-5px_var(--color-primary)]' 
                          : 'bg-transparent border-transparent text-foreground/70 hover:bg-white/5 hover:text-white hover:pl-4'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={isActive ? "text-primary" : "text-foreground/50 group-hover:text-primary transition-colors"} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      
                      {/* Indicador visual activo/hover */}
                      <ChevronRight 
                        size={16} 
                        className={`
                          transition-transform duration-300 
                          ${isActive ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}
                        `} 
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          
        </div>

        {/* --- FOOTER DEL SIDEBAR --- */}
        <div className="p-6 border-t border-border/50 bg-card">
          <a 
            href="https://discord.gg/ejemplo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold transition-colors shadow-lg shadow-[#5865F2]/20"
          >
            Únete al Discord <ExternalLink size={16} />
          </a>
          <p className="text-center text-[10px] text-foreground/30 mt-4 uppercase tracking-widest">
            Tower Hub © 2026
          </p>
        </div>

      </aside>
    </>
  );
}