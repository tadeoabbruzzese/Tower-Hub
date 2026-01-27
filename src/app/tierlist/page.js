"use client"

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSimulacra } from "@/context/SimulacraContext";
import { ChevronLeft, Shield, Search, Loader2, Zap, Snowflake, Flame, Activity, Sparkles } from 'lucide-react';

// ==========================================
// 1. CONFIGURACIÓN MANUAL DE TIERS
// ==========================================
// Aquí defines manualmente en qué Tier está cada personaje usando su ID o Nombre (debe coincidir con la DB)
// Si un personaje no está aquí, aparecerá en "Unranked" (o puedes ocultarlo).
const TIER_CONFIG = {
  // --- TIER S+ (META) ---
  "salidy": "S+",
  "lana": "S+",
  "nanto": "S+",
  "helene": "S+",
  "veronika": "S+",
  
  // --- TIER S (CORE) ---
  
  
  // --- TIER A (VIABLE) ---

  
  // --- TIER B (NICHE) ---
  
};

// Orden de visualización
const TIER_ORDER = ["S+", "S", "A", "B"];

// Colores de los Tiers
const TIER_STYLES = {
  "S+": { bg: "bg-red-600", text: "text-red-500", border: "border-red-600", glow: "shadow-red-500/50" },
  "S":  { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500", glow: "shadow-orange-500/50" },
  "A":  { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500", glow: "shadow-purple-500/50" },
  "B":  { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", glow: "shadow-blue-500/50" },
  "Unranked": { bg: "bg-gray-600", text: "text-gray-500", border: "border-gray-600", glow: "shadow-gray-500/20" }
};

// Colores de Elementos (Para el borde de la carta)
const ELEMENT_COLORS = {
  Altered: "border-accent shadow-accent/20",
  Frost: "border-primary shadow-primary/20",
  Ice: "border-primary shadow-primary/20",
  Flame: "border-error shadow-error/20",
  Volt: "border-energy shadow-energy/20",
  Physical: "border-warning shadow-warning/20",
};

const ELEMENT_ICONS = {
  Altered: Sparkles,
  Frost: Snowflake,
  Ice: Snowflake,
  Flame: Flame,
  Volt: Zap,
  Physical: Activity,
};

// ==========================================
// COMPONENTES INTERNOS
// ==========================================

const TierCard = ({ char }) => {
  // Detectar elemento para estilos
  const mainElement = char.element ? char.element.split('-')[0] : 'Altered';
  const borderColor = ELEMENT_COLORS[mainElement] || ELEMENT_COLORS.Altered;
  const ElementIcon = ELEMENT_ICONS[mainElement] || Sparkles;

  return (
    <Link 
      href={`/simulacra/${char.id}`}
      className={`
        group relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden 
        border-2 ${borderColor} bg-card cursor-pointer transition-all duration-300
        hover:scale-110 hover:z-10 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]
      `}
    >
      {/* IMAGEN DEL ARMA (Solicitado) */}
      <div className="absolute inset-0 p-2 flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
        {char.images?.weapon ? (
          <img 
            src={char.images.weapon} 
            alt={char.weaponName} 
            className="w-full h-full object-contain drop-shadow-2xl group-hover:blur-sm transition-all duration-300"
          />
        ) : (
          <span className="text-[10px] text-muted-foreground">NO IMG</span>
        )}
      </div>

      {/* Icono de Elemento (Esquina Superior) */}
      <div className="absolute top-1 right-1 p-1 rounded-full bg-black/60 backdrop-blur border border-white/10">
        <ElementIcon size={10} className="text-white" />
      </div>

      {/* HOVER: NOMBRE DEL PERSONAJE (Solicitado) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-[2px]">
        <span className="text-xs md:text-sm font-black text-white text-center uppercase tracking-wider px-2 leading-tight">
          {char.simulacrumName}
        </span>
        <span className="text-[10px] text-gray-400 mt-1 font-mono">
          {char.weaponName}
        </span>
      </div>
    </Link>
  );
};

const TierRow = ({ tierLabel, characters }) => {
  const style = TIER_STYLES[tierLabel] || TIER_STYLES.Unranked;

  return (
    <div className="flex flex-col md:flex-row border border-border rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm mb-6 animate-slide-up">
      
      {/* ETIQUETA DEL TIER (IZQUIERDA) */}
      <div className={`
        w-full md:w-32 min-h-[100px] flex items-center justify-center 
        ${style.bg} relative overflow-hidden
      `}>
        <h2 className="text-5xl font-black text-black/80 italic tracking-tighter z-10 relative">
          {tierLabel}
        </h2>
        {/* Decoración de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
      </div>

      {/* CONTENEDOR DE PERSONAJES (DERECHA) */}
      <div className="flex-1 p-6 flex flex-wrap gap-4 items-center content-center min-h-[120px]">
        {characters.length > 0 ? (
          characters.map(char => (
            <TierCard key={char.id} char={char} />
          ))
        ) : (
          <span className="text-sm text-muted-foreground italic opacity-50 pl-4">
            No characters in this tier yet.
          </span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================

export default function TierListPage() {
  const { characters, loading } = useSimulacra();
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica para agrupar personajes por Tier
  const tierData = useMemo(() => {
    const grouped = { "S+": [], "S": [], "A": [], "B": [], "Unranked": [] };

    characters.forEach(char => {
      // Normalizamos el nombre/ID para buscar en la config (usamos id o simulacrumName en minúsculas)
      // Ajusta esto según cómo guardes las keys en TIER_CONFIG
      const key = char.id || char.simulacrumName.toLowerCase().replace(" ", "_");
      
      const tier = TIER_CONFIG[key] || "Unranked";
      
      // Filtro de búsqueda básico
      if (searchTerm === '' || char.simulacrumName.toLowerCase().includes(searchTerm.toLowerCase())) {
        if (grouped[tier]) {
          grouped[tier].push(char);
        }
      }
    });

    return grouped;
  }, [characters, searchTerm]);

  return (
    <div className="min-h-screen pt-20 pb-20 animate-fade-in bg-[radial-gradient(ellipse_at_top,_var(--color-card)_0%,_var(--color-background)_60%)]">
      
      {/* HEADER (Estilo Simulacra Gallery) */}
      <div className="container mb-12">
        <Link href="/" className="btn btn-outline mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:border-primary/50">
            <ChevronLeft size={16} /> Volver al Home
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border relative">
            <div>
              <div className="flex items-center gap-2 text-energy font-mono text-sm mb-2">
                <Activity size={16} /> <span>META ANALYSIS // V5.6</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-energy to-orange-500">Tier List</span>
              </h1>
            </div>

            <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="Buscar personaje..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-card/50 border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-energy focus:shadow-[0_0_20px_-5px_var(--color-energy)] transition-all text-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
        </div>
      </div>

      {/* CONTENIDO TIER LIST */}
      <div className="container">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="animate-spin text-energy mb-4" size={40} />
                <p className="text-muted-foreground font-mono text-sm">Analizando datos de combate...</p>
            </div>
        ) : (
          <div className="space-y-4">
            {/* Renderizar filas S+, S, A, B */}
            {TIER_ORDER.map(tier => (
              <TierRow key={tier} tierLabel={tier} characters={tierData[tier]} />
            ))}

            {/* Opcional: Mostrar Unranked si hay búsquedas o quieres ver los que faltan clasificar */}
            {tierData["Unranked"].length > 0 && searchTerm !== '' && (
               <div className="mt-12 opacity-70">
                 <h3 className="text-sm font-mono uppercase text-muted-foreground mb-4 border-b border-border pb-2">Resultados sin clasificar</h3>
                 <TierRow tierLabel="Unranked" characters={tierData["Unranked"]} />
               </div>
            )}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center text-xs text-muted-foreground font-mono uppercase">
            <span>Based on CN/Global Calculation</span>
            <span>UPDATED: JAN 2026</span>
        </div>
      </div>

    </div>
  );
}