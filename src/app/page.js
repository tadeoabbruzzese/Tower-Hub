"use client"

import Link from "next/link"
import { useSimulacra } from "@/context/SimulacraContext"
import { useNews } from "@/context/NewsContext" // <--- Importamos el hook
import { 
  ArrowRight, Zap, Shield, Database, LayoutGrid, Star, Activity, 
  ChevronRight, Loader2, Terminal, MousePointer2, Box, Twitter, ExternalLink, Calendar 
} from "lucide-react"

// Función auxiliar para formatear fecha
const formatDate = (dateInput) => {
  if (!dateInput) return "Unknown Date";
  
  let date;
  // Si viene de Firebase (Timestamp)
  if (dateInput.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    // Si es un string "YYYY-MM-DD", le agregamos T12:00:00
    // Esto lo pone al mediodía, evitando que la zona horaria (GMT-3) lo regrese al día anterior
    date = new Date(dateInput + "T12:00:00");
  }

  return date.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });
}



export default function HomePage() {
  const { characters, loading } = useSimulacra();
  const { news, loading: loadingNews } = useNews();
  // 1. LÓGICA: Ordenar por fecha de lanzamiento
  const sortedCharacters = [...characters].sort((a, b) => {
    return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
  });

  const featuredChar = sortedCharacters[0];
  const recentRoster = sortedCharacters.slice(1, 5);

  const latestNews = news.slice(0, 3);

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
          SECCIÓN 0: LANDING INTRO
         ===================================================================================== */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black border-b border-border">
        
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/banner.jpg" 
            alt="Tower of Fantasy World" 
            className="w-full h-full object-cover opacity-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--color-background)_120%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
        </div>

        <div className="relative z-10 container px-4 text-center space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase animate-fade-in backdrop-blur-md">
             <Terminal size={12} /> Hykros Central Database
           </div>

           <div className="space-y-2 animate-slide-up">
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
               TOWER <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-accent">HUB</span>
             </h1>
             <p className="text-xl md:text-3xl text-gray-300 font-light tracking-wide">
               Tu archivo definitivo para <span className="text-white font-bold">Tower of Fantasy</span>
             </p>
           </div>

           <p className="max-w-2xl mx-auto text-muted-foreground text-sm md:text-base leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
             Explora la base de datos más completa de simulacrums, armas y reliquias. 
             Optimiza tus builds, consulta el meta actual y mantente al día con las noticias de Aida.
           </p>

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

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
           <MousePointer2 size={24} />
        </div>
      </section>

      {/* =====================================================================================
          SECCIÓN 1: HERO BANNER (COLOR ADAPTATIVO)
         ===================================================================================== */}
      <section id="latest-arrival" className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-[#050505] border-b border-border scroll-mt-20 group">
        
        {/* Helper de colores interno */}
        {(() => {
           // 1. Detectar Elemento
           const elementKey = featuredChar?.element?.split("-")[0] || "Altered";
           
           // 2. Configuración de Texto y Bordes (Tu configuración actual)
           const themeColor = {
             Flame: "text-orange-500 border-orange-500",
             Volt:  "text-purple-500 border-purple-500",
             Ice:   "text-cyan-400 border-cyan-400",
             Frost: "text-cyan-400 border-cyan-400", // Alias para Ice
             Physical: "text-yellow-400 border-yellow-400",
             Altered: "text-green-400 border-green-400",
           }[elementKey] || "text-white border-white";

           // 3. Configuración del BOTÓN (FIX DEL BUG)
           // Definimos explícitamente el color de fondo al hacer hover
           const btnHoverColor = {
             Flame: "hover:bg-orange-500",
             Volt:  "hover:bg-purple-500",
             Ice:   "hover:bg-cyan-400",
             Frost: "hover:bg-cyan-400",
             Physical: "hover:bg-yellow-400",
             Altered: "hover:bg-green-400",
           }[elementKey] || "hover:bg-zinc-800"; // <= Fallback Oscuro para que se lea el texto blanco

           return (
             <>
                {/* FONDOS */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20"></div>
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-10 ${themeColor.replace('text-', 'bg-').split(' ')[0]}`} />

                {featuredChar ? (
                  <>
                     {/* --- CAPA 0: NOMBRE GIGANTE EN EL FONDO --- */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 select-none overflow-hidden">
                        <h1 className={`text-[15vw] md:text-[12vw] font-black uppercase leading-none tracking-tighter whitespace-nowrap blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out opacity-10 ${themeColor.split(' ')[0]}`}>
                          {featuredChar.simulacrumName}
                        </h1>
                     </div>

                     {/* --- CAPA 1: IMAGEN DEL PERSONAJE --- */}
                     <div className="absolute inset-0 md:w-[60%] md:left-auto md:right-0 h-full z-10 pointer-events-none">
                       {featuredChar.images?.character && (
                         <div className="relative w-full h-full">
                            <img 
                              src={featuredChar.images.character} 
                              alt="Hero Character" 
                              className="w-full h-full object-cover object-[50%_20%] md:object-contain md:object-right-bottom scale-110 drop-shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                         </div>
                       )}
                     </div>

                     {/* --- CAPA 2: INFO PANEL --- */}
                     <div className="container relative z-20 px-6 h-full flex flex-col justify-end pb-24 md:justify-center md:pb-0">
                       <div className="max-w-xl">
                         
                         <div className="flex items-center gap-2 mb-6">
                            <div className={`h-[2px] w-8 ${themeColor.replace('text-', 'bg-').split(' ')[0]}`}></div>
                            <span className={`text-xs font-mono uppercase tracking-[0.2em] ${themeColor.split(' ')[0]}`}>Latest Simulacra</span>
                         </div>

                         {/* Título Principal */}
                         <h1 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-2 drop-shadow-lg text-white`}>
                           {featuredChar.simulacrumName}
                         </h1>
                         
                         <div className="flex items-center gap-4 mb-8">
                            <span className="px-3 py-1 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-sm">
                              {featuredChar.rarity || "SSR"}
                            </span>
                            <span className="text-2xl font-light text-gray-300">
                              {featuredChar.weaponName}
                            </span>
                            <div className="h-4 w-[1px] bg-gray-600"></div>
                            <span className={`text-sm font-mono border px-2 py-0.5 rounded bg-black/40 backdrop-blur ${themeColor}`}>
                              {featuredChar.element}
                            </span>
                         </div>

                         {/* Descripción */}
                         <div className={`p-6 rounded-l-xl border-l-2 bg-white/5 backdrop-blur-sm mb-8 ${themeColor.split(' ')[1]}`}>
                           <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3">
                             {featuredChar.description || featuredChar.trait?.description || "Datos clasificados. Simulacrum de alto nivel detectado."}
                           </p>
                         </div>

                         <div className="flex flex-wrap gap-4">
                           {/* BOTÓN CORREGIDO: 
                              Usamos `btnHoverColor` directamente en lugar de hacer replaces raros.
                           */}
                           <Link 
                             href={`/simulacra/${featuredChar.id}`} 
                             className={`group relative px-8 py-4 bg-white text-black font-black uppercase tracking-wider text-sm transition-all hover:text-white ${btnHoverColor}`}
                           >
                             <span className="relative z-10 flex items-center gap-2">
                               Ver Simulacra <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                             </span>
                           </Link>
                           
                           <Link 
                             href="/simulacra" 
                             className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-colors"
                           >
                             + Ver todos
                           </Link>
                         </div>

                       </div>
                     </div>
                  </>
                ) : (
                  <div className="container relative z-10 flex flex-col justify-center h-full text-center">
                     <h1 className="text-6xl font-black text-foreground/20">SYSTEM OFFLINE</h1>
                  </div>
                )}
             </>
           );
        })()}
        
      </section>

      {/* =====================================================================================
          SECCIÓN 2: STATS BAR
         ===================================================================================== */}
      <div className="w-full border-b border-border bg-card/50 backdrop-blur-sm hidden md:block">
        <div className="container py-6 grid grid-cols-4 gap-8">
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
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Status</span>
           </div>
           <div className="flex flex-col border-l border-border pl-6">
              <span className="text-3xl font-mono font-bold text-success">Online</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Database</span>
           </div>
        </div>
      </div>

      {/* =====================================================================================
          SECCIÓN 3: FEATURE CARDS (NAVEGACIÓN)
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
            
            {/* CARD 1: SIMULACRA */}
            <Link href="/simulacra" className="group card card-hover p-8 relative overflow-hidden h-64 flex flex-col justify-end">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  <Database size={80} className="text-primary" />
               </div>
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary border border-primary/20">
                    <LayoutGrid size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Simulacra DB</h3>
                  <p className="text-sm text-gray-400 mb-4">Lista completa de personajes, armas, habilidades y matrices.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    Access Module <ArrowRight size={14}/>
                  </span>
               </div>
            </Link>

            {/* CARD 3: TIER LIST */}
            <Link href="/tierlist" className="group card card-hover p-8 relative overflow-hidden h-64 flex flex-col justify-end ">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  <Activity size={80} className="text-energy" />
               </div>
               <div className="relative z-10 ">
                  <div className="w-12 h-12 bg-energy/20 rounded-lg flex items-center justify-center mb-4 text-energy border border-energy/20">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Meta Tier List</h3>
                  <p className="text-sm text-gray-400 mb-4">Clasificación actual del meta para DPS, Tank y Support.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-energy flex items-center gap-2">
                    Access Module <ArrowRight size={14}/>
                  </span>
               </div>
            </Link>

            {/* CARD 2: RELIQUIAS (NUEVO) */}
            <div className="group card card-hover p-8 relative overflow-hidden h-64 flex flex-col justify-end border-border/50">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-50 transition-all duration-500">
                  <Box size={80} className="text-accent" />
               </div>
               <div className="relative z-10 opacity-70">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 text-accent border border-accent/20">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Relics & Gadgets</h3>
                  <p className="text-sm text-gray-400 mb-4">Base de datos de reliquias SSR y SR para exploración y combate.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                    Coming Soon
                  </span>
               </div>
            </div>

            

          </div>
        </div>
      </section>

      

      {/* =====================================================================================
          SECCIÓN 5: RECENT ROSTER
         ===================================================================================== */}
      {recentRoster.length > 0 && (
        <section className="py-24 bg-background border-t border-border">
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
          SECCIÓN 4: TWITTER / NEWS FEED (YA CONECTADO AL CONTEXT)
         ===================================================================================== */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
             <div>
                <h2 className="text-3xl font-black uppercase mb-2 flex items-center gap-3">
                  <Twitter className="text-[#1DA1F2]" size={32} />
                  Hykros <span className="text-[#1DA1F2]">Comms</span>
                </h2>
                <p className="text-muted-foreground">Últimas transmisiones oficiales de @ToF_EN_Official.</p>
             </div>
             <a 
               href="https://twitter.com/ToF_EN_Official" 
               target="_blank" 
               rel="noopener noreferrer"
               className="btn btn-outline text-xs hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50"
             >
               Ver en X (Twitter) <ExternalLink size={14} />
             </a>
          </div>

          {loadingNews ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                   <div key={i} className="h-48 rounded-xl bg-background/50 animate-pulse border border-border"></div>
                ))}
             </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {latestNews.map((item) => (
                  <a 
                    key={item.id} 
                    href={item.link || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block p-6 rounded-xl border border-border bg-background hover:border-[#1DA1F2]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1DA1F2]/10"
                  >
                     {/* Header: Icono, Nombre y Fecha */}
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                              <Twitter size={20} fill="currentColor" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white">Tower of Fantasy</p>
                              <p className="text-xs text-gray-500">@ToF_EN_Official</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                           <Calendar size={12}/>
                           {formatDate(item.date)}
                        </div>
                     </div>
                     
                     {/* Texto del Tweet */}
                     <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                       {item.content}
                     </p>

                     {/* ✅ CORRECCIÓN: Renderizar Imagen si existe */}
                     {item.image && (
                       <div className="mb-4 w-full h-48 rounded-lg overflow-hidden border border-border/50 bg-black">
                         <img 
                           src={item.image} 
                           alt="News Media" 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                       </div>
                     )}
                     
                     {/* Footer Link */}
                     <div className="text-xs font-bold text-[#1DA1F2] uppercase tracking-widest group-hover:underline flex items-center gap-1">
                        Leer Tweet Completo <ArrowRight size={12} />
                     </div>
                  </a>
               ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-xl">
               No hay noticias recientes en la base de datos. <br/>
               <span className="text-xs">Ve al Admin Panel para crear la primera.</span>
            </div>
          )}
        </div>
      </section>
      {/* =====================================================================================
          SECCIÓN 6: CTA / FOOTER
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