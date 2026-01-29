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
          SECCIÓN 1: HERO BANNER (Estilo Cinemático - Referencia 1)
         ===================================================================================== */}
      <section className="relative w-full h-screen min-h-[800px] flex items-center overflow-hidden border-b border-white/5">
        
        {/* Grid de Fondo */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none"></div>

        {(() => {
           const elementKey = featuredChar?.element?.split("-")[0] || "Altered";
           // Configuración de colores
           const themeConfig = {
             Flame: { text: "text-orange-500", glow: "shadow-orange-500/50", bg: "bg-orange-500" },
             Volt:  { text: "text-purple-500", glow: "shadow-purple-500/50", bg: "bg-purple-500" },
             Ice:   { text: "text-cyan-400", glow: "shadow-cyan-400/50", bg: "bg-cyan-400" },
             Frost: { text: "text-cyan-400", glow: "shadow-cyan-400/50", bg: "bg-cyan-400" },
             Physical: { text: "text-yellow-400", glow: "shadow-yellow-400/50", bg: "bg-yellow-400" },
             Altered: { text: "text-green-400", glow: "shadow-green-400/50", bg: "bg-green-400" },
           }[elementKey] || { text: "text-white", glow: "shadow-white/50", bg: "bg-white" };

           return (
             <>
                {/* Spot Light Ambiental */}
                <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] opacity-10 pointer-events-none ${themeConfig.bg}`} />

                {featuredChar ? (
                  <>
                     {/* --- CAPA 0: TEXTO GIGANTE FONDO (SALLY Style) --- */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 select-none overflow-hidden pointer-events-none">
                        <h1 className="text-[18vw] font-black uppercase leading-none tracking-tighter text-white/5 scale-110 whitespace-nowrap">
                          {featuredChar.simulacrumName}
                        </h1>
                     </div>

                     {/* --- CAPA 1: IMAGEN DEL PERSONAJE --- */}
                     <div className="absolute inset-0 md:w-[65%] md:left-auto md:right-[-5%] h-full z-10 pointer-events-none">
                       {featuredChar.images?.character && (
                         <div className="relative w-full h-full">
                            <img 
                              src={featuredChar.images.character} 
                              alt="Hero Character" 
                              className="w-full h-full object-cover object-[50%_20%] md:object-contain md:object-right-bottom drop-shadow-2xl animate-fade-in"
                            />
                            {/* Fusión con el fondo */}
                            
                         </div>
                       )}
                     </div>

                     {/* --- CAPA 2: INFO PANEL (Izquierda) --- */}
                     <div className="container relative z-20 px-6 h-full flex flex-col justify-center">
                       <div className="max-w-2xl space-y-6">
                         
                         <div className="flex items-center gap-3 animate-slide-up">
                            <span className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                              New Arrival
                            </span>
                            <div className={`h-px w-20 ${themeConfig.bg}`}></div>
                         </div>

                         <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-lg animate-slide-up" style={{animationDelay: '100ms'}}>
                           {featuredChar.simulacrumName}
                         </h1>
                         
                         <div className="flex items-center gap-4 text-xl md:text-2xl font-light text-gray-400 animate-slide-up" style={{animationDelay: '200ms'}}>
                            <span className="text-white font-bold">{featuredChar.weaponName}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                            <span className={`${themeConfig.text} font-mono uppercase tracking-widest text-sm border border-current px-3 py-1 rounded`}>
                              {featuredChar.element}
                            </span>
                         </div>

                         <p className="text-gray-400 max-w-lg leading-relaxed border-l-2 border-white/10 pl-6 animate-slide-up" style={{animationDelay: '300ms'}}>
                           {featuredChar.description || "Simulacrum de alto nivel detectado en la base de datos de Hykros. Sincronización disponible."}
                         </p>

                         <div className="flex flex-wrap gap-4 pt-4 animate-slide-up" style={{animationDelay: '400ms'}}>
                           <Link 
                             href={`/simulacra/${featuredChar.id}`} 
                             className={`group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 hover:${themeConfig.glow}`}
                           >
                             <span className="relative z-10 flex items-center gap-2">
                               Initiate Analysis <ArrowRight size={16} />
                             </span>
                           </Link>
                         </div>

                       </div>
                     </div>
                  </>
                ) : (
                  <div className="container relative z-10 flex justify-center">
                     <h1 className="text-6xl font-black text-gray-800">OFFLINE</h1>
                  </div>
                )}
             </>
           );
        })()}
      </section>

      {/* =====================================================================================
          SECCIÓN 2: STATS BAR (REDISEÑADO)
         ===================================================================================== */}
      <div className="w-full border-y border-white/5 bg-[#050505] hidden md:block relative z-20">
        <div className="container py-8 grid grid-cols-4 gap-8">
           
           {/* STAT 1: SIMULACRA */}
           <div className="flex flex-col border-l-2 border-white/10 pl-6 group hover:border-primary/50 transition-colors duration-300">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">
                {characters.length}
              </span>
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-[0.25em] mt-1">
                Database Entries
              </span>
           </div>

           {/* STAT 2: VERSION */}
           <div className="flex flex-col border-l-2 border-white/10 pl-6 group hover:border-energy/50 transition-colors duration-300">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tighter group-hover:text-energy transition-colors">
                v5.6.2
              </span>
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-[0.25em] mt-1">
                System Version
              </span>
           </div>

           {/* STAT 3: STATUS */}
           <div className="flex flex-col border-l-2 border-white/10 pl-6 group hover:border-accent/50 transition-colors duration-300">
              <div className="flex items-center gap-3">
                 <span className="text-4xl md:text-5xl font-black text-white tracking-tighter group-hover:text-accent transition-colors">
                   ACTIVE
                 </span>
                 
              </div>
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-[0.25em] mt-1">
                Server Status
              </span>
           </div>

           {/* STAT 4: DATABASE */}
           <div className="flex flex-col border-l-2 border-white/10 pl-6 group hover:border-green-500/50 transition-colors duration-300">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tighter group-hover:text-green-400 transition-colors">
                ONLINE
              </span>
              <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-[0.25em] mt-1">
                Hykros Link
              </span>
           </div>

        </div>
      </div>

      {/* =====================================================================================
          SECCIÓN 3: FEATURE CARDS (MODULES)
         ===================================================================================== */}
      <section className="py-24 bg-[#0a0a0a] relative border-b border-white/5">
        <div className="container">
          
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-2 flex items-center gap-2">
                System <span className="text-primary">Modules</span>
              </h2>
              <p className="text-gray-500 font-mono text-sm">Acceso rápido a las herramientas de la base de datos.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. SIMULACRA DB */}
            <Link href="/simulacra" className="group relative h-72 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
               {/* Background Image */}
               <div className="absolute inset-0 bg-[#111]">
                 {featuredChar?.images?.character ? (
                   <img 
                     src={featuredChar.images.character} 
                     alt="Simulacra BG" 
                     className="w-full h-full object-cover object-top opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" 
                   />
                 ) : (
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-20"></div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
               </div>

               {/* Content */}
               <div className="relative z-10 h-full flex flex-col justify-end p-8">
                 <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 text-primary border border-primary/20 backdrop-blur-md">
                   <Database size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Simulacra DB</h3>
                 <p className="text-sm text-gray-400 mb-6 line-clamp-2">Base de datos completa de personajes, armas y habilidades.</p>
                 <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                   Access Module <ArrowRight size={14} />
                 </span>
               </div>
            </Link>

            {/* 2. RELIQUIAS (Sin imagen dinámica por ahora, usamos abstracta) */}
            <Link href="/relics" className="group relative h-72 rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
               <div className="absolute inset-0 bg-[#111]">
                 {/* Patrón Tech de fondo para Reliquias */}
                 <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(234,179,8,0.1)_50%,transparent_75%,transparent_100%)] bg-[size:20px_20px]"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                 {/* Icono gigante de fondo */}
                 <Box className="absolute -top-4 -right-4 text-yellow-500/10 w-48 h-48 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700" />
               </div>

               <div className="relative z-10 h-full flex flex-col justify-end p-8">
                 <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 text-yellow-500 border border-yellow-500/20 backdrop-blur-md">
                   <Box size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">Relics Arsenal</h3>
                 <p className="text-sm text-gray-400 mb-6 line-clamp-2">Catálogo de equipamiento SSR y SR para combate.</p>
                 <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 flex items-center gap-2 group-hover:gap-3 transition-all">
                   Access Module <ArrowRight size={14} />
                 </span>
               </div>
            </Link>

            {/* 3. TIER LIST (Imagen de Arma de fondo) */}
            <Link href="/tierlist" className="group relative h-72 rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
               <div className="absolute inset-0 bg-[#111]">
                 {featuredChar?.images?.weapon ? (
                   <img 
                     src={featuredChar.images.weapon} 
                     alt="Weapon BG" 
                     className="w-full h-full object-contain p-8 opacity-40 group-hover:opacity-60 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700" 
                   />
                 ) : (
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-energy)_0%,_transparent_60%)] opacity-20"></div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
               </div>

               <div className="relative z-10 h-full flex flex-col justify-end p-8">
                 <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 text-red-500 border border-red-500/20 backdrop-blur-md">
                   <Activity size={24} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">Meta Tier List</h3>
                 <p className="text-sm text-gray-400 mb-6 line-clamp-2">Análisis de eficiencia y clasificaciones actuales.</p>
                 <span className="text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-2 group-hover:gap-3 transition-all">
                   Access Module <ArrowRight size={14} />
                 </span>
               </div>
            </Link>

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