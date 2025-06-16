"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { Navigation } from "./navigation"
import { useAuth } from "@/components/auth-provider"

const publicRoutes = [
  "/",
  "/features",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/demo",
  "/auth/signin",
  "/auth/signup",
]

const protectedRoutes = [
  "/dashboard",
  "/onboarding",
  "/calendar",
  "/progress",
  "/profile",
  "/devices",
  "/coach",
  "/workout",
  "/community",
  "/help",
  "/admin",
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, initialized } = useAuth()

  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/auth/")
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const showNavigation = user && isProtectedRoute

  return (
    <div className="min-h-screen bg-background">
      {/* Header for public pages */}
      {isPublicRoute && <Header />}

      <div className="flex">
        {/* Sidebar Navigation for protected routes */}
        {showNavigation && (
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
              <Navigation />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className={`flex-1 ${showNavigation ? "md:ml-0" : ""}`}>
          <main className="flex-1">{children}</main>
        </div>
      </div>

      {/* Footer for public pages */}
      {isPublicRoute && <Footer />}
    </div>
  )
}
