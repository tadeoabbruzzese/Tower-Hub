"use client"

import { useState } from "react"
import ImageUpload from "@/components/ImageKit/ImageUpload" // Asegúrate que la ruta sea correcta
import { Twitter, Calendar, Link as LinkIcon, Image as ImageIcon } from "lucide-react"

export default function NewsForm({ initialData = {}, onSave }) {
  const [form, setForm] = useState({
    content: "",
    link: "",
    date: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    image: "", // Opcional
    ...initialData,
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="card p-8 space-y-6 max-w-3xl bg-[#0b0c15] border border-gray-800">
      
      {/* Header Visual */}
      <div className="flex items-center gap-3 mb-4 text-[#1DA1F2]">
        <Twitter size={24} fill="currentColor"/>
        <h2 className="text-lg font-bold uppercase tracking-widest">Nueva Transmisión</h2>
      </div>

      {/* 1. CONTENIDO DEL TWEET */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Contenido del Tweet</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Escribe el texto de la noticia aquí... (Ej: ¡La versión 4.5 ya está disponible!)"
          rows={4}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white resize-none focus:border-[#1DA1F2] outline-none transition-colors"
        />
        <p className="text-xs text-gray-600 text-right">{form.content.length} caracteres</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2. FECHA Y LINK */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
              <Calendar size={14} /> Fecha Publicación
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[#1DA1F2] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
              <LinkIcon size={14} /> Link al Tweet Original
            </label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://twitter.com/ToF_EN_Official/status/..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-[#1DA1F2] underline decoration-dotted focus:border-[#1DA1F2] outline-none"
            />
          </div>
        </div>

        {/* 3. IMAGEN OPCIONAL */}
        <div className="space-y-2">
           <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
              <ImageIcon size={14} /> Media Adjunto (Opcional)
           </label>
           <div className="h-full">
             <ImageUpload 
                label="" // Sin label interna para ahorrar espacio
                value={form.image}
                onChange={(url) => setForm({...form, image: url})}
                folderPath="/news"
             />
           </div>
        </div>

      </div>

      <button
        onClick={() => onSave(form)}
        className="w-full py-4 mt-4 bg-[#1DA1F2] hover:bg-[#1a91da] text-white rounded-xl font-bold shadow-lg shadow-[#1DA1F2]/20 transition-all flex items-center justify-center gap-2"
      >
        <Twitter size={18} fill="currentColor" className="text-white/20"/>
        Publicar Noticia
      </button>

    </div>
  )
}