"use client"

import React, { useMemo, useState } from "react";
import { Search, Filter, Box, ChevronLeft, Loader2, Star } from "lucide-react";
import Link from "next/link";
import { useRelics } from "@/context/RelicsContext";

const RARITY_CONFIG = {
  SSR: {
    color: "text-yellow-500",
    bg: "bg-yellow-500",
    border: "border-yellow-500",
    glow: "shadow-yellow-500/50",
    gradient: "from-yellow-500/20",
  },
  SR: {
    color: "text-purple-500",
    bg: "bg-purple-500",
    border: "border-purple-500",
    glow: "shadow-purple-500/50",
    gradient: "from-purple-500/20",
  },
  Unknown: {
    color: "text-gray-500",
    bg: "bg-gray-500",
    border: "border-gray-500",
    glow: "shadow-gray-500/50",
    gradient: "from-gray-500/20",
  },
};

const formatDescription = (text) => {
  if (!text) return null;

  const regex = /(\[.*?\]|Volt|Frost|Ice|Flame|Physical|\d+(?:\.\d+)?%?)/gi;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return (
        <span key={index} className="text-yellow-200 font-bold">
          {part.slice(1, -1)}
        </span>
      );
    }

    if (/^\d+(?:\.\d+)?%?$/.test(part)) {
      return (
        <span key={index} className="text-blue-400 font-bold">
          {part}
        </span>
      );
    }

    return part;
  });
};

const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border
      ${
        active
          ? "bg-foreground text-background border-foreground shadow-[0_0_15px_-3px_rgba(255,255,255,0.5)] scale-105"
          : "bg-card text-muted-foreground border-border hover:border-yellow-500/50 hover:text-foreground"
      }
    `}
  >
    {label}
  </button>
);

const SectionHeader = ({ rarity, count }) => {
  const config = RARITY_CONFIG[rarity] || RARITY_CONFIG.Unknown;

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div
          className={`relative w-12 h-12 rounded-2xl border ${config.border}/40 bg-black/30 flex items-center justify-center overflow-hidden`}
        >
          <div className={`absolute inset-0 ${config.bg} opacity-10 blur-xl`} />
          <Star size={18} className={`${config.color} relative z-10`} fill="currentColor" />
        </div>
        <div>
          <div className={`text-xs font-mono uppercase tracking-[0.25em] ${config.color}`}>
            {rarity} Relics
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            {rarity === "SSR" ? "SSR Relics" : "SR Relics"}
          </h2>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
        <span className={`w-2 h-2 rounded-full ${config.bg}`} />
        <span>{count} entries</span>
      </div>
    </div>
  );
};

const RelicCard = ({ data }) => {
  const rarity = data.rarity || "SSR";
  const config = RARITY_CONFIG[rarity] || RARITY_CONFIG.Unknown;

  return (
    <Link
      href={`/relics/${data.id}`}
      className="block w-full group relative h-80 rounded-2xl overflow-hidden bg-card border border-border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t ${config.gradient} via-transparent to-transparent pointer-events-none`}
      />

      <div className="absolute inset-0 z-0 bg-[#0b0c15] flex items-center justify-center p-8">
        <div
          className={`absolute w-40 h-40 rounded-full ${config.bg} opacity-5 blur-[50px] group-hover:opacity-20 transition-opacity duration-500`}
        />

        {data.image ? (
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 z-10"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground opacity-50">
            <Box size={32} />
            <span className="text-xs font-mono">NO IMAGE</span>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 z-20">
        <span
          className={`px-2 py-1 rounded bg-black/60 backdrop-blur border border-white/10 text-[10px] font-black uppercase tracking-widest ${config.color}`}
        >
          {rarity}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-1 group-hover:text-yellow-400 transition-colors">
            {data.name}
          </h3>

          <div
            className={`h-0.5 w-12 ${config.bg} mb-3 opacity-50 group-hover:w-full group-hover:opacity-100 transition-all duration-500`}
          />

          <p className="text-xs text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            {formatDescription(data.description) || "High-tech relic designed for combat and exploration."}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default function RelicsGallery() {
  const [filterRarity, setFilterRarity] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { relics, loading } = useRelics();

  const filteredData = useMemo(() => {
    return relics.filter((item) => {
      const matchRarity = filterRarity === "All" || item.rarity === filterRarity;
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRarity && matchSearch;
    });
  }, [filterRarity, searchTerm, relics]);

  const groupedRelics = useMemo(() => {
    const groups = {
      SSR: [],
      SR: [],
      Unknown: [],
    };

    filteredData.forEach((item) => {
      const rarity = item.rarity || "Unknown";
      if (!groups[rarity]) {
        groups.Unknown.push(item);
        return;
      }
      groups[rarity].push(item);
    });

    return groups;
  }, [filteredData]);

  const sectionsToRender =
    filterRarity === "All"
      ? [
          { rarity: "SSR", items: groupedRelics.SSR },
          { rarity: "SR", items: groupedRelics.SR },
          { rarity: "Unknown", items: groupedRelics.Unknown },
        ].filter((section) => section.items.length > 0)
      : [{ rarity: filterRarity, items: filteredData }].filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen pt-20 pb-20 animate-fade-in bg-[radial-gradient(ellipse_at_top,_var(--color-card)_0%,_var(--color-background)_60%)]">
      <div className="container mb-12">
        <Link
          href="/"
          className="btn btn-outline mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-yellow-500 hover:border-yellow-500/50"
        >
          <ChevronLeft size={16} /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border relative">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 font-mono text-sm mb-2">
              <Box size={16} /> <span>EQUIPMENT // RELICS_DB</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Relics{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                Arsenal
              </span>
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search relic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/50 border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_20px_-5px_var(--color-yellow-500)] transition-all text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
            <Filter size={12} /> Rarity:
          </span>
          <FilterPill label="All" active={filterRarity === "All"} onClick={() => setFilterRarity("All")} />
          <FilterPill label="SSR" active={filterRarity === "SSR"} onClick={() => setFilterRarity("SSR")} />
          <FilterPill label="SR" active={filterRarity === "SR"} onClick={() => setFilterRarity("SR")} />
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="animate-spin text-yellow-500 mb-4" size={40} />
            <p className="text-muted-foreground font-mono text-sm">Loading inventory...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="space-y-14">
            {sectionsToRender.map((section) => (
              <section key={section.rarity} className="relative">
                {section.rarity !== "Unknown" ? (
                  <SectionHeader rarity={section.rarity} count={section.items.length} />
                ) : (
                  <div className="mb-6">
                    <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-2">
                      Unclassified
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Unknown Rarity</h2>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.items.map((relic) => (
                    <RelicCard key={relic.id} data={relic} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-6 border border-border">
              <Search size={40} className="text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No relics found</h3>
            <p className="text-muted-foreground max-w-md">Try changing the active filters or search term.</p>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center text-xs text-muted-foreground font-mono uppercase">
          <span>Displaying {filteredData.length} items</span>
          <span>HYKROS ARMORY</span>
        </div>
      </div>
    </div>
  );
}
