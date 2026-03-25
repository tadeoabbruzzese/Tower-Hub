"use client";

import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  Star,
  Sword,
  Wind,
  Zap,
} from "lucide-react";
import { SectionIndex } from "./SectionIndex";
import { useState, useEffect } from "react";

const ELEMENT_THEMES = {
  volt: {
    accent: "text-purple-300",
    accentStrong: "text-purple-400",
    bar: "bg-purple-500",
    glow: "shadow-[0_0_30px_-12px_rgba(168,85,247,0.55)]",
    gradient: "from-purple-950 via-slate-950 to-black",
    border: "border-purple-500/30",
    softBorder: "border-purple-500/20",
    softBg: "bg-purple-500/10",
    pill: "text-purple-200 border-purple-500/40 bg-purple-500/10",
  },
  ice: {
    accent: "text-cyan-300",
    accentStrong: "text-cyan-400",
    bar: "bg-cyan-500",
    glow: "shadow-[0_0_30px_-12px_rgba(34,211,238,0.5)]",
    gradient: "from-cyan-950 via-slate-950 to-black",
    border: "border-cyan-500/30",
    softBorder: "border-cyan-500/20",
    softBg: "bg-cyan-500/10",
    pill: "text-cyan-200 border-cyan-500/40 bg-cyan-500/10",
  },
  flame: {
    accent: "text-orange-300",
    accentStrong: "text-orange-400",
    bar: "bg-orange-500",
    glow: "shadow-[0_0_30px_-12px_rgba(249,115,22,0.5)]",
    gradient: "from-orange-950 via-slate-950 to-black",
    border: "border-orange-500/30",
    softBorder: "border-orange-500/20",
    softBg: "bg-orange-500/10",
    pill: "text-orange-200 border-orange-500/40 bg-orange-500/10",
  },
  physical: {
    accent: "text-yellow-300",
    accentStrong: "text-yellow-400",
    bar: "bg-yellow-500",
    glow: "shadow-[0_0_30px_-12px_rgba(250,204,21,0.45)]",
    gradient: "from-yellow-950 via-slate-950 to-black",
    border: "border-yellow-500/30",
    softBorder: "border-yellow-500/20",
    softBg: "bg-yellow-500/10",
    pill: "text-yellow-200 border-yellow-500/40 bg-yellow-500/10",
  },
  altered: {
    accent: "text-emerald-300",
    accentStrong: "text-emerald-400",
    bar: "bg-emerald-500",
    glow: "shadow-[0_0_30px_-12px_rgba(74,222,128,0.45)]",
    gradient: "from-emerald-950 via-slate-950 to-black",
    border: "border-emerald-500/30",
    softBorder: "border-emerald-500/20",
    softBg: "bg-emerald-500/10",
    pill: "text-emerald-200 border-emerald-500/40 bg-emerald-500/10",
  },
};

const getTheme = (element) => {
  const key = element ? element.split("-")[0].toLowerCase() : "altered";
  return ELEMENT_THEMES[key] || ELEMENT_THEMES.altered;
};

function FormatDescription({ text }) {
  if (!text) return null;

  const regex = /(\[.*?\]|Volt|Frost|Ice|Flame|Physical|\d+(?:\.\d+)?%?)/gi;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return (
        <span key={index} className="font-bold tracking-wide text-yellow-300">
          {part.slice(1, -1)}
        </span>
      );
    }

    if (/^\d+(?:\.\d+)?%?$/.test(part)) {
      return (
        <span key={index} className="font-mono font-bold text-blue-400">
          {part}
        </span>
      );
    }

    switch (part.toLowerCase()) {
      case "volt":
        return <span key={index} className="font-bold uppercase text-purple-400">Volt</span>;
      case "frost":
      case "ice":
        return <span key={index} className="font-bold uppercase text-cyan-400">{part}</span>;
      case "flame":
        return <span key={index} className="font-bold uppercase text-orange-400">Flame</span>;
      case "physical":
        return <span key={index} className="font-bold uppercase text-yellow-400">Physical</span>;
      default:
        return part;
    }
  });
}

