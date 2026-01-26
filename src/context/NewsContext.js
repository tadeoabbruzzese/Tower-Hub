"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const NewsContext = createContext(null)

export function NewsProvider({ children }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Traemos las últimas 6 por si en el futuro quieres una página de noticias dedicada
        // aunque el Home solo use 3.
        const q = query(
          collection(db, "news"), 
          orderBy("date", "desc"), 
          limit(6)
        )
        
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setNews(data)
      } catch (error) {
        console.error("Error cargando noticias:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <NewsContext.Provider value={{ news, loading }}>
      {children}
    </NewsContext.Provider>
  )
}

export function useNews() {
  return useContext(NewsContext)
}