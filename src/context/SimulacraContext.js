"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const SimulacraContext = createContext(null)

export function SimulacraProvider({ children }) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // Cache simple: si ya cargamos datos, no volver a pedir (opcional)
        const q = query(collection(db, "characters"), orderBy("releaseDate", "desc"))
        const querySnapshot = await getDocs(q)
        
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setCharacters(data)
      } catch (error) {
        console.error("Error cargando simulacra:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCharacters()
  }, [])

  return (
    <SimulacraContext.Provider value={{ characters, loading }}>
      {children}
    </SimulacraContext.Provider>
  )
}

export function useSimulacra() {
  return useContext(SimulacraContext)
}