function SectionAnchor({ href, label, accentClass }) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-gray-200 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
    >
      <span>{label}</span>
      <ArrowDownRight
        size={14}
        className={`transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 ${accentClass}`}
      />
    </a>
  );
}

function TraitCard({ title, description, accentClass, borderClass }) {
  return (
    <div className={`rounded-2xl border bg-[#11131d]/90 p-6 ${borderClass}`}>
      <p className={`mb-2 text-[11px] font-bold uppercase tracking-[0.18em] ${accentClass}`}>
        {title}
      </p>
      <p className="text-sm leading-relaxed whitespace-pre-line text-gray-300">
        <FormatDescription text={description} />
      </p>
    </div>
  );
}

function SectionTitle({ title, accentBarClass }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
      <span className={`h-8 w-1 rounded-full ${accentBarClass}`} />
      {title}
    </h2>
  );
}

function CombatSection({ title, items, icon, toneClass, iconBoxClass }) {
  if (!items?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className={`flex items-center gap-3 text-lg font-bold uppercase tracking-[0.18em] ${toneClass}`}>
        <span className={`rounded-lg border p-2 ${iconBoxClass}`}>{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/7 bg-[#11131d]/90 p-5 transition-colors duration-300 hover:border-white/15"
          >
            <h4 className="mb-3 text-base font-bold text-gray-100">{item.title}</h4>
            <p className="border-l-2 border-white/10 pl-4 text-sm leading-relaxed whitespace-pre-line text-gray-400">
              <FormatDescription text={item.description} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixCard({ pieces, description }) {
  return (
    <div className="rounded-2xl border border-yellow-500/15 bg-[#11131d]/90 p-5 transition-colors duration-300 hover:border-yellow-500/30">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">
        {pieces}-Piece Set
      </span>
      <p className="text-sm leading-relaxed whitespace-pre-line text-gray-300">
        <FormatDescription text={description} />
      </p>
    </div>
  );
}

function AdvancementItem({ index, description }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-orange-500/15 bg-[#11131d]/90 p-6 transition-colors duration-300 hover:border-orange-500/35">
      <div className="absolute right-0 top-0 h-28 w-28 translate-x-1/3 -translate-y-1/3 rounded-full bg-orange-500/7 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4 sm:w-44 sm:flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <Star size={18} fill="currentColor" />
          </div>
          <div>
            <p className="text-xl font-black uppercase italic tracking-wide text-white">
              {index + 1} Star
            </p>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
              Active
            </span>
          </div>
        </div>
        <div className="flex-1 border-l-0 pl-0 text-sm leading-relaxed text-gray-300 sm:border-l sm:border-white/10 sm:pl-6">
          <FormatDescription text={description} />
        </div>
      </div>
    </div>
  );
}

// En el mismo archivo, junto a TraitCard, CombatSection, etc.

function MoveCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.description?.length > 180;

  return (
    <div className="rounded-2xl border border-white/7 bg-[#11131d]/90 overflow-hidden transition-colors duration-200 hover:border-white/15">
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={() => isLong && setExpanded((v) => !v)}
        style={{ cursor: isLong ? "pointer" : "default" }}
      >
        <h4 className="text-sm font-bold text-gray-100">{item.title}</h4>
        {isLong && (
          <span
            className="flex-shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600 transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        )}
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: expanded || !isLong ? "600px" : "0px" }}
      >
        <p className="border-t border-white/5 px-5 pb-5 pt-4 text-sm leading-relaxed text-gray-400 whitespace-pre-line">
          <FormatDescription text={item.description} />
        </p>
      </div>
    </div>
  );
}

function MovesetSection({ char }) {
  const [activeTab, setActiveTab] = useState("attacks");

  const CATEGORIES = [
    { id: "attacks",    label: "Normal",    icon: <Sword size={14} />,    color: "text-blue-400",   activeBorder: "border-blue-400",   activeBg: "bg-blue-500/10" },
    { id: "dodges",     label: "Dodge",     icon: <Wind size={14} />,     color: "text-green-400",  activeBorder: "border-green-400",  activeBg: "bg-green-500/10" },
    { id: "skills",     label: "Skills",    icon: <Zap size={14} />,      color: "text-orange-400", activeBorder: "border-orange-400", activeBg: "bg-orange-500/10" },
    { id: "discharges", label: "Discharge", icon: <Activity size={14} />, color: "text-purple-400", activeBorder: "border-purple-400", activeBg: "bg-purple-500/10" },
  ];

  const active = CATEGORIES.find((c) => c.id === activeTab);
  const items = char[activeTab] || [];

  return (
    <section id="skills" className="scroll-mt-28">
      <SectionTitle title="Moveset & Skills" accentBarClass="bg-red-500" />

      <div className="mb-6 flex gap-1 rounded-xl border border-white/8 bg-[#0c0e18]/80 p-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          const count = char[cat.id]?.length ?? 0;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`
                relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5
                text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200
                ${isActive
                  ? `${cat.color} ${cat.activeBg} border ${cat.activeBorder}/40`
                  : "text-gray-600 hover:text-gray-300 border border-transparent"
                }
              `}
            >
              {cat.icon}
              <span className="hidden sm:inline">{cat.label}</span>
              {count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${isActive ? `${cat.activeBg} ${cat.color}` : "bg-white/5 text-gray-600"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className={`${active.color} ${active.activeBg} rounded-lg border border-current/20 p-2`}>
          {active.icon}
        </span>
        <h3 className={`text-base font-bold uppercase tracking-[0.18em] ${active.color}`}>
          {active.label}
        </h3>
        <span className="text-xs text-gray-600">
          {items.length} {items.length === 1 ? "move" : "moves"}
        </span>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <MoveCard key={index} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-gray-600">No moves registered for this category.</p>
      )}
    </section>
  );
}

export default function SimulacrumPage({ char }) {
  const theme = getTheme(char.element);

  return (
    <main className="min-h-screen bg-[#08090f] text-gray-100 selection:bg-cyan-400 selection:text-black">
      <section className="relative overflow-hidden border-b border-white/8 min-h-[100svh] lg:min-h-[90vh]">
  {/* Fondo degradado del elemento */}
  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-80`} />

  {/* Imagen del personaje — derecha, fade hacia la izquierda */}
  {char.images?.character && (
    <div className="absolute inset-0 z-0">
      <img
        src={char.images.character}
        alt={char.simulacrumName}
        className="absolute bottom-0 right-0 h-full w-auto max-w-[65%] object-contain object-bottom opacity-60 lg:opacity-70 transition-transform duration-700 hover:scale-[1.02]"
      />
      {/* Fade izquierda */}
      <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#08090f] via-[#08090f]/80 to-transparent pointer-events-none" />
      {/* Fade abajo */}
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#08090f] to-transparent pointer-events-none" />
      {/* Fade arriba */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#08090f]/60 to-transparent pointer-events-none" />
    </div>
  )}

  {/* Contenido */}
  <div className="relative z-10 mx-auto flex min-h-[100svh] lg:min-h-[90vh] max-w-7xl flex-col justify-end px-6 pb-14 pt-28 md:px-10 lg:px-12 lg:justify-center lg:pb-20 lg:pt-32">
    <div className="max-w-xl">

      {/* Breadcrumb */}
      <Link
        href="/simulacra"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-white mb-8"
      >
        ← Simulacra Archive
      </Link>

      {/* Pills: elemento + resonancia */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${theme.pill}`}>
          {char.element || "Unknown Element"}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-300">
          {char.resonance || "Unknown Resonance"}
        </span>
      </div>

      {/* Nombre */}
      <h1 className="text-6xl font-black uppercase italic tracking-tight text-white md:text-7xl xl:text-8xl leading-none mb-3">
        {char.simulacrumName}
      </h1>

      {/* Arma */}
      <p className={`text-sm font-bold uppercase tracking-[0.2em] mb-6 ${theme.accent}`}>
        {char.weaponName}
      </p>

      {/* Descripción */}
      {char.description && (
        <p className="text-sm leading-relaxed text-gray-400 max-w-md mb-10 md:text-base">
          {char.description}
        </p>
      )}

      {/* Stats: Shatter + Charge */}
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl border bg-black/30 backdrop-blur-sm px-5 py-4 ${theme.softBorder}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 mb-1">Shatter</p>
          <p className="font-mono text-2xl font-bold text-yellow-400">
            {Number(char.shatter || 0).toFixed(2)}
          </p>
        </div>
        <div className={`rounded-2xl border bg-black/30 backdrop-blur-sm px-5 py-4 ${theme.softBorder}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 mb-1">Charge</p>
          <p className={`font-mono text-2xl font-bold ${theme.accentStrong}`}>
            {Number(char.charge || 0).toFixed(2)}
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

      <section className="relative">
        {char.images?.character && (
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] overflow-hidden xl:block" aria-hidden="true">
            <img
              src={char.images.character}
              alt=""
              className="absolute bottom-0 right-0 h-full w-full object-cover object-top"
              style={{
                opacity: 0.05,
                maskImage: "linear-gradient(to left, black 0%, transparent 78%)",
                WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 78%)",
              }}
            />
          </div>
        )}

        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 md:px-10 lg:flex-row lg:items-start lg:px-12 lg:py-14">
          <aside className="top-24 lg:sticky lg:w-64 lg:flex-shrink-0">
  <SectionIndex theme={theme} />
</aside>

          <div className="relative z-10 min-w-0 flex-1 space-y-14">
            <section id="trait" className="scroll-mt-28">
              <SectionTitle title="Simulacrum Trait" accentBarClass={theme.bar} />
              <TraitCard
                title={char.trait?.title || "Trait"}
                description={char.trait?.description || "No trait description available."}
                accentClass={theme.accentStrong}
                borderClass={theme.border}
              />
            </section>

            <section id="weapon" className="scroll-mt-28">
              <SectionTitle title="Weapon Mechanics" accentBarClass="bg-cyan-500" />

              {char.images?.weapon && (
                <div className="mb-8 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black p-4">
                  <img
                    src={char.images.weapon}
                    alt={char.weaponName}
                    className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              <div className="space-y-4">
                {char.passives?.length ? (
                  char.passives.map((passive, index) => (
                    <TraitCard
                      key={index}
                      title={passive.title}
                      description={passive.description}
                      accentClass="text-cyan-400"
                      borderClass="border-cyan-500/20"
                    />
                  ))
                ) : (
                  <p className="text-sm italic text-gray-500">No passive entries registered.</p>
                )}
              </div>
            </section>

            <MovesetSection char={char} />

            <section id="matrices" className="scroll-mt-28">
              <SectionTitle title="Recommended Matrices" accentBarClass="bg-yellow-500" />
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  {char.images?.matrix ? (
                    <div className="aspect-square overflow-hidden rounded-2xl border border-yellow-500/20 bg-[#11131d]/90">
                      <img
                        src={char.images.matrix}
                        alt="Matrix"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#11131d]/90 text-xs font-mono uppercase tracking-[0.2em] text-gray-600">
                      No Image
                    </div>
                  )}
                </div>

                <div className="space-y-4 md:col-span-2">
                  <MatrixCard pieces={2} description={char.matrices?.pc2 || "No description"} />
                  <MatrixCard pieces={4} description={char.matrices?.pc4 || "No description"} />
                </div>
              </div>
            </section>

            <section id="advancements" className="scroll-mt-28 pb-8">
              <SectionTitle title="Advancements" accentBarClass="bg-orange-500" />
              <div className="space-y-4">
                {char.advancements?.some(Boolean) ? (
                  char.advancements.map((desc, index) =>
                    desc ? <AdvancementItem key={index} index={index} description={desc} /> : null
                  )
                ) : (
                  <p className="text-sm italic text-gray-500">No advancements registered.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
