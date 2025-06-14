import { NextResponse } from "next/server"
import { validateEnvironmentVariables } from "@/lib/env-validation"

export async function GET() {
  try {
    const checks = await runDeploymentChecks()

    const allPassed = checks.every((check) => check.status === "pass")

    return NextResponse.json({
      ready: allPassed,
      timestamp: new Date().toISOString(),
      checks,
      summary: {
        total: checks.length,
        passed: checks.filter((c) => c.status === "pass").length,
        failed: checks.filter((c) => c.status === "fail").length,
        warnings: checks.filter((c) => c.status === "warning").length,
      },
    })
  } catch (error) {
    console.error("Deployment check error:", error)
    return NextResponse.json(
      {
        ready: false,
        error: "Deployment check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

async function runDeploymentChecks() {
  const checks = []

  // Environment Variables Check
  const envCheck = validateEnvironmentVariables()
  checks.push({
    name: "Environment Variables",
    status: envCheck.isValid ? "pass" : "fail",
    message: envCheck.isValid
      ? "All required environment variables configured"
      : `Missing: ${envCheck.missingVars.join(", ")}`,
    critical: true,
  })

  // OpenAI API Check
  try {
    if (process.env.OPENAI_API_KEY) {
      const { openai } = await import("@ai-sdk/openai")
      const { generateText } = await import("ai")

      await generateText({
        model: openai("gpt-4o"),
        prompt: "Test connection",
        maxTokens: 5,
      })

      checks.push({
        name: "OpenAI API Connection",
        status: "pass",
        message: "AI services are working correctly",
        critical: true,
      })
    } else {
      checks.push({
        name: "OpenAI API Connection",
        status: "fail",
        message: "OPENAI_API_KEY not configured",
        critical: true,
      })
    }
  } catch (error) {
    checks.push({
      name: "OpenAI API Connection",
      status: "fail",
      message: `AI service error: ${error instanceof Error ? error.message : "Unknown error"}`,
      critical: true,
    })
  }

  // Stripe Configuration Check
  try {
    if (process.env.STRIPE_SECRET_KEY) {
      const Stripe = (await import("stripe")).default
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
      })

      // Test API connection
      await stripe.prices.list({ limit: 1 })

      checks.push({
        name: "Stripe Payment System",
        status: "pass",
        message: "Payment processing is configured correctly",
        critical: true,
      })
    } else {
      checks.push({
        name: "Stripe Payment System",
        status: "fail",
        message: "STRIPE_SECRET_KEY not configured",
        critical: true,
      })
    }
  } catch (error) {
    checks.push({
      name: "Stripe Payment System",
      status: "fail",
      message: `Stripe error: ${error instanceof Error ? error.message : "Unknown error"}`,
      critical: true,
    })
  }

  // Firebase Connection Check
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    await initializeFirebaseForDb()

    checks.push({
      name: "Firebase Database",
      status: "pass",
      message: "Database connection is working",
      critical: true,
    })
  } catch (error) {
    checks.push({
      name: "Firebase Database",
      status: "fail",
      message: `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
      critical: true,
    })
  }

  // Base URL Check
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    const isValidUrl = process.env.NEXT_PUBLIC_BASE_URL.startsWith("http")
    checks.push({
      name: "Base URL Configuration",
      status: isValidUrl ? "pass" : "fail",
      message: isValidUrl
        ? `Base URL: ${process.env.NEXT_PUBLIC_BASE_URL}`
        : "Base URL must start with http:// or https://",
      critical: false,
    })
  } else {
    checks.push({
      name: "Base URL Configuration",
      status: "warning",
      message: "NEXT_PUBLIC_BASE_URL not set - may cause issues with redirects",
      critical: false,
    })
  }

  // Webhook Secret Check
  checks.push({
    name: "Stripe Webhook Secret",
    status: process.env.STRIPE_WEBHOOK_SECRET ? "pass" : "fail",
    message: process.env.STRIPE_WEBHOOK_SECRET
      ? "Webhook secret configured"
      : "STRIPE_WEBHOOK_SECRET not configured - subscription updates won't work",
    critical: true,
  })

  return checks
}
