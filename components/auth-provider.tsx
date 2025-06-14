"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  uid: string
  email: string | null
  displayName: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  initialized: boolean
  signIn: (user: User) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  initialized: false,
  signIn: () => {},
  signOut: () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Function to sign in a user
  const signIn = (userData: User) => {
    console.log("AuthProvider: Signing in user", userData)
    setUser(userData)
    localStorage.setItem("demo_user", JSON.stringify(userData))
  }

  // Function to sign out a user
  const signOut = () => {
    console.log("AuthProvider: Signing out user")
    setUser(null)
    localStorage.removeItem("demo_user")
  }

  useEffect(() => {
    // Check for demo user in localStorage on mount
    const checkDemoUser = () => {
      try {
        const demoUser = localStorage.getItem("demo_user")
        if (demoUser) {
          const userData = JSON.parse(demoUser)
          console.log("AuthProvider: Found existing user in localStorage", userData)
          setUser(userData)
        } else {
          console.log("AuthProvider: No existing user found")
        }
      } catch (error) {
        console.error("Error checking demo user:", error)
        setError("Failed to load user session")
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    // Small delay to simulate auth check
    const timer = setTimeout(checkDemoUser, 500)

    return () => clearTimeout(timer)
  }, [])

  // Listen for storage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "demo_user") {
        if (e.newValue) {
          const userData = JSON.parse(e.newValue)
          setUser(userData)
        } else {
          setUser(null)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        initialized,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
