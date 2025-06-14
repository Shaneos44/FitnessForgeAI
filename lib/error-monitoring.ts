// Production error monitoring and logging

interface ErrorContext {
  userId?: string
  action?: string
  component?: string
  metadata?: Record<string, any>
}

export class ErrorMonitor {
  static logError(error: Error, context?: ErrorContext) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "server",
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
      ...context,
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("🚨 Error logged:", errorData)
    }

    // In production, you would send this to your monitoring service
    // Examples: Sentry, LogRocket, DataDog, etc.
    if (process.env.NODE_ENV === "production") {
      // Send to monitoring service
      this.sendToMonitoringService(errorData)
    }
  }

  static logUserAction(action: string, userId?: string, metadata?: Record<string, any>) {
    const actionData = {
      action,
      userId,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "server",
      ...metadata,
    }

    if (process.env.NODE_ENV === "development") {
      console.log("📊 User action:", actionData)
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToAnalytics(actionData)
    }
  }

  private static async sendToMonitoringService(errorData: any) {
    try {
      // Replace with your actual monitoring service
      await fetch("/api/monitoring/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      })
    } catch (err) {
      console.error("Failed to send error to monitoring service:", err)
    }
  }

  private static async sendToAnalytics(actionData: any) {
    try {
      // Replace with your actual analytics service
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actionData),
      })
    } catch (err) {
      console.error("Failed to send to analytics:", err)
    }
  }
}

// React hook for error monitoring
export function useErrorMonitor() {
  const logError = (error: Error, context?: ErrorContext) => {
    ErrorMonitor.logError(error, context)
  }

  const logAction = (action: string, metadata?: Record<string, any>) => {
    ErrorMonitor.logUserAction(action, undefined, metadata)
  }

  return { logError, logAction }
}
