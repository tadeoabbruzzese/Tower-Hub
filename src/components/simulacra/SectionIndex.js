"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "trait",        label: "Trait" },
  { id: "weapon",       label: "Weapon" },
  { id: "skills",       label: "Moveset" },
  { id: "matrices",     label: "Matrices" },
  { id: "advancements", label: "Advancements" },
];

export function SectionIndex({ theme }) {
  const [active, setActive] = useState("trait");

  useEffect(() => {
    const observers = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-[#0f121b]/90 p-3 backdrop-blur-sm">
      <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">
        On this page
      </p>
      <nav className="space-y-0.5">
        {SECTIONS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`
                group relative w-full flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-bold uppercase tracking-[0.15em]
                transition-all duration-200
                ${isActive
                  ? `${theme.softBg} ${theme.accentStrong} border-l-2 pl-[10px]`
                  : "text-gray-500 border-l-2 border-transparent pl-[10px] hover:text-gray-200 hover:bg-white/[0.04]"
                }
              `}
              style={isActive ? { borderLeftColor: "currentColor" } : {}}
            >
              {/* Dot indicator */}
              <span
                className={`
                  h-1.5 w-1.5 rounded-full flex-shrink-0 transition-all duration-200
                  ${isActive ? `${theme.bar} scale-125` : "bg-gray-700 group-hover:bg-gray-500"}
                `}
              />
              {label}

              {/* Progress line activa — opcional decorativo */}
              {isActive && (
                <span className={`ml-auto h-px w-4 rounded-full opacity-60 ${theme.bar}`} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}