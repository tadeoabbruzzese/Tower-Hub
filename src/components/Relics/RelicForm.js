"use client"

import { useState } from "react"
import ImageUpload from "@/components/ImageKit/ImageUpload"
import { FileJson, Copy, Check } from "lucide-react"

// Función auxiliar para parsear JSON (puedes moverla a lib si quieres reusarla)
const parseRelicJson = (jsonString, defaultState) => {
  try {
    if (!jsonString) return null;
    const parsedData = JSON.parse(jsonString);
    if (typeof parsedData !== 'object' || parsedData === null) throw new Error("JSON inválido");
    return { ...defaultState, ...parsedData };
  } catch (error) {
    console.error("JSON Error:", error);
    alert("JSON inválido");
    return null;
  }
};

export default function RelicForm({ initialData = {}, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    rarity: "SSR", // SSR o SR
    image: "",
    advancements: Array(5).fill(""), // 5 estrellas
    ...initialData,
  })

  // Estados para JSON Helper
  const [jsonInput, setJsonInput] = useState("");
  const [copied, setCopied] = useState(false);

  // --- HANDLERS ---
  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAdvancementChange = (index, value) => {
    const newAdvancements = [...form.advancements]
    newAdvancements[index] = value
    setForm(prev => ({ ...prev, advancements: newAdvancements }))
  }

  // JSON Import
  const handleJsonImport = () => {
    const newData = parseRelicJson(jsonInput, form);
    if (newData) {
      setForm(newData);
      setJsonInput("");
      alert("¡Datos cargados!");
    }
  }

  // JSON Export
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(form, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-[#0b0c15] text-gray-100 min-h-screen font-sans border border-gray-800 rounded-xl">
      
      <header className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Base de Datos: Reliquia
        </h1>
      </header>

      {/* --- ZONA JSON IMPORT --- */}
      <details className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden mb-8">
        <summary className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-800 transition-colors text-yellow-500 font-bold uppercase tracking-wider text-xs">
          <FileJson size={16} /> Importar desde JSON
        </summary>
        <div className="p-4 space-y-3 border-t border-gray-800">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{ "name": "Omnium Shield", ... }'
            rows={5}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-green-400 font-mono text-xs resize-y focus:border-yellow-500 outline-none"
          />
          <button
            type="button"
            onClick={handleJsonImport}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase rounded border border-gray-600"
          >
            Cargar Datos
          </button>
        </div>
      </details>

      {/* 1. INFORMACIÓN BÁSICA */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-800/10 p-4 rounded-xl border border-white/5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Nombre Reliquia</label>
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Omnium Shield"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-yellow-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Rareza</label>
          <select 
            value={form.rarity} 
            onChange={(e) => handleChange("rarity", e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-yellow-500 outline-none"
          >
            <option value="SSR">SSR</option>
            <option value="SR">SR</option>
          </select>
        </div>

        <div className="col-span-full space-y-1 pt-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Descripción General</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descripción base de la reliquia..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded focus:border-yellow-500 outline-none resize-none"
          />
        </div>
      </section>

      {/* 2. IMAGEN */}
      <section>
        <ImageUpload 
          label="Icono de la Reliquia" 
          value={form.image} 
          onChange={(url) => handleChange("image", url)} 
          folderPath="/tof/relics" 
        />
      </section>

      {/* 3. AVANCES (5 ESTRELLAS) */}
      <section className="bg-gray-800/30 p-5 rounded-xl border border-gray-700">
        <h3 className="text-lg font-bold text-orange-400 mb-4">Avances (Stars)</h3>
        <div className="grid grid-cols-1 gap-4">
          {form.advancements.map((desc, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="flex flex-col items-center justify-start pt-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 border border-orange-500/50 text-orange-500 font-bold font-mono text-sm">
                  {i + 1}★
                </span>
              </div>
              <textarea
                value={desc}
                onChange={(e) => handleAdvancementChange(i, e.target.value)}
                placeholder={`Efecto de ${i + 1} estrella(s)...`}
                rows={2}
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded text-gray-200 resize-y focus:border-orange-500 outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* BOTÓN DE GUARDADO */}
      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={() => onSave(form)}
          className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-xl font-bold text-white shadow-lg shadow-orange-900/20 transition-all"
        >
          Guardar Reliquia
        </button>
      </div>

      {/* --- DEBUG & EXPORT --- */}
      <details className="group border border-gray-800 rounded-xl overflow-hidden bg-black mt-8">
        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-900 transition-colors">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 group-open:text-yellow-500">
            <FileJson size={16} /> Ver / Exportar JSON
          </span>
        </summary>
        <div className="relative bg-[#050505] p-6 border-t border-gray-800">
          <button
            onClick={handleCopyJson}
            className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${copied ? "bg-green-500/10 border-green-500 text-green-500" : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"}`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado!" : "Copiar JSON"}
          </button>
          <pre className="text-xs font-mono text-green-400/80 overflow-x-auto whitespace-pre-wrap max-h-96 pr-28">
            {JSON.stringify(form, null, 2)}
          </pre>
        </div>
      </details>

    </div>
  )
}