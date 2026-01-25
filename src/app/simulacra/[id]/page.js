import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { notFound } from "next/navigation"

// --- 1. FUNCIÓN PARA BUSCAR EL PERSONAJE ---
async function getCharacter(id) {
  const docRef = doc(db, "characters", id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  return { id: docSnap.id, ...docSnap.data() }
}

// --- 2. HELPER PARA COLORES SEGÚN ELEMENTO (Estética) ---
const getElementColor = (element) => {
  // Manejo de fallbacks por si element viene undefined
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

// --- 3. COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default async function SimulacrumPage({ params }) {
  const { id } = await params 
  const char = await getCharacter(id)

  if (!char) {
    notFound()
  }

  const themeClass = getElementColor(char.element)

  return (
    // CAMBIO 1: lg:flex-row-reverse pone la imagen a la DERECHA en escritorio
    <main className={`min-h-screen bg-black text-gray-100 flex flex-col lg:flex-row-reverse font-sans selection:bg-cyan-500 selection:text-black`}>
      
      {/* --- COLUMNA DERECHA (IMAGEN ESTÁTICA) --- */}
      {/* CAMBIO: border-l (borde izquierdo) en lugar de border-r */}
      <aside className="w-full lg:w-[45%] lg:h-screen lg:sticky lg:top-0 relative h-[50vh] overflow-hidden border-l border-white/10 order-first lg:order-last">
        
        <div className={`absolute inset-0 bg-gradient-to-b ${themeClass} opacity-40`} />
        
        {char.images.character ? (
           <img 
             src={char.images.character} 
             alt={char.simulacrumName}
             // Alineación ajustada para que se vea bien a la derecha
             className="absolute inset-0 w-full h-full object-cover object-top lg:object-center mix-blend-lighten hover:scale-105 transition-transform duration-700"
           />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-700">Sin Imagen</div>
        )}

        
      </aside>

      {/* --- COLUMNA IZQUIERDA (CONTENIDO SCROLLABLE) --- */}
      <div className="flex-1 w-full lg:w-[55%] bg-[#0b0c15]">
        
        <div className="p-6 md:p-12 lg:p-16 space-y-16 max-w-4xl mx-auto">
          
          {/* 1. HEADER INFO */}
          <header className="space-y-4">
             <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${themeClass.split(' ')[2]}`}>
                  {char.element}
                </span>
                <span className="px-3 py-1 rounded-full border border-gray-700 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  {char.resonance}
                </span>
             </div>
             
             <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
               {char.simulacrumName}
             </h1>
             <p className="text-xl text-gray-400 font-light">
               Portador del arma: <span className="text-white font-medium">{char.weaponName}</span>
             </p>

             {/* Stats Rápidos */}
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

          {/* 2. TRAIT */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
              Simulacrum Trait
            </h2>
            <div className="bg-gradient-to-r from-gray-900 to-transparent p-6 rounded-xl border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-white mb-2">{char.trait.title}</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {char.trait.description}
              </p>
            </div>
          </section>

          {/* 3. ARMA & PASIVAS */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-cyan-500 rounded-full"></span>
              Mecánicas del Arma
            </h2>
            
            {/* CAMBIO 2: Arreglo de pixelado de imagen de arma */}
            {char.images.weapon && (
              <div className="mb-8 w-full h-64 relative rounded-lg overflow-hidden border border-white/10 bg-gradient-to-b from-gray-900 to-black group flex items-center justify-center p-4">
                {/* Usamos object-contain para que no se recorte ni se estire (adiós pixelado) */}
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
                     <p className="text-sm text-gray-400 pl-8 leading-relaxed border-l border-gray-800 ml-1.5">
                       {passive.description}
                     </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 italic">No hay pasivas registradas.</p>
              )}
            </div>
          </section>

          {/* 4. MATRICES (CAMBIO 3: INCLUIR FOTO) */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-yellow-500 rounded-full"></span>
              Matrices Recomendadas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               
               {/* COLUMNA 1: FOTO MATRIZ */}
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

               {/* COLUMNA 2: DESCRIPCIONES (Ocupa 2/3 del espacio) */}
               <div className="md:col-span-2 space-y-4">
                  {/* 2 Piezas */}
                  <div className="bg-[#111] p-5 rounded-lg border border-gray-800 hover:border-yellow-500/30 transition-colors">
                      <span className="text-yellow-500 text-xs font-bold uppercase mb-2 block">Set de 2 Piezas</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{char.matrices.pc2 || "Sin descripción"}</p>
                  </div>
                  {/* 4 Piezas */}
                  <div className="bg-[#111] p-5 rounded-lg border border-gray-800 hover:border-yellow-500/30 transition-colors">
                      <span className="text-yellow-500 text-xs font-bold uppercase mb-2 block">Set de 4 Piezas</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{char.matrices.pc4 || "Sin descripción"}</p>
                  </div>
               </div>

            </div>
          </section>

          {/* 5. AVANCES */}
          <section className="pb-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
              Avances (Stars)
            </h2>
            <div className="space-y-3">
              {char.advancements.map((desc, i) => (
                 desc && (
                   <div key={i} className="flex gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                      <div className="flex-shrink-0">
                         <div className="w-10 h-10 rounded-full bg-gray-900 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold font-mono">
                           A{i+1}
                         </div>
                      </div>
                      <p className="text-sm text-gray-300 pt-2 leading-relaxed">
                        {desc}
                      </p>
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