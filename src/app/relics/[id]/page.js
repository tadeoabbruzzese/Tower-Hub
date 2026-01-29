import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Box, Star, Layers } from "lucide-react"

// --- 1. FETCH DATA ---
async function getRelic(id) {
  const docRef = doc(db, "relics", id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() }
}

// --- 2. CONFIG DE COLORES POR RAREZA ---
const getRarityTheme = (rarity) => {
  const isSSR = rarity === "SSR";
  return {
    color: isSSR ? "text-yellow-500" : "text-purple-500",
    bg: isSSR ? "bg-yellow-500" : "bg-purple-500",
    border: isSSR ? "border-yellow-500" : "border-purple-500",
    glow: isSSR ? "shadow-yellow-500/50" : "shadow-purple-500/50",
    gradient: isSSR ? "from-yellow-500/20" : "from-purple-500/20",
    iconBg: isSSR ? "bg-yellow-500/10" : "bg-purple-500/10",
  };
};

// --- 3. HELPER PARA FORMATEAR TEXTO (Keywords, Colores, Negritas) ---
const formatDescription = (text) => {
  if (!text) return null;

  // Regex para detectar: [Keyword], Elementos y Números/Porcentajes
  const regex = /(\[.*?\]|Volt|Frost|Ice|Flame|Physical|\d+(?:\.\d+)?%?)/gi;

  const parts = text.split(regex);

  return parts.map((part, index) => {
    // A. Si es un Custom Keyword entre corchetes [] (Ej: [Cooldown])
    if (part.startsWith('[') && part.endsWith(']')) {
      const content = part.slice(1, -1); 
      // Usamos amarillo suave para resaltar keywords
      return <span key={index} className="text-yellow-200 font-bold tracking-wide">{content}</span>;
    }

    // B. Si es un Número (Ej: 20%, 30)
    if (/^\d+(?:\.\d+)?%?$/.test(part)) {
      return <span key={index} className="text-blue-400 font-bold font-mono">{part}</span>;
    }

    // C. Si es un Elemento (Por si acaso se menciona en alguna reliquia)
    const lower = part.toLowerCase();
    switch (lower) {
      case 'volt': return <span key={index} className="text-purple-400 font-bold uppercase">Volt</span>;
      case 'frost': return <span key={index} className="text-cyan-400 font-bold uppercase">Frost</span>;
      case 'ice': return <span key={index} className="text-cyan-400 font-bold uppercase">Ice</span>;
      case 'flame': return <span key={index} className="text-orange-400 font-bold uppercase">Flame</span>;
      case 'physical': return <span key={index} className="text-yellow-400 font-bold uppercase">Physical</span>;
      default: return part; 
    }
  });
};

// --- 4. COMPONENTE PRINCIPAL ---
export default async function RelicPage({ params }) {
  const { id } = await params 
  const relic = await getRelic(id)

  if (!relic) notFound()

  const theme = getRarityTheme(relic.rarity);

  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-yellow-500 selection:text-black pb-20">
      
      {/* BACKGROUND FX */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20" />
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full ${theme.bg} blur-[150px] opacity-10 pointer-events-none`} />

      <div className="container relative z-10 pt-24 max-w-5xl">
        
        {/* NAV BACK */}
        <Link href="/relics" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> 
          Back to Relics
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* --- COLUMNA IZQUIERDA: TARJETA VISUAL --- */}
          <div className="lg:col-span-1">
            <div className={`
              sticky top-24 rounded-2xl overflow-hidden bg-[#111] border border-gray-800 
              ${theme.border}/30 transition-all duration-500 hover:shadow-2xl hover:${theme.glow}
            `}>
              {/* Header de la tarjeta */}
              <div className="p-4 flex justify-between items-center border-b border-white/5 bg-white/5">
                <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded bg-black/50 border border-white/10 ${theme.color}`}>
                  {relic.rarity || "SSR"}
                </span>
                <Box size={16} className="text-gray-500" />
              </div>

              {/* Imagen Centrada */}
              <div className="aspect-square relative p-10 flex items-center justify-center bg-gradient-to-b from-transparent to-black/50">
                <div className={`absolute inset-0 ${theme.bg} opacity-5 blur-xl`}></div>
                
                {relic.image ? (
                  <img 
                    src={relic.image} 
                    alt={relic.name} 
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10 animate-fade-in"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-700">
                    <Box size={40} />
                    <span className="text-xs font-mono">NO VISUAL</span>
                  </div>
                )}
              </div>

              {/* Footer Tech */}
              <div className="p-4 bg-black/40 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase">
                   <div className={`w-2 h-2 rounded-full ${theme.bg} animate-pulse`}></div>
                   Database ID: {relic.id}
                </div>
              </div>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: INFO Y AVANCES --- */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* 1. HEADER INFO */}
            <div className="space-y-4 animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight text-white">
                {relic.name}
              </h1>
              
              <div className="flex items-center gap-4">
                 <div className={`h-1 w-12 ${theme.bg} rounded-full`}></div>
                 <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">
                   Equipment Details
                 </span>
              </div>

              <div className={`p-6 rounded-xl border-l-2 ${theme.border} bg-white/5 backdrop-blur-sm`}>
                {/* APLICADO FORMATDESCRIPTION AQUÍ */}
                <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {formatDescription(relic.description) || "No description available."}
                </p>
              </div>
            </div>

            {/* 2. TABLA DE AVANCES */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <Layers className={theme.color} size={24} />
                <h2 className="text-2xl font-bold uppercase tracking-tight">Advancement <span className="text-gray-500">Matrix</span></h2>
              </div>

              <div className="grid gap-4">
                {relic.advancements && relic.advancements.map((desc, index) => (
                   desc && (
                     <div 
                       key={index} 
                       className={`
                         group flex gap-5 p-5 rounded-xl border border-gray-800 bg-[#0a0a0e] 
                         hover:border-opacity-50 transition-all duration-300 hover:bg-[#111]
                       `}
                       style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                     >
                        <div className="flex-shrink-0">
                           <div className={`
                             w-12 h-12 rounded-full flex items-center justify-center 
                             ${theme.iconBg} border ${theme.border}/20 ${theme.color}
                             font-bold font-mono text-lg shadow-lg
                           `}>
                             {index + 1}★
                           </div>
                        </div>

                        <div className="flex-1 pt-1">
                           <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.color} opacity-70`}>
                             Star Level {index + 1}
                           </h3>
                           {/* APLICADO FORMATDESCRIPTION AQUÍ */}
                           <p className="text-gray-300 text-sm leading-relaxed border-l border-gray-700 pl-4 group-hover:border-white/20 transition-colors whitespace-pre-line">
                             {formatDescription(desc)}
                           </p>
                        </div>
                     </div>
                   )
                ))}
                
                {(!relic.advancements || relic.advancements.every(a => !a)) && (
                   <div className="text-center py-10 text-gray-600 border border-dashed border-gray-800 rounded-xl">
                      No advancement data available.
                   </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  )
}