"use client"

import React, { useState, useMemo } from 'react';
import { Search, Filter, Zap, Snowflake, Flame, Activity, Sparkles, Crosshair, Shield, HeartPulse, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSimulacra } from "@/context/SimulacraContext"; 

// ==========================================
// CONFIGURACIÓN DE UI (Iconos y Colores)
// ==========================================
const ELEMENT_CONFIG = {
  Altered:  { color: "text-accent", bg: "bg-accent", border: "border-accent", icon: Sparkles },
  Frost:    { color: "text-primary", bg: "bg-primary", border: "border-primary", icon: Snowflake },
  Ice:      { color: "text-primary", bg: "bg-primary", border: "border-primary", icon: Snowflake }, // ✅ Agregado para compatibilidad
  Flame:    { color: "text-error", bg: "bg-error", border: "border-error", icon: Flame },
  Volt:     { color: "text-energy", bg: "bg-energy", border: "border-energy", icon: Zap },
  Physical: { color: "text-warning", bg: "bg-warning", border: "border-warning", icon: Activity },
};

const ROLE_CONFIG = {
  DPS:      { icon: Crosshair, style: "bg-red-600 shadow-red-900/50 text-white", border: "border-red-500" },
  Attack:   { icon: Crosshair, style: "bg-red-600 shadow-red-900/50 text-white", border: "border-red-500" },
  Tank:     { icon: Shield,    style: "bg-amber-500 shadow-amber-900/50 text-black", border: "border-amber-500" },
  Fortitude:{ icon: Shield,    style: "bg-amber-500 shadow-amber-900/50 text-black", border: "border-amber-500" },
  Support:  { icon: HeartPulse,style: "bg-emerald-500 shadow-emerald-900/50 text-white", border: "border-emerald-500" },
  Benediction:{ icon: HeartPulse,style: "bg-emerald-500 shadow-emerald-900/50 text-white", border: "border-emerald-500" },
  // Estilo por defecto para "All"
  All:      { icon: Filter,    style: "bg-white shadow-white/20 text-black", border: "border-white" }
};
// ==========================================
// COMPONENTES INTERNOS
// ==========================================

