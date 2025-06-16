"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Chrome } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { signIn, signInWithGoogle, user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already signed in
  useEffect(() => {
    if (mounted && user) {
      console.log("User already signed in, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [mounted, user, router])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mounted) return

    setLoading(true)
    setError("")

    try {
      console.log("Starting email sign in...")
      await signIn(email, password)
      console.log("Sign in successful")

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign in error:", error)

      if (error.message?.includes("INVALID_LOGIN_CREDENTIALS") || error.message?.includes("INVALID_PASSWORD")) {
        setError("Invalid email or password")
      } else if (error.message?.includes("USER_NOT_FOUND")) {
        setError("No account found with this email address")
      } else if (error.message?.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
        setError("Too many failed attempts. Please try again later.")
      } else {
        setError("Sign in failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!mounted) return

    setLoading(true)
    setError("")

    try {
      console.log("Starting Google sign in...")
      await signInWithGoogle()
      console.log("Google sign in successful")

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setError("Google sign in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading if user is already signed in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your FitnessForge AI account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>
            <Chrome className="mr-2 h-4 w-4" />
            {loading ? "Signing In..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>

          {/* Demo Notice */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> Use any email/password to sign in
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
