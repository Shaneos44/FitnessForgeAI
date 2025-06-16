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

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { signUp, signInWithGoogle, user } = useAuth()

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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mounted) return

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Starting email sign up...")
      await signUp(email, password)
      console.log("Sign up successful")

      // Navigate to onboarding
      router.push("/onboarding")
    } catch (error: any) {
      console.error("Sign up error:", error)

      if (error.message?.includes("EMAIL_EXISTS")) {
        setError("An account with this email already exists")
      } else if (error.message?.includes("INVALID_EMAIL")) {
        setError("Please enter a valid email address")
      } else if (error.message?.includes("WEAK_PASSWORD")) {
        setError("Password is too weak. Please choose a stronger password.")
      } else {
        setError("Account creation failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!mounted) return

    setLoading(true)
    setError("")

    try {
      console.log("Starting Google sign up...")
      await signInWithGoogle()
      console.log("Google sign up successful")

      // Navigate to onboarding
      router.push("/onboarding")
    } catch (error: any) {
      console.error("Google sign up error:", error)
      setError("Google sign up failed. Please try again.")
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
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Start your fitness journey with personalized AI training plans</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button onClick={handleGoogleSignUp} variant="outline" className="w-full" disabled={loading}>
            <Chrome className="mr-2 h-4 w-4" />
            {loading ? "Creating Account..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
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
                placeholder="Create a password"
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                disabled={loading}
                minLength={6}
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>

          {/* Demo Notice */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> Use any email/password to create an account
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
