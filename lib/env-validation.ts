// Environment variables validation for production readiness

interface RequiredEnvVars {
  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: string
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
  NEXT_PUBLIC_FIREBASE_APP_ID: string

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string

  // App
  NEXT_PUBLIC_BASE_URL: string

  // OpenAI (optional but recommended)
  OPENAI_API_KEY?: string
}

export function validateEnvironmentVariables(): { isValid: boolean; missingVars: string[]; warnings: string[] } {
  const requiredVars: (keyof RequiredEnvVars)[] = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_BASE_URL",
  ]

  const optionalVars: (keyof RequiredEnvVars)[] = ["OPENAI_API_KEY"]

  const missingVars: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (!value || value.trim() === "") {
      missingVars.push(varName)
    }
  }

  // Check optional variables
  for (const varName of optionalVars) {
    const value = process.env[varName]
    if (!value || value.trim() === "") {
      warnings.push(`${varName} is not set - AI features will be limited`)
    }
  }

  // Validate specific formats
  if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.startsWith("http")) {
    missingVars.push("NEXT_PUBLIC_BASE_URL must start with http:// or https://")
  }

  if (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_")
  ) {
    missingVars.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_")
  }

  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
    missingVars.push("STRIPE_SECRET_KEY must start with sk_")
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings,
  }
}

export function logEnvironmentStatus() {
  const { isValid, missingVars, warnings } = validateEnvironmentVariables()

  if (isValid) {
    console.log("✅ All required environment variables are configured")
    if (warnings.length > 0) {
      console.warn("⚠️ Warnings:", warnings)
    }
  } else {
    console.error("❌ Missing required environment variables:", missingVars)
    if (warnings.length > 0) {
      console.warn("⚠️ Additional warnings:", warnings)
    }
  }

  return isValid
}