const FilterPill = ({ label, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border
      ${active 
        ? 'bg-foreground text-background border-foreground shadow-[0_0_15px_-3px_rgba(255,255,255,0.5)]' 
        : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'}
    `}
  >
    {Icon && <Icon size={14} />}
    {label}
  </button>
);

const SimulacraCard = ({ data }) => {
  // ✅ 1. Lógica para elemento dual (Volt-Ice -> usa color Volt)
  const mainElement = data.element ? data.element.split('-')[0] : 'Altered';
  const elConfig = ELEMENT_CONFIG[mainElement] || ELEMENT_CONFIG.Altered;

  // ✅ 2. Normalización de Rol para icono
  let roleKey = data.resonance || "DPS"; 
  // Mapeamos lo que viene de DB a las keys de ROLE_CONFIG si es necesario
  const RoleIcon = ROLE_CONFIG[roleKey]?.icon || Crosshair; 
  
  // ✅ 3. Mapeo de nombre de rol para mostrar (Attack -> DPS)
  const displayRole = roleKey === "Attack" ? "DPS" : roleKey === "Fortitude" ? "Tank" : roleKey === "Benediction" ? "Support" : roleKey;

  return (
    <div className="group relative h-[450px] w-full rounded-2xl overflow-hidden bg-card border border-border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      
      {/* Glow Hover Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-t from-${elConfig.bg.split('-')[1]} via-transparent to-transparent`}></div>

      {/* Imagen de Fondo */}
      <div className="absolute inset-0 z-0">
        {/* ✅ CAMBIO: data.image -> data.images.character */}
        {data.images?.character ? (
           <img src={data.images.character} alt={data.simulacrumName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-top" />
        ) : (
           <div className="w-full h-full bg-gray-900 flex items-center justify-center text-xs text-muted-foreground">NO IMAGE</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90"></div>
      </div>

      {/* Contenido (Info) */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        
        {/* Top Badges (Flotantes) */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           {/* ✅ CAMBIO: data.stats.charge -> data.charge (numérico) */}
           <span className="px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] font-mono text-white border border-white/10">
             CHRG: <span className={elConfig.color}>{Number(data.charge || 0).toFixed(2)}</span>
           </span>
           <span className="px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] font-mono text-white border border-white/10">
             SHAT: <span className={elConfig.color}>{Number(data.shatter || 0).toFixed(2)}</span>
           </span>
        </div>

        {/* INFO BASE */}
        <div className="transition-opacity duration-500 group-hover:opacity-0">
          <div className="flex items-center gap-2 mb-1">
             <span className={`p-1.5 rounded-full bg-${elConfig.bg}/20 ${elConfig.color} border ${elConfig.border}/30 backdrop-blur-md`}>
                <elConfig.icon size={14} />
             </span>
             <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {/* ✅ CAMBIO: Mostrar elemento limpio y rol mapeado */}
                {mainElement} / {displayRole}
             </span>
          </div>
          {/* ✅ CAMBIO: data.name -> data.simulacrumName */}
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{data.simulacrumName}</h3>
          {/* ✅ CAMBIO: data.title -> data.trait.title (o weaponName) */}
          <p className="text-sm text-gray-400 font-medium">{data.trait?.title || data.weaponName}</p>
        </div>
        
        <div className={`h-0.5 w-full bg-gradient-to-r from-${elConfig.bg.split('-')[1]} to-transparent my-4 opacity-50 transition-opacity duration-500 group-hover:opacity-100`}></div>
        
        <div className="group-hover:opacity-0 transition-opacity duration-300 text-xs text-muted-foreground font-mono flex items-center gap-2">
            {/* ✅ CAMBIO: data.weapon -> data.weaponName */}
            <RoleIcon size={12} /> Weapon: {data.weaponName}
        </div>
        
        {/* OVERLAY ANIMADA */}
        <div className="absolute bottom-0 left-0 right-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex flex-col justify-end p-6 pointer-events-none">
          <p className="text-sm text-gray-200 leading-relaxed mb-4 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 delay-75 ease-out line-clamp-3">
            {/* ✅ CAMBIO: data.description -> data.trait.description */}
            {data.trait?.description || "Sin descripción disponible."}
          </p>

          <Link
            href={`/simulacra/${data.id}`}
            className={`opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 delay-150 ease-out pointer-events-auto text-center w-full py-2 rounded-md font-bold text-xs uppercase tracking-widest ${elConfig.bg} text-background hover:brightness-110`}
          >
            Ver Perfil Completo
          </Link>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const SimulacraGallery = () => {
  const [filterRole, setFilterRole] = useState('All');
  const [filterElement, setFilterElement] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Consumimos la data real y el estado de carga
  const { characters, loading } = useSimulacra();

  // ✅ Lógica de filtrado adaptada a Firebase
  const filteredData = useMemo(() => {
    return characters.filter(sim => {
      // 1. Normalizar Rol (Firebase dice "Attack", UI dice "DPS")
      let simRole = sim.resonance;
      if (simRole === "Attack") simRole = "DPS";
      if (simRole === "Fortitude") simRole = "Tank";
      if (simRole === "Benediction") simRole = "Support";

      // 2. Normalizar Elemento (Firebase dice "Volt-Ice", UI dice "Volt")
      const mainElement = sim.element ? sim.element.split('-')[0] : 'Altered';

      const matchRole = filterRole === 'All' || simRole === filterRole;
      
      // Permitimos buscar por elemento compuesto o simple
      const matchElement = filterElement === 'All' || mainElement === filterElement || sim.element === filterElement;
      
      // 3. Buscar por nombre correcto
      const matchSearch = sim.simulacrumName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchRole && matchElement && matchSearch;
    });
  }, [filterRole, filterElement, searchTerm, characters]);

  return (
    <div className="min-h-screen pt-20 pb-20 animate-fade-in bg-[radial-gradient(ellipse_at_top,_var(--color-card)_0%,_var(--color-background)_60%)]">
      
      {/* HEADER ... (Sin cambios visuales) ... */}
      <div className="container mb-12">
        <Link href="/" className="btn btn-outline mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:border-primary/50">
            <ChevronLeft size={16} /> Volver al Home
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border relative">
            <div>
              <div className="flex items-center gap-2 text-primary font-mono text-sm mb-2">
                <Shield size={16} /> <span>DATABASE // ROSTER_V2.0</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                Simulacra <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Archive</span>
              </h1>
            </div>

            <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="Buscar por nombre..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-card/50 border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:shadow-[0_0_20px_-5px_var(--color-primary)] transition-all text-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
        </div>

        {/* FILTROS */}
        <div className="mt-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase text-muted-foreground mr-2 flex items-center gap-1">
              <Filter size={12}/> Element:
            </span>
            <FilterPill label="All" active={filterElement === 'All'} onClick={() => setFilterElement('All')} />
            {Object.keys(ELEMENT_CONFIG).map(elm => (
               // Ocultar elementos repetidos si quieres (ej. Frost vs Ice) o dejarlos
               (elm !== 'Frost') &&
               <FilterPill key={elm} label={elm} active={filterElement === elm} onClick={() => setFilterElement(elm)} icon={ELEMENT_CONFIG[elm].icon}/>
            ))}
          </div>
{/* Filtro Roles (MEJORADO) */}
          <div className="flex p-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 gap-1 overflow-x-auto">
            {['All', 'DPS', 'Tank', 'Support'].map(role => {
              // Obtenemos la config (Icono y Colores)
              const config = ROLE_CONFIG[role] || ROLE_CONFIG.All; 
              const Icon = config.icon;
              const isActive = filterRole === role;

              return (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`
                    relative px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-out
                    flex items-center gap-2 border
                    ${isActive 
                      ? `${config.style} ${config.border} shadow-lg scale-105 z-10` 
                      : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'
                    }
                  `}
                >
                  {/* Icono (Si está activo se ve sólido, si no un poco transparente) */}
                  <Icon size={14} className={isActive ? "opacity-100" : "opacity-70"} />
                  
                  {role}

                  {/* Indicador de "Luz" inferior cuando está activo */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-white/50 rounded-full blur-[1px]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* GRID DE RESULTADOS */}
      <div className="container">
        {/* ✅ CAMBIO: Manejo de estado de carga */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-muted-foreground font-mono text-sm">Descifrando datos de Hykros...</p>
            </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredData.map(sim => (
              <SimulacraCard key={sim.id} data={sim} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-6 border border-border">
               <Search size={40} className="text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No se encontraron datos</h3>
            <p className="text-muted-foreground max-w-md">No hay simulacras que coincidan en la DB.</p>
            <button 
              onClick={() => {setFilterRole('All'); setFilterElement('All'); setSearchTerm('');}}
              className="mt-6 text-primary hover:underline text-sm font-bold"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center text-xs text-muted-foreground font-mono uppercase">
           <span>Displaying {filteredData.length} entries</span>
           <span>TOWER OF FANTASY // Ver 5.6.2</span>
        </div>
      </div>

    </div>
  );
};

export default SimulacraGallery;