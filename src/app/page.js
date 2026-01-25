"use client"

import Link from "next/link"
import { useSimulacra } from "@/context/SimulacraContext"
import { ArrowRight, Zap, Shield, Database, LayoutGrid, Star, Activity, ChevronRight, Loader2, Terminal, MousePointer2 } from "lucide-react"

// Función auxiliar para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return "Unknown Date";
  return new Date(dateString).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function HomePage() {
  const { characters, loading } = useSimulacra();

  // 1. LÓGICA: Ordenar por fecha de lanzamiento
  const sortedCharacters = [...characters].sort((a, b) => {
    return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
  });

  const featuredChar = sortedCharacters[0];
  const recentRoster = sortedCharacters.slice(1, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-widest animate-pulse">CONNECTING TO HYKROS...</h2>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">

      {/* =====================================================================================
          SECCIÓN 0: LANDING INTRO (GLOBAL BANNER) - ¡NUEVO!
         ===================================================================================== */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black border-b border-border">
        
        {/* --- FONDO DEL BANNER --- */}
        <div className="absolute inset-0 z-0">
          {/* Reemplaza el src con tu imagen clara */}
          <img 
            src="/images/banner.jpg" 
            alt="Tower of Fantasy World" 
            className="w-full h-full object-cover opacity-50" // Opacidad al 50% para que el texto resalte
          />
          
          {/* OVERLAYS PARA LEGIBILIDAD (Esencial si tu imagen es clara) */}
          {/* Gradiente desde abajo hacia arriba para fundir con la siguiente sección */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/40" />
          {/* Viñeta radial para oscurecer bordes y centrar atención */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--color-background)_120%)]" />
          {/* Grid decorativa estilo Sci-Fi */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
        </div>

        {/* --- CONTENIDO PRINCIPAL CENTRADO --- */}
        <div className="relative z-10 container px-4 text-center space-y-8">
           
           {/* Tag Superior */}
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase animate-fade-in backdrop-blur-md">
             <Terminal size={12} /> Hykros Central Database
           </div>

           {/* Título Gigante */}
           <div className="space-y-2 animate-slide-up">
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
               TOWER <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-accent">HUB</span>
             </h1>
             <p className="text-xl md:text-3xl text-gray-300 font-light tracking-wide">
               Tu archivo definitivo para <span className="text-white font-bold">Tower of Fantasy</span>
             </p>
           </div>

           {/* Descripción */}
           <p className="max-w-2xl mx-auto text-muted-foreground text-sm md:text-base leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
             Explora la base de datos más completa de simulacrums, armas y matrices. 
             Optimiza tus builds, consulta el meta actual y descubre todo sobre las últimas actualizaciones de Aida.
           </p>

           {/* Botonera de Navegación */}
           <div className="flex flex-wrap items-center justify-center gap-4 pt-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
              
              <Link href="/simulacra" className="group btn bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105">
                 <Database size={20} className="group-hover:text-primary transition-colors"/>
                 Explorar Simulacra
              </Link>

              <Link href="#latest-arrival" className="btn btn-outline border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg backdrop-blur-sm">
                 Ver Último Lanzamiento <ChevronRight size={20} />
              </Link>

           </div>
        </div>

        {/* Indicador de Scroll Animado */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
           <MousePointer2 size={24} />
        </div>

      </section>

      {/* =====================================================================================
          SECCIÓN 1: HERO BANNER (Último Personaje) - ID agregado para scroll
         ===================================================================================== */}
      <section id="latest-arrival" className="relative w-full min-h-[85vh] flex items-center overflow-hidden border-b border-border bg-black scroll-mt-20">
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-primary-dark)_0%,_transparent_40%)] opacity-20" />

        {featuredChar ? (
          <>
             {/* --- IMAGEN DEL PERSONAJE (DERECHA) --- */}
             <div className="absolute inset-0 md:left-auto md:right-0 md:w-[65%] h-full z-0">
               {featuredChar.images?.character && (
                 <div className="relative w-full h-full">
                    {/* Corrección de imagen solicitada anteriormente */}
                    <img 
  src={featuredChar.images.character} 
  alt="Hero Character" 
  className="w-full h-full object-cover 
             brightness-90 contrast-110 saturate-110
             transition-all duration-1000"
/>
                    
                    <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-r from-background via-background/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
                 </div>
               )}
             </div>

             {/* --- CONTENIDO TEXTO (IZQUIERDA) --- */}
             <div className="container relative z-10 px-6 flex flex-col justify-center h-full pt-20 pb-10">
               <div className="max-w-2xl space-y-6">
                 
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/50 bg-accent/10 text-accent font-mono text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                   <Star size={12} className="fill-current" />
                   New Arrival // Global Release
                 </div>

                 <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-xl">
                   {featuredChar.simulacrumName}
                 </h1>
                 
                 <div className="flex flex-wrap items-center gap-4 text-xl md:text-2xl text-primary-light font-light">
                   <span className="font-bold text-white">{featuredChar.weaponName}</span>
                   <span className="hidden md:block h-1 w-1 rounded-full bg-border"></span>
                   <span className="uppercase tracking-widest text-sm bg-primary/20 px-2 py-1 rounded border border-primary/30">
                      {featuredChar.element}
                   </span>
                 </div>

                 <p className="text-lg text-gray-400 max-w-lg line-clamp-3 leading-relaxed border-l-2 border-primary pl-4">
                   {featuredChar.description || featuredChar.trait?.description || "A powerful simulacrum..."}
                 </p>

                 <div className="flex flex-wrap gap-4 pt-6">
                   <Link 
                     href={`/simulacra/${featuredChar.id}`} 
                     className="btn btn-primary px-8 py-4 text-lg shadow-lg shadow-primary/20 group"
                   >
                     Ver Análisis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                   </Link>
                 </div>
               </div>
             </div>
          </>
        ) : (
          /* FALLBACK */
          <div className="container relative z-10 flex flex-col justify-center h-full text-center md:text-left">
             <h1 className="text-6xl font-black text-foreground">DATABASE EMPTY</h1>
             <p className="text-xl text-muted-foreground mt-4">Inicia sesión como admin para agregar el primer personaje.</p>
          </div>
        )}
      </section>

      {/* =====================================================================================
          SECCIÓN 2: STATS BAR
         ===================================================================================== */}
      <div className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           <div className="flex flex-col border-l border-border pl-6">
              <span className="text-3xl font-mono font-bold text-white">{characters.length}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Simulacra</span>
           </div>
           <div className="flex flex-col border-l border-border pl-6">
              <span className="text-3xl font-mono font-bold text-energy">v5.6.2</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Game Version</span>
           </div>
           <div className="flex flex-col border-l border-border pl-6">
              <span className="text-3xl font-mono font-bold text-accent">Active</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">System Status</span>
           </div>
           <div className="flex flex-col border-l border-border pl-6">
              <span className="text-3xl font-mono font-bold text-success">Online</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Database</span>
           </div>
        </div>
      </div>

      {/* =====================================================================================
          SECCIÓN 3: FEATURE CARDS
         ===================================================================================== */}
      <section className="py-24 bg-background relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.1),_transparent_50%)] pointer-events-none"></div>

        <div className="container relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">
                System <span className="text-primary">Modules</span>
              </h2>
              <p className="text-muted-foreground">Acceso rápido a las herramientas de la base de datos.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href="/simulacra" className="group card card-hover p-8 relative overflow-hidden h-64 flex flex-col justify-end">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  <Database size={80} className="text-primary" />
               </div>
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary border border-primary/20">
                    <LayoutGrid size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Simulacra DB</h3>
                  <p className="text-sm text-gray-400 mb-4">Lista completa de personajes, armas, habilidades y materiales de ascensión.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    Access Module <ArrowRight size={14}/>
                  </span>
               </div>
            </Link>

            <div className="group card card-hover p-8 relative overflow-hidden h-64 flex flex-col justify-end border-border/50">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-50 transition-all duration-500">
                  <LayoutGrid size={80} className="text-accent" />
               </div>
               <div className="relative z-10 opacity-70">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 text-accent border border-accent/20">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Matrices</h3>
                  <p className="text-sm text-gray-400 mb-4">Base de datos de chips de memoria y efectos de set 2pc/4pc.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                    Coming Soon
                  </span>
               </div>
            </div>

            <div className="group card card-hover p-8 relative overflow-hidden h-64 flex flex-col justify-end border-border/50">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-50 transition-all duration-500">
                  <Activity size={80} className="text-energy" />
               </div>
               <div className="relative z-10 opacity-70">
                  <div className="w-12 h-12 bg-energy/20 rounded-lg flex items-center justify-center mb-4 text-energy border border-energy/20">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Meta Tier List</h3>
                  <p className="text-sm text-gray-400 mb-4">Clasificación actual del meta para DPS, Tank y Support.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-energy flex items-center gap-2">
                    Coming Soon
                  </span>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================================
          SECCIÓN 4: RECENT ROSTER
         ===================================================================================== */}
      {recentRoster.length > 0 && (
        <section className="py-24 bg-card border-t border-border">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-2xl md:text-3xl font-bold uppercase flex items-center gap-3">
                 <span className="w-2 h-8 bg-accent rounded-full"></span>
                 Recent <span className="text-muted-foreground">Additions</span>
               </h2>
               <Link href="/simulacra" className="btn btn-outline text-xs">
                 View All <ChevronRight size={14} />
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentRoster.map((char) => (
                <Link key={char.id} href={`/simulacra/${char.id}`} className="group relative block h-80 rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-all duration-300">
                   {char.images?.character ? (
                     <img 
                       src={char.images.character} 
                       alt={char.simulacrumName} 
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                   ) : (
                     <div className="absolute inset-0 bg-card-hover flex items-center justify-center text-xs text-muted-foreground">NO IMAGE</div>
                   )}
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                   <div className="absolute bottom-0 left-0 w-full p-6">
                      <div className="text-xs font-bold text-accent uppercase tracking-widest mb-1">{char.element}</div>
                      <h3 className="text-xl font-black text-white uppercase italic">{char.simulacrumName}</h3>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(char.releaseDate)}</p>
                   </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================================
          SECCIÓN 5: CTA
         ===================================================================================== */}
      <section className="py-20 border-t border-border bg-gradient-to-b from-background to-black text-center">
        <div className="container max-w-2xl">
           <h2 className="text-3xl font-black text-white uppercase mb-6">Join the Community</h2>
           <p className="text-muted-foreground mb-8 text-lg">
             Ayúdanos a mantener la base de datos actualizada. Únete a nuestro Discord.
           </p>
           <button className="btn bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-[#5865F2]/25">
             Discord Server
           </button>
        </div>
      </section>

    </main>
  )
}