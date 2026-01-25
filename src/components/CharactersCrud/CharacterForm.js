"use client"

import { useState } from "react"
import ImageUpload from "@/components/ImageKit/ImageUpload"
// --- COMPONENTES AUXILIARES ---

// Componente para listas dinámicas (Pasivas) - Igual que antes
const DynamicList = ({ label, items, onItemChange, onAddItem, onRemoveItem }) => (
  <div className="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-cyan-400">{label}</h3>
      <button 
        type="button"
        onClick={onAddItem}
        className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-500 rounded text-white transition-colors"
      >
        + Agregar
      </button>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
          <div className="flex-1 space-y-2">
            <input
              placeholder="Nombre de la Pasiva"
              value={item.title}
              onChange={(e) => onItemChange(index, "title", e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-700 text-white focus:border-cyan-500 outline-none"
            />
            <textarea
              placeholder="Descripción del efecto..."
              value={item.description}
              onChange={(e) => onItemChange(index, "description", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-700 text-white resize-y focus:border-cyan-500 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemoveItem(index)}
            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)



// --- FORMULARIO PRINCIPAL ---

export default function ToFCharacterForm({ initialData = {}, onSave }) {
  const [form, setForm] = useState({
    simulacrumName: "",    // Nombre del personaje (Ej: Roslyn)
    weaponName: "",        // Nombre del arma (Ej: Calm Waters)
    rarity: "SSR",
    releaseDate: "",
    description: "",
    
    // Datos de Combate
    element: "Ice-Volt",   // Elemento (Simple o Dual)
    resonance: "Attack",   // DPS, Tanque, Sacramento
    shatter: 0.00,         // Romper
    charge: 0.00,          // Carga
    
    // Rasgo del Simulacrum
    trait: { title: "", description: "" },
    
    // URLs de Imágenes
    images: {
      character: "",
      weapon: "",
      matrix: ""
    },

    // Datos Dinámicos
    scaling: "ATK_HP_CRIT",
    passives: [], 
    advancements: Array(6).fill(""),
    matrices: { pc2: "", pc4: "" },
    ...initialData,
  })

  // Helpers de estado
  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleNestedChange = (parent, key, value) => {
    setForm(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }))
  }

  // Lógica de Pasivas
  const handlePassiveChange = (index, field, value) => {
    const newPassives = [...form.passives]
    newPassives[index] = { ...newPassives[index], [field]: value }
    setForm(prev => ({ ...prev, passives: newPassives }))
  }

  // Lógica de Avances (A1 - A6)
  const handleAdvancementChange = (index, value) => {
    const newAdvancements = [...form.advancements]
    newAdvancements[index] = value
    setForm(prev => ({ ...prev, advancements: newAdvancements }))
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-[#0b0c15] text-gray-100 min-h-screen font-sans">
      
      <header className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Base de Datos: Simulacrum
        </h1>
      </header>

     {/* 1. IDENTIDAD, RAREZA Y FECHA */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Nombre Simulacrum */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Simulacrum</label>
          <input
            value={form.simulacrumName}
            onChange={(e) => handleChange("simulacrumName", e.target.value)}
            placeholder="Ej: Roslyn"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-cyan-500 outline-none"
          />
        </div>

        {/* Nombre Arma */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Arma</label>
          <input
            value={form.weaponName}
            onChange={(e) => handleChange("weaponName", e.target.value)}
            placeholder="Ej: Calm Waters"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-cyan-500 outline-none"
          />
        </div>

        {/* Rareza */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Rareza</label>
          <select 
            value={form.rarity} 
            onChange={(e) => handleChange("rarity", e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-purple-500 outline-none"
          >
            <option value="SSR">SSR</option>
            <option value="SR">SR</option>
            <option value="R">R</option>
          </select>
        </div>

        {/* NUEVO: Fecha de Lanzamiento */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Lanzamiento (Global)</label>
          <input
            type="date"
            value={form.releaseDate}
            onChange={(e) => handleChange("releaseDate", e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-cyan-500 outline-none text-gray-300" // text-gray-300 para que se vea bien el calendario
          />
        </div>

{/* NUEVO: Descripción para Home/Hero (Ocupa todo el ancho) */}
        <div className="col-span-full space-y-1 pt-2">
          <label className="text-xs font-bold text-cyan-400 uppercase flex justify-between">
            <span>Descripción (Para Hero Section)</span>
            <span className="text-gray-600 normal-case font-normal text-[10px]">Breve resumen de lore o identidad</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Ej: La oficial a cargo de la seguridad de Mirroria. Una experta espadachina que valora el deber por encima de todo..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded focus:border-cyan-500 outline-none resize-none"
          />
        </div>
      </section>

      {/* 2. DATOS DE COMBATE (Elementos y Resonancia) */}
      <section className="bg-gray-800/20 p-5 rounded-xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Selector de Elementos */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Elemento</label>
          <select 
            value={form.element} 
            onChange={(e) => handleChange("element", e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-cyan-500 outline-none"
          >
            <optgroup label="Clásicos">
              <option value="Volt">Volt (Electro)</option>
              <option value="Ice">Ice (Hielo)</option>
              <option value="Flame">Flame (Fuego)</option>
              <option value="Physical">Physical (Físico)</option>
              <option value="Altered">Altered (Alterado)</option>
            </optgroup>
            <optgroup label="Duales (Nuevos)">
              <option value="Volt-Ice">Volt - Ice (Electro Predominante)</option>
              <option value="Ice-Volt">Ice - Volt (Hielo Predominante)</option>
              <option value="Flame-Physical">Flame - Phys (Fuego Predominante)</option>
              <option value="Physical-Flame">Phys - Flame (Físico Predominante)</option>
              {/* Agrega más combinaciones según salgan */}
            </optgroup>
          </select>
        </div>

        {/* Resonancia */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Resonancia</label>
          <select 
            value={form.resonance} 
            onChange={(e) => handleChange("resonance", e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-cyan-500 outline-none"
          >
            <option value="Attack">DPS (Ataque)</option>
            <option value="Fortitude">Tank (Fortaleza)</option>
            <option value="Benediction">Sacramento (Bendición)</option>
          </select>
        </div>

{/* NUEVO: Selector de Escalado */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Escalado (Stats)</label>
          <select 
            value={form.scaling} 
            onChange={(e) => handleChange("scaling", e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded focus:border-cyan-500 outline-none"
          >
            <option value="ATK_HP_CRIT">ATK / HP / CRIT (Standard)</option>
            <option value="ATK_HP_RES">ATK / HP / RESIST (Tank/Variant)</option>
            {/* Si aparece alguna rara en el futuro como ATK/HP/HP, la agregas aquí */}
          </select>
        </div>
        {/* Shatter & Charge */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Shatter (Romper)</label>
          <input
            type="number"
            step="0.01"
            value={form.shatter}
            onChange={(e) => handleChange("shatter", parseFloat(e.target.value))}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded font-mono text-yellow-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Charge (Carga)</label>
          <input
            type="number"
            step="0.01"
            value={form.charge}
            onChange={(e) => handleChange("charge", parseFloat(e.target.value))}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded font-mono text-blue-400"
          />
        </div>
      </section>

      {/* 3. IMÁGENES (Placeholder Area) */}
      {/* 3. IMÁGENES (ImageKit Integration) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ImageUpload
          label="Foto del Simulacrum"
          value={form.images.character}
          onChange={(url) => handleNestedChange("images", "character", url)}
          folderPath="/tof/characters"
        />
        
        <ImageUpload
          label="Foto del Arma"
          value={form.images.weapon}
          onChange={(url) => handleNestedChange("images", "weapon", url)}
          folderPath="/tof/weapons"
        />
        
        <ImageUpload
          label="Foto de Matrices"
          value={form.images.matrix}
          onChange={(url) => handleNestedChange("images", "matrix", url)}
          folderPath="/tof/matrices"
        />
      </section>

      {/* 4. SIMULACRUM TRAIT */}
      <section className="bg-gray-800/30 p-5 rounded-xl border border-gray-700">
        <h3 className="text-lg font-bold text-purple-400 mb-4">Simulacrum Trait (Rasgo)</h3>
        <div className="space-y-3">
          <input
            placeholder="Título del rasgo (Ej: Watcher)"
            value={form.trait.title}
            onChange={(e) => handleNestedChange("trait", "title", e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white font-bold"
          />
          <textarea
            placeholder="Descripción del buff (1200 / 4000 points)..."
            value={form.trait.description}
            onChange={(e) => handleNestedChange("trait", "description", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white resize-y"
          />
        </div>
      </section>
      {/* NUEVA SECCIÓN: MATRICES (2pc & 4pc) */}
      <section className="bg-gray-800/30 p-5 rounded-xl border border-gray-700">
        <h3 className="text-lg font-bold text-yellow-500 mb-4">Efectos de Matrices (Matrix Set)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Efecto 2 Piezas */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase">Efecto 2 Piezas</label>
              <span className="text-xs text-gray-600">2-set</span>
            </div>
            <textarea
              placeholder="Descripción del efecto al equipar 2 matrices..."
              value={form.matrices.pc2}
              onChange={(e) => handleNestedChange("matrices", "pc2", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-gray-200 resize-none focus:border-yellow-500/50 outline-none"
            />
          </div>

          {/* Efecto 4 Piezas */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase">Efecto 4 Piezas</label>
              <span className="text-xs text-gray-600">4-set</span>
            </div>
            <textarea
              placeholder="Descripción del efecto al equipar 4 matrices..."
              value={form.matrices.pc4}
              onChange={(e) => handleNestedChange("matrices", "pc4", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-gray-200 resize-none focus:border-yellow-500/50 outline-none"
            />
          </div>
        </div>
      </section>

      {/* 6. AVANCES (A1 - A6) */}
      <section className="bg-gray-800/30 p-5 rounded-xl border border-gray-700">
        <h3 className="text-lg font-bold text-orange-400 mb-4">Avances de Arma (Advancements)</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {form.advancements.map((desc, i) => (
            <div key={i} className="flex gap-4 group">
              {/* Etiqueta de la estrella (A1, A2...) */}
              <div className="flex flex-col items-center justify-start pt-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 border border-orange-500/50 text-orange-500 font-bold font-mono text-sm group-hover:bg-orange-500 group-hover:text-black transition-colors">
                  A{i + 1}
                </span>
              </div>
              
              {/* Input del efecto */}
              <textarea
                value={desc}
                onChange={(e) => handleAdvancementChange(i, e.target.value)}
                placeholder={`Descripción del efecto al desbloquear ${i + 1} estrella(s)...`}
                rows={2}
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded text-gray-200 resize-y focus:border-orange-500 outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. PASIVAS (Dinámicas) */}
      <DynamicList 
        label="Pasivas de Arma" 
        items={form.passives} 
        onItemChange={handlePassiveChange}
        onAddItem={() => setForm(prev => ({...prev, passives: [...prev.passives, {title: "", description: ""}]}))}
        onRemoveItem={(idx) => setForm(prev => ({...prev, passives: prev.passives.filter((_, i) => i !== idx)}))}
      />

      {/* BOTÓN DE GUARDADO */}
      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={() => onSave(form)}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.01]"
        >
          Guardar Simulacrum en Firebase
        </button>
      </div>

      {/* DEBUG PREVIEW (Para que veas como queda el JSON) */}
      <details className="text-xs font-mono text-gray-500 bg-black p-4 rounded">
        <summary className="cursor-pointer mb-2">Ver JSON resultante</summary>
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </details>
    </div>
  )
}