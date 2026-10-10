"use client"

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSimulacra } from "@/context/SimulacraContext";
import { normalizeElements } from "@/lib/elements.mjs";
import { groupTierCharacters } from "@/lib/tier-search.mjs";
import {
  ChevronLeft,
  Search,
  Loader2,
  Zap,
  Snowflake,
  Flame,
  Activity,
  Sparkles,
} from "lucide-react";

const TIER_CONFIG = {
  "salidy": "S+",
  "lana": "S+",
  "nanto": "S+",
  "helene": "S+",
  "veronika": "S+",
  "agleia": "S+",
  "nemesis-voidpiercer": "S+",

  "lechesis": "S",
  "hipper": "S",
  "aster": "S",
  "gray-fox": "S",

  "lyncis": "A",
  "carrot": "A",
  "antoria": "A",
  "claudia-storm-eye": "A",

  "asurada": "B",
};

const TIER_ORDER = ["S+", "S", "A", "B"];

const TIER_STYLES = {
  "S+": { bg: "bg-red-600", text: "text-red-500", border: "border-red-600", glow: "shadow-red-500/50" },
  "S": { bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500", glow: "shadow-orange-500/50" },
  "A": { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500", glow: "shadow-purple-500/50" },
  "B": { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500", glow: "shadow-blue-500/50" },
  "Unranked": { bg: "bg-gray-600", text: "text-gray-500", border: "border-gray-600", glow: "shadow-gray-500/20" },
};

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
  Flame,
  Volt: Zap,
  Physical: Activity,
};

const TierCard = ({ char }) => {
  const mainElement = normalizeElements(char.element)[0] || "Altered";
  const borderColor = ELEMENT_COLORS[mainElement] || ELEMENT_COLORS.Altered;
  const ElementIcon = ELEMENT_ICONS[mainElement] || Sparkles;

  return (
    <Link
      href={`/simulacra/${char.id}`}
      aria-label={`${char.simulacrumName} — ${char.weaponName}`}
      className={`
        group relative w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden
        border-2 ${borderColor} bg-card cursor-pointer transition-all duration-300
        hover:scale-110 hover:z-10 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]
      `}
    >
      <div className="absolute inset-0 bottom-9 p-2 flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
        {char.images?.weapon ? (
          <img
            src={char.images.weapon}
            alt={char.weaponName}
            className="w-full h-full object-contain drop-shadow-2xl transition-all duration-300"
          />
        ) : (
          <span className="text-[10px] text-muted-foreground">NO IMG</span>
        )}
      </div>

      <div className="absolute top-1 right-1 p-1 rounded-full bg-black/60 backdrop-blur border border-white/10">
        <ElementIcon size={10} className="text-white" />
      </div>

      <div className="absolute bottom-0 inset-x-0 min-h-9 flex flex-col items-center justify-center bg-black/90 py-1">
        <span className="text-xs md:text-sm font-black text-white text-center uppercase tracking-wider px-2 leading-tight">
          {char.simulacrumName}
        </span>
      </div>
    </Link>
  );
};

const TierRow = ({ tierLabel, characters }) => {
  const style = TIER_STYLES[tierLabel] || TIER_STYLES.Unranked;

  return (
    <div className="flex flex-col md:flex-row border border-border rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm mb-6 animate-slide-up">
      <div
        className={`
          w-full md:w-32 min-h-[100px] flex items-center justify-center
          ${style.bg} relative overflow-hidden
        `}
      >
        <h2 className="text-5xl font-black text-black/80 italic tracking-tighter z-10 relative">{tierLabel}</h2>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      </div>

      <div className="flex-1 min-w-0 p-4 md:p-6 flex flex-wrap gap-4 items-center content-center min-h-[120px]">
        {characters.length > 0 ? (
          characters.map((char) => <TierCard key={char.id} char={char} />)
        ) : (
          <span className="text-sm text-muted-foreground italic opacity-50 pl-4">
            No matching characters in this tier.
          </span>
        )}
      </div>
    </div>
  );
};

export default function TierListPage() {
  const { characters, loading } = useSimulacra();
  const [searchTerm, setSearchTerm] = useState("");

  const tierData = useMemo(() => {
    return groupTierCharacters(characters, TIER_CONFIG, searchTerm);
  }, [characters, searchTerm]);
  const resultCount = Object.values(tierData).reduce((total, entries) => total + entries.length, 0);

  return (
    <div className="min-h-screen pt-20 pb-20 animate-fade-in bg-[radial-gradient(ellipse_at_top,_var(--color-card)_0%,_var(--color-background)_60%)]">
      <div className="container mb-12">
        <Link
          href="/"
          className="btn btn-outline mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:border-primary/50"
        >
          <ChevronLeft size={16} /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border relative">
          <div>
            <div className="flex items-center gap-2 text-energy font-mono text-sm mb-2">
              <Activity size={16} /> <span>META ANALYSIS // V5.6</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Global{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-energy to-orange-500">
                Tier List
              </span>
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <input
              aria-label="Search tier list by character name"
              type="text"
              placeholder="Search character..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/50 border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-energy focus:shadow-[0_0_20px_-5px_var(--color-energy)] transition-all text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="animate-spin text-energy mb-4" size={40} />
            <p className="text-muted-foreground font-mono text-sm">Analyzing combat data...</p>
          </div>
        ) : resultCount === 0 ? (
          <div role="status" className="py-20 text-center">
            <h2 className="text-xl font-bold mb-2">{searchTerm.trim() ? 'No characters found' : 'No characters available'}</h2>
            <p className="text-muted-foreground">{searchTerm.trim() ? 'Try another name or clear your search.' : 'The tier list has no character data to display.'}</p>
            {searchTerm.trim() && <button onClick={() => setSearchTerm('')} className="mt-6 text-energy font-bold hover:underline">Clear search</button>}
          </div>
        ) : (
          <div className="space-y-4">
            {TIER_ORDER.filter(tier => !searchTerm.trim() || tierData[tier].length > 0).map((tier) => (
              <TierRow key={tier} tierLabel={tier} characters={tierData[tier]} />
            ))}

            {tierData.Unranked.length > 0 && searchTerm.trim() !== "" && (
              <div className="mt-12 opacity-70">
                <h3 className="text-sm font-mono uppercase text-muted-foreground mb-4 border-b border-border pb-2">
                  Unranked Results
                </h3>
                <TierRow tierLabel="Unranked" characters={tierData.Unranked} />
              </div>
            )}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-3 justify-between items-center text-xs text-muted-foreground font-mono uppercase">
          <span>Based on CN/Global Calculation</span>
          <span>UPDATED: JAN 2026</span>
        </div>
      </div>
    </div>
  );
}
