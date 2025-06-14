import { NextResponse } from "next/server"
import { validateEnvironmentVariables } from "@/lib/env-validation"

export async function GET() {
  try {
    const envCheck = validateEnvironmentVariables()

    // Test database connection
    let dbStatus = "unknown"
    try {
      const { initializeFirebaseForDb } = await import("@/lib/firebase")
      await initializeFirebaseForDb()
      dbStatus = "connected"
    } catch (error) {
      dbStatus = "error"
      console.error("Database connection error:", error)
    }

    // Test Stripe connection
    let stripeStatus = "unknown"
    try {
      if (process.env.STRIPE_SECRET_KEY) {
        const Stripe = (await import("stripe")).default
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2024-06-20",
        })
        await stripe.prices.list({ limit: 1 })
        stripeStatus = "connected"
      } else {
        stripeStatus = "not_configured"
      }
    } catch (error) {
      stripeStatus = "error"
      console.error("Stripe connection error:", error)
    }

    // Test OpenAI connection
    let aiStatus = "unknown"
    try {
      if (process.env.OPENAI_API_KEY) {
        const { openai } = await import("@ai-sdk/openai")
        const { generateText } = await import("ai")

        await generateText({
          model: openai("gpt-4o"),
          prompt: "Test",
          maxTokens: 5,
        })
        aiStatus = "connected"
      } else {
        aiStatus = "not_configured"
      }
    } catch (error) {
      aiStatus = "error"
      console.error("AI service error:", error)
    }

    const healthStatus = {
      status: envCheck.isValid && dbStatus === "connected" && stripeStatus === "connected" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      environment: {
        isValid: envCheck.isValid,
        missingVars: envCheck.missingVars,
        warnings: envCheck.warnings,
      },
      services: {
        database: dbStatus,
        payments: stripeStatus,
        ai: aiStatus,
      },
      version: process.env.npm_package_version || "unknown",
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 },
    )
  }
}
