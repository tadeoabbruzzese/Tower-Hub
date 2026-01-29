"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

const RelicsContext = createContext(null)

export function RelicsProvider({ children }) {
  const [relics, setRelics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelics = async () => {
      try {
        const q = query(collection(db, "relics"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setRelics(data)
      } catch (error) {
        console.error("Error cargando reliquias:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelics()
  }, [])

  return (
    <RelicsContext.Provider value={{ relics, loading }}>
      {children}
    </RelicsContext.Provider>
  )
}

export function useRelics() {
  return useContext(RelicsContext)
}