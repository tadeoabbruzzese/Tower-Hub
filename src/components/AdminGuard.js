"use client"

import { useAuth } from "@/context/AuthContext"

export default function AdminGuard({ children }) {
  const { user, role, loading } = useAuth()

  if (loading) return <p>Cargando...</p>

  if (!user) {
    return <p>No autenticado</p>
  }

  if (role !== "admin") {
    return <p>Acceso denegado</p>
  }

  return children
}
