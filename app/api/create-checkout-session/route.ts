import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getUserProfile, updateUserProfile } from "@/lib/database"

// Initialize Stripe with proper error handling
let stripe: Stripe | null = null

try {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    })
  }
} catch (error) {
  console.error("Failed to initialize Stripe:", error)
}

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, planType } = await request.json()

    // Validate required parameters
    if (!priceId || !userId || !planType) {
      console.error("Missing required parameters:", { priceId: !!priceId, userId: !!userId, planType: !!planType })
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Check if Stripe is properly configured
    if (!stripe) {
      console.error("Stripe not configured - missing or invalid STRIPE_SECRET_KEY")

      // Return demo success for development/testing
      return NextResponse.json({
        sessionId: "demo_session_" + Date.now(),
        demo: true,
        message: "Demo mode - Stripe not configured",
      })
    }

    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
      console.error("Invalid STRIPE_SECRET_KEY format")
      return NextResponse.json({
        sessionId: "demo_session_" + Date.now(),
        demo: true,
        message: "Demo mode - Invalid Stripe configuration",
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fitnessforgeai.vercel.app"

    // Get user profile to check existing subscription
    let userProfile
    try {
      userProfile = await getUserProfile(userId)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create or retrieve Stripe customer
    let customerId = userProfile?.customerId

    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          metadata: {
            userId: userId,
          },
        })
        customerId = customer.id

        // Update user profile with customer ID
        await updateUserProfile(userId, { customerId })
        console.log("Created new Stripe customer:", customerId)
      } catch (error) {
        console.error("Error creating Stripe customer:", error)
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
      }
    }

    // Validate price ID exists
    try {
      await stripe.prices.retrieve(priceId)
    } catch (error) {
      console.error("Invalid price ID:", priceId, error)
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${baseUrl}/dashboard?canceled=true`,
      metadata: {
        userId: userId,
        planType: planType,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planType: planType,
        },
        trial_period_days: 14, // 14-day free trial
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
    })

    console.log("Created checkout session:", session.id, "for user:", userId)
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: "Payment processing error",
          details: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
