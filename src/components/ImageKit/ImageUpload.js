"use client"

import { IKContext, IKUpload } from "imagekitio-react"
import { useState } from "react"

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  folderPath = "/tof-uploads" 
}) {
  const [isUploading, setIsUploading] = useState(false)

  // Función de autenticación que llama a tu API Route (la que creamos antes)
  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/imagekit")
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Authentication error:", error)
      throw error
    }
  }

  // Manejo de error en la subida
  const onError = (err) => {
    console.error("Error al subir imagen:", err)
    setIsUploading(false)
    alert("Hubo un error al subir la imagen. Revisa la consola.")
  }

  // Manejo de éxito
  const onSuccess = (res) => {
    console.log("Subida exitosa:", res)
    setIsUploading(false)
    onChange(res.url) // Aquí le pasamos la URL al formulario padre
  }

  // Inicio de la subida (para efectos visuales)
  const onUploadStart = () => {
    setIsUploading(true)
  }

  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">
          {label}
        </label>

        <div 
          className={`
            relative border-2 border-dashed rounded-lg p-4 transition-all
            bg-gray-900/50 flex flex-col items-center justify-center text-center min-h-[160px]
            ${value ? 'border-cyan-500/50' : 'border-gray-700 hover:border-gray-500'}
            ${isUploading ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          {/* CASO 1: Cargando */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 rounded-lg">
              <span className="text-cyan-400 font-bold animate-pulse">Subiendo...</span>
            </div>
          )}

          {/* CASO 2: Ya hay imagen (Mostrar Previsualización) */}
          {!isUploading && value ? (
            <div className="w-full relative group">
              <img 
                src={value} 
                alt="Preview" 
                className="h-32 w-full object-contain rounded mb-2" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                <button
                  type="button"
                  onClick={(e) => { 
                    e.preventDefault() 
                    onChange("") // Limpiar valor
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded shadow-lg"
                >
                  Eliminar Imagen
                </button>
              </div>
              <p className="text-[10px] text-gray-400 truncate w-full px-2">{value}</p>
            </div>
          ) : (
            
            // CASO 3: Input vacío (Mostrar botón de subida)
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="p-3 bg-gray-800 rounded-full">
                {/* Icono de Nube */}
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div className="relative">
                {/* El componente oficial de ImageKit */}
                <IKUpload
                  fileName="tof-asset.png"
                  useUniqueFileName={true}
                  folder={folderPath}
                  validateFile={(file) => file.size < 5000000} // Max 5MB opcional
                  onSuccess={onSuccess}
                  onError={onError}
                  onUploadStart={onUploadStart}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" // Truco: input invisible sobre el botón
                />
                <button className="px-4 py-2 bg-cyan-900/30 text-cyan-400 text-xs font-bold rounded border border-cyan-800 pointer-events-none">
                  Seleccionar Archivo
                </button>
              </div>
              
              <span className="text-[10px] text-gray-600">
                Sube a: {folderPath}
              </span>
            </div>
          )}
        </div>
      </div>
    </IKContext>
  )
}