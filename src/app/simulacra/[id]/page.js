import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Sword, Wind, Zap, Activity, Star, ArrowDownRight } from "lucide-react";

async function getCharacter(id) {
  const docRef = doc(db, "characters", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() };
}

const getElementColor = (element) => {
  const mainElement = element ? element.split("-")[0].toLowerCase() : "altered";

  const colors = {
    volt: "from-purple-900 via-purple-950 to-black text-purple-200 border-purple-500",
    ice: "from-cyan-900 via-cyan-950 to-black text-cyan-200 border-cyan-500",
    flame: "from-orange-900 via-orange-950 to-black text-orange-200 border-orange-500",
    physical: "from-yellow-900 via-yellow-950 to-black text-yellow-200 border-yellow-500",
    altered: "from-green-900 via-green-950 to-black text-green-200 border-green-500",
  };

  return colors[mainElement] || colors.altered;
};

const formatDescription = (text) => {
  if (!text) return null;

  const regex = /(\[.*?\]|Volt|Frost|Ice|Flame|Physical|\d+(?:\.\d+)?%?)/gi;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      const content = part.slice(1, -1);
      return (
        <span key={index} className="text-yellow-200 font-bold tracking-wide">
          {content}
        </span>
      );
    }

    if (/^\d+(?:\.\d+)?%?$/.test(part)) {
      return (
        <span key={index} className="text-blue-400 font-bold font-mono">
          {part}
        </span>
      );
    }

    switch (part.toLowerCase()) {
      case "volt":
        return <span key={index} className="text-purple-400 font-bold uppercase">Volt</span>;
      case "frost":
        return <span key={index} className="text-cyan-400 font-bold uppercase">Frost</span>;
      case "ice":
        return <span key={index} className="text-cyan-400 font-bold uppercase">Ice</span>;
      case "flame":
        return <span key={index} className="text-orange-400 font-bold uppercase">Flame</span>;
      case "physical":
        return <span key={index} className="text-yellow-400 font-bold uppercase">Physical</span>;
      default:
        return part;
    }
  });
};

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
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line border-l-2 border-gray-700 pl-4">
              {formatDescription(item.description)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnchorLink = ({ href, label }) => (
  <a
    href={href}
    className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-gray-200 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white"
  >
    <span>{label}</span>
    <ArrowDownRight size={14} className="text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
  </a>
);

export default async function SimulacrumPage({ params }) {
  const { id } = await params;
  const char = await getCharacter(id);

  if (!char) {
    notFound();
  }

  const themeClass = getElementColor(char.element);

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col lg:flex-row-reverse font-sans selection:bg-cyan-500 selection:text-black">
      <aside className="w-full lg:w-[45%] lg:h-screen lg:sticky lg:top-0 relative h-[50vh] overflow-hidden border-l border-white/10 order-first lg:order-last">
        <div className={`absolute inset-0 bg-gradient-to-b ${themeClass} opacity-40`} />
        {char.images.character ? (
          <img
            src={char.images.character}
            alt={char.simulacrumName}
            className="absolute inset-0 w-full h-full object-cover object-top lg:object-center mix-blend-lighten hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-700">No Image</div>
        )}
      </aside>

      <div className="flex-1 w-full lg:w-[55%] bg-[#0b0c15]">
        <div className="p-6 md:p-12 lg:p-16 space-y-16 max-w-4xl mx-auto">
          <header className="space-y-6">
            <Link
              href="/simulacra"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-cyan-400"
            >
              Back to Simulacra Archive
            </Link>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${themeClass.split(" ")[2]}`}>
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
              Weapon: <span className="text-white font-medium">{char.weaponName}</span>
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5">
                <span className="text-xs text-gray-500 uppercase font-bold">Shatter</span>
                <div className="text-2xl font-mono text-yellow-500">{Number(char.shatter).toFixed(2)}</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-white/5">
                <span className="text-xs text-gray-500 uppercase font-bold">Charge</span>
                <div className="text-2xl font-mono text-cyan-400">{Number(char.charge).toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <AnchorLink href="#skills" label="Skills" />
              <AnchorLink href="#matrices" label="Matrices" />
              <AnchorLink href="#advancements" label="Advancements" />
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-purple-500 rounded-full" />
              Simulacrum Trait
            </h2>
            <div className="bg-gradient-to-r from-gray-900 to-transparent p-6 rounded-xl border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-white mb-2">{char.trait?.title || "Trait"}</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {formatDescription(char.trait?.description || "No trait description available.")}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-cyan-500 rounded-full" />
              Weapon Mechanics
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
                      <span className="text-cyan-500 font-mono text-sm">0{i + 1}.</span>
                      <h3 className="text-lg font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                        {passive.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 pl-8 leading-relaxed border-l border-gray-800 ml-1.5 whitespace-pre-line">
                      {formatDescription(passive.description)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 italic">No passive entries registered.</p>
              )}
            </div>
          </section>

          <section id="skills" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-1 h-8 bg-red-500 rounded-full" />
              Moveset & Skills
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              </div>

              <div>
                <CombatSection
                  title="Skills"
                  items={char.skills}
                  color="orange"
                  icon={<Zap size={16} />}
                />
                <CombatSection
                  title="Discharge"
                  items={char.discharges}
                  color="purple"
                  icon={<Activity size={16} />}
                />
              </div>
            </div>
          </section>

          <section id="matrices" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-yellow-500 rounded-full" />
              Recommended Matrices
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
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
                  <span className="text-yellow-500 text-xs font-bold uppercase mb-2 block">2-Piece Set</span>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {formatDescription(char.matrices?.pc2) || "No description"}
                  </p>
                </div>
                <div className="bg-[#111] p-5 rounded-lg border border-gray-800 hover:border-yellow-500/30 transition-colors">
                  <span className="text-yellow-500 text-xs font-bold uppercase mb-2 block">4-Piece Set</span>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {formatDescription(char.matrices?.pc4) || "No description"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="advancements" className="pb-20 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-1 h-8 bg-orange-500 rounded-full" />
              Advancements
            </h2>

            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {char.advancements?.map((desc, i) =>
                desc ? (
                  <div key={i} className="group bg-[#111] border border-gray-800 hover:border-orange-500/40 p-6 rounded-xl transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="flex-shrink-0 flex items-center gap-4 sm:w-40">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform duration-500">
                          <Star size={20} fill="currentColor" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white italic uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                            {i + 1} Star
                          </h3>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Active</span>
                        </div>
                      </div>

                      <div className="flex-1 pl-6 border-l-2 border-gray-800 group-hover:border-orange-500/30 transition-colors">
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                          {formatDescription(desc)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
