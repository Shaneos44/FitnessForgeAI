"use client"

import { useState, useEffect } from "react"

interface User {
  uid: string
  email: string
  displayName?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Demo user for development
    const demoUser = {
      uid: "demo-user-123",
      email: "demo@fitnessforge.ai",
      displayName: "Demo User",
    }

    setUser(demoUser)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Demo sign in
    const demoUser = {
      uid: "demo-user-123",
      email: email,
      displayName: "Demo User",
    }
    setUser(demoUser)
    return demoUser
  }

  const signUp = async (email: string, password: string) => {
    // Demo sign up
    const demoUser = {
      uid: "demo-user-123",
      email: email,
      displayName: "Demo User",
    }
    setUser(demoUser)
    return demoUser
  }

  const signOut = async () => {
    setUser(null)
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
