import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { notFound } from "next/navigation"
import { Sword, Wind, Zap, Activity, Star } from "lucide-react" // IMPORTAR ICONOS

// --- 1. FUNCIÓN PARA BUSCAR EL PERSONAJE ---
async function getCharacter(id) {
  const docRef = doc(db, "characters", id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  return { id: docSnap.id, ...docSnap.data() }
}

// --- 2. HELPER PARA COLORES SEGÚN ELEMENTO (Estética de Fondos) ---
const getElementColor = (element) => {
  const mainElement = element ? element.split("-")[0].toLowerCase() : "altered"
  
  const colors = {
    volt: "from-purple-900 via-purple-950 to-black text-purple-200 border-purple-500",
    ice: "from-cyan-900 via-cyan-950 to-black text-cyan-200 border-cyan-500",
    flame: "from-orange-900 via-orange-950 to-black text-orange-200 border-orange-500",
    physical: "from-yellow-900 via-yellow-950 to-black text-yellow-200 border-yellow-500",
    altered: "from-green-900 via-green-950 to-black text-green-200 border-green-500",
  }
  return colors[mainElement] || colors.altered
}

// --- 3. NUEVO: HELPER PARA FORMATEAR TEXTO (Colores y Negritas) ---
// --- 3. HELPER PARA FORMATEAR TEXTO (Colores, Negritas y Custom Keywords) ---
const formatDescription = (text) => {
  if (!text) return null;

  // Regex Explicación:
  // 1. (\[.*?\]) -> Detecta cualquier cosa entre corchetes: [frase a resaltar]
  // 2. (Volt|Frost|Ice|Flame|Physical) -> Detecta Elementos fijos
  // 3. (\d+(?:\.\d+)?%?) -> Detecta Números
  const regex = /(\[.*?\]|Volt|Frost|Ice|Flame|Physical|\d+(?:\.\d+)?%?)/gi;

  const parts = text.split(regex);

  return parts.map((part, index) => {
    // A. Si es un Custom Keyword entre corchetes [] (Ej: [Hyperbody])
    if (part.startsWith('[') && part.endsWith(']')) {
      // Quitamos los corchetes y pintamos
      const content = part.slice(1, -1); 
      // Usamos 'text-cyan-200' (o el color que prefieras para keywords especiales)
      // O si quieres que sea dinámico según el elemento del personaje, tendríamos que pasarle el color a esta función.
      // Por defecto, un color "dorado/neutro" o "cyan" suele quedar bien para keywords de mecánicas.
      return <span key={index} className="text-yellow-200 font-bold tracking-wide">{content}</span>;
    }

    // B. Si es un Número
    if (/^\d+(?:\.\d+)?%?$/.test(part)) {
      return <span key={index} className="text-blue-400 font-bold font-mono">{part}</span>;
    }

    // C. Si es un Elemento
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

// --- COMPONENTES INTERNOS ---
const CombatSection = ({ title, items, color, icon }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className={`text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-${color}-400`}>
        <span className={`p-1.5 rounded bg-${color}-900/30 border border-${color}-500/30`}>{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="group bg-[#13131a] border border-white/5 hover:border-white/10 p-5 rounded-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-gray-100 font-bold text-base group-hover:text-white transition-colors">
                {item.title}
              </h4>
            </div>
            {/* Usamos formatDescription aquí */}
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line border-l-2 border-gray-700 pl-4">
              {formatDescription(item.description)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. COMPONENTE PRINCIPAL ---
export default async function SimulacrumPage({ params }) {
  const { id } = await params 
  const char = await getCharacter(id)

  if (!char) {
    notFound()
  }

  const themeClass = getElementColor(char.element)

  return (
    <main className={`min-h-screen bg-black text-gray-100 flex flex-col lg:flex-row-reverse font-sans selection:bg-cyan-500 selection:text-black`}>
      
      {/* --- COLUMNA DERECHA (IMAGEN) --- */}
      <aside className="w-full lg:w-[45%] lg:h-screen lg:sticky lg:top-0 relative h-[50vh] overflow-hidden border-l border-white/10 order-first lg:order-last">
        <div className={`absolute inset-0 bg-gradient-to-b ${themeClass} opacity-40`} />
        {char.images.character ? (
           <img 
             src={char.images.character} 
             alt={char.simulacrumName}
             className="absolute inset-0 w-full h-full object-cover object-top lg:object-center mix-blend-lighten hover:scale-105 transition-transform duration-700"
           />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-700">Sin Imagen</div>
        )}
      </aside>

      {/* --- COLUMNA IZQUIERDA (CONTENIDO) --- */}
      <div className="flex-1 w-full lg:w-[55%] bg-[#0b0c15]">
        
        <div className="p-6 md:p-12 lg:p-16 space-y-16 max-w-4xl mx-auto">
          
          {/* HEADER INFO */}
          <header className="space-y-4">
             <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${themeClass.split(' ')[2]}`}>
                  {char.element}
                </span>
                <span className="px-3 py-1 rounded-full border border-gray-700 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  {char.resonance}
                </span>
             </div>
             
             <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tight">
               {char.simulacrumName}
             </h1>
             <p className="text-xl text-gray-400 font-light">
               Portador del arma: <span className="text-white font-medium">{char.weaponName}</span>
             </p>

             <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5">
                  <span className="text-xs text-gray-500 uppercase font-bold">Shatter</span>
                  <div className="text-2xl font-mono text-yellow-500">{Number(char.shatter).toFixed(2)}</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5">
                   <span className="text-xs text-gray-500 uppercase font-bold">Charge</span>
                   <div className="text-2xl font-mono text-cyan-400">{Number(char.charge).toFixed(2)}</div>
                </div>
             </div>
          </header>

          {/* TRAIT */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
              Simulacrum Trait
            </h2>
            <div className="bg-gradient-to-r from-gray-900 to-transparent p-6 rounded-xl border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-white mb-2">{char.trait.title}</h3>
              {/* Aplicamos el formateador aquí también por si acaso */}
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {formatDescription(char.trait.description)}
              </p>
            </div>
          </section>

          {/* ARMA & PASIVAS (AQUÍ ESTÁ EL CAMBIO IMPORTANTE) */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-cyan-500 rounded-full"></span>
              Mecánicas del Arma
            </h2>
            
            {char.images.weapon && (
              <div className="mb-8 w-full h-64 relative rounded-lg overflow-hidden border border-white/10 bg-gradient-to-b from-gray-900 to-black group flex items-center justify-center p-4">
                <img 
                  src={char.images.weapon} 
                  alt="Weapon" 
                  className="max-h-full max-w-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute bottom-2 right-4 opacity-50 text-xs font-mono uppercase tracking-widest text-gray-500">
                   {char.weaponName}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {char.passives?.length > 0 ? (
                char.passives.map((passive, i) => (
                  <div key={i} className="group hover:bg-white/5 p-4 rounded-lg transition-colors">
                     <div className="flex items-baseline gap-3 mb-2">
                       <span className="text-cyan-500 font-mono text-sm">0{i+1}.</span>
                       <h3 className="text-lg font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                         {passive.title}
                       </h3>
                     </div>
                     {/* CAMBIO CLAVE: 
                        1. whitespace-pre-line: Respeta los saltos de línea de la DB
                        2. formatDescription(): Aplica los colores
                     */}
                     <p className="text-sm text-gray-400 pl-8 leading-relaxed border-l border-gray-800 ml-1.5 whitespace-pre-line">
                       {formatDescription(passive.description)}
                     </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 italic">No hay pasivas registradas.</p>
              )}
            </div>
          </section>
          {/* =================================================================================
              NUEVA SECCIÓN: MECÁNICAS DE COMBATE (ATTACKS, DODGE, SKILL, DISCHARGE)
             ================================================================================= */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-1 h-8 bg-red-500 rounded-full"></span>
              Moveset & Habilidades
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* COLUMNA 1: BÁSICOS */}
              <div>
                <CombatSection 
                  title="Normal Attacks" 
                  items={char.attacks} 
                  color="blue" 
                  icon={<Sword size={16} />} 
                />
                <CombatSection 
                  title="Dodge" 
                  items={char.dodges} 
                  color="green" 
                  icon={<Wind size={16} />} 
                />
                <CombatSection 
                  title="Discharge" 
                  items={char.discharges} 
                  color="purple" 
                  icon={<Activity size={16} />} 
                />
              </div>

              {/* COLUMNA 2: ESPECIALES */}
              <div>
                <CombatSection 
                  title="Skills" 
                  items={char.skills} 
                  color="orange" 
                  icon={<Zap size={16} />} 
                />
                
              </div>
            </div>
          </section>

          {/* MATRICES */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-yellow-500 rounded-full"></span>
              Matrices Recomendadas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-1">
                 {char.images.matrix ? (
                    <div className="aspect-square w-full rounded-lg overflow-hidden border border-yellow-500/20 bg-gray-900 relative group">
                      <img 
                        src={char.images.matrix} 
                        alt="Matrix" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
                      <div className="absolute bottom-2 left-0 w-full text-center text-xs font-bold text-yellow-500 uppercase tracking-widest">
                        Matrix Set
                      </div>
                    </div>
                 ) : (
                    <div className="aspect-square w-full rounded-lg border border-dashed border-gray-800 flex items-center justify-center text-xs text-gray-600 uppercase font-mono">
                      No Image
                    </div>
                 )}
               </div>

               <div className="md:col-span-2 space-y-4">
                  <div className="bg-[#111] p-5 rounded-lg border border-gray-800 hover:border-yellow-500/30 transition-colors">
                      <span className="text-yellow-500 text-xs font-bold uppercase mb-2 block">Set de 2 Piezas</span>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {formatDescription(char.matrices.pc2) || "Sin descripción"}
                      </p>
                  </div>
                  <div className="bg-[#111] p-5 rounded-lg border border-gray-800 hover:border-yellow-500/30 transition-colors">
                      <span className="text-yellow-500 text-xs font-bold uppercase mb-2 block">Set de 4 Piezas</span>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {formatDescription(char.matrices.pc4) || "Sin descripción"}
                      </p>
                  </div>
               </div>
            </div>
          </section>

          {/* AVANCES (STACK VERTICAL CENTRADO) */}
          <section className="pb-20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
              Avances
            </h2>
            
            {/* Contenedor: Columna vertical centrada con ancho limitado */}
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {char.advancements.map((desc, i) => (
                 desc && (
                   <div key={i} className="group bg-[#111] border border-gray-800 hover:border-orange-500/40 p-6 rounded-xl transition-all duration-300 relative overflow-hidden">
                      
                      {/* Glow decorativo */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                         
                         {/* Header: Icono Estrella + Título (Lado Izquierdo) */}
                         <div className="flex-shrink-0 flex items-center gap-4 sm:w-40">
                           <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform duration-500">
                             <Star size={20} fill="currentColor" />
                           </div>
                           <div>
                             <h3 className="text-xl font-black text-white italic uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                               {i+1} Star
                             </h3>
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Active</span>
                           </div>
                         </div>

                         {/* Contenido (Lado Derecho con Línea) */}
                         <div className="flex-1 pl-6 border-l-2 border-gray-800 group-hover:border-orange-500/30 transition-colors">
                           <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                             {formatDescription(desc)}
                           </p>
                         </div>

                      </div>
                   </div>
                 )
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}