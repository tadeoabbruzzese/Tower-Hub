"use client"
import { createUserIfNotExists } from "@/lib/createUserIfNotExists"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"

export default function AuthTest() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    await createUserIfNotExists(result.user)
  } catch (error) {
    console.error("Login error:", error)
  }
}


  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) return <p>Cargando auth...</p>

  return (
    <div className="p-6 space-y-4 border rounded-md max-w-sm">
      {user ? (
        <>
          <p className="text-green-400 font-medium">Logueado</p>
          <p className="text-sm">Email: {user.email}</p>
          <img
            src={user.photoURL}
            alt="Avatar"
            className="w-12 h-12 rounded-full"
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p className="text-red-400 font-medium">No logueado</p>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Login with Google
          </button>
        </>
      )}
    </div>
  )
}
