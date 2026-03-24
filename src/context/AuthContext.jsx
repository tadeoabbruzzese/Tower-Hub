"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setRole(null)
        setProfile(null)
        setLoading(false)
        return
      }

      setUser(firebaseUser)

      try {
        // Leer role desde Firestore
        const userRef = doc(db, "users", firebaseUser.uid)
        const snap = await getDoc(userRef)

        if (snap.exists()) {
          setProfile(snap.data())
          setRole(snap.data().role)
        } else {
          setProfile(null)
          setRole(null)
        }
      } catch (error) {
        console.error("Error loading user role from Firestore:", error)
        setProfile(null)
        setRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const normalizedProfile = profile
    ? {
        ...profile,
        photoURL:
          profile.photoURL ||
          user?.photoURL ||
          user?.providerData?.[0]?.photoURL ||
          null,
      }
    : null

  return (
    <AuthContext.Provider value={{ user, role, profile: normalizedProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
