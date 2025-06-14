"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "./auth-provider"
import { getUserProfile } from "@/lib/database"
import { loadStripe } from "@stripe/stripe-js"

interface SubscriptionManagerProps {
  planType?: "basic" | "pro" | "elite"
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function SubscriptionManager({ planType = "pro" }: SubscriptionManagerProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Your actual Stripe Price IDs
  const priceIds = {
    basic: "price_1RZmwEQ9Bm4Ev0Z7CSRt1TNd",
    pro: "price_1RZmwaQ9Bm4Ev0Z7dDh4hYF5",
    elite: "price_1RZmwwQ9Bm4Ev0Z7zjtvAyHd",
  }

  const planPrices = {
    basic: "€9.99",
    pro: "€19.99",
    elite: "€39.99",
  }

  useEffect(() => {
    if (user) {
      loadSubscription()
    }
  }, [user])

  const loadSubscription = async () => {
    if (!user) return

    try {
      setProfileLoading(true)
      const profile = await getUserProfile(user.uid)
      setSubscription(profile?.subscription)
    } catch (error) {
      console.error("Error loading subscription:", error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceIds[planType],
          userId: user.uid,
          planType: planType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { sessionId, demo, message } = await response.json()

      // Handle demo mode
      if (demo) {
        alert(`Demo Mode: ${message}\n\nIn production, this would redirect to Stripe checkout.`)
        return
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error("Stripe redirect error:", error)
          alert("Payment redirect failed. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      alert(`Failed to start checkout: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!user || !subscription) return

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: subscription.customerId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create portal session")
      }

      const { url, demo } = await response.json()

      if (demo) {
        alert("Demo Mode: In production, this would open the Stripe billing portal.")
        return
      }

      window.location.href = url
    } catch (error) {
      console.error("Error creating portal session:", error)
      alert("Failed to open billing portal. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "past_due":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading subscription...</p>
        </CardContent>
      </Card>
    )
  }

  if (subscription?.subscriptionStatus === "active") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Subscription
            <Badge className={getStatusColor(subscription.subscriptionStatus)}>{subscription.subscriptionStatus}</Badge>
          </CardTitle>
          <CardDescription>You're subscribed to the {subscription.planType} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Plan: <span className="font-medium capitalize">{subscription.planType}</span>
            </p>
            <p className="text-sm text-gray-600">
              Price:{" "}
              <span className="font-medium">{planPrices[subscription.planType as keyof typeof planPrices]}/month</span>
            </p>
            {subscription.subscriptionStartDate && (
              <p className="text-sm text-gray-600">
                Started: {new Date(subscription.subscriptionStartDate.seconds * 1000).toLocaleDateString()}
              </p>
            )}
            <div className="pt-4 space-y-2">
              <Button onClick={handleManageSubscription} variant="outline" className="w-full">
                Manage Subscription
              </Button>
              <Button variant="outline" className="w-full">
                View Billing History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribe to {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan</CardTitle>
        <CardDescription>
          Get access to AI-powered training plans and advanced features for {planPrices[planType]}/month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSubscribe} disabled={loading} className="w-full">
          {loading ? "Processing..." : `Subscribe for ${planPrices[planType]}/month`}
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">14-day free trial • Cancel anytime</p>
      </CardContent>
    </Card>
  )
}
