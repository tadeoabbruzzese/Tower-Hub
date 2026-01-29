// src/lib/formHelpers.js

export const parseCharacterJson = (jsonString, defaultState) => {
  try {
    if (!jsonString) return null;
    
    const parsedData = JSON.parse(jsonString);

    // Verificación básica
    if (typeof parsedData !== 'object' || parsedData === null) {
      throw new Error("El formato no es un objeto válido.");
    }

    // Retornamos la fusión: Estado Base + Datos Nuevos
    // Esto asegura que si el JSON no trae 'attacks', no rompa la UI
    return { 
      ...defaultState, 
      ...parsedData,
      // Aseguramos fusionar objetos anidados también para no perder propiedades
      trait: { ...defaultState.trait, ...(parsedData.trait || {}) },
      images: { ...defaultState.images, ...(parsedData.images || {}) },
      matrices: { ...defaultState.matrices, ...(parsedData.matrices || {}) },
    };

  } catch (error) {
    console.error("JSON Import Error:", error);
    alert("Error al importar: El JSON está mal formado o tiene errores de sintaxis.");
    return null;
  }
};