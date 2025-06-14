"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

interface DeploymentCheck {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
  critical: boolean
}

interface DeploymentStatus {
  ready: boolean
  timestamp: string
  checks: DeploymentCheck[]
  summary: {
    total: number
    passed: number
    failed: number
    warnings: number
  }
}

export default function SetupPage() {
  const [status, setStatus] = useState<DeploymentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const runChecks = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/deployment-check")
      if (!response.ok) {
        throw new Error("Failed to run deployment checks")
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runChecks()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "border-green-200 bg-green-50"
      case "fail":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Running deployment checks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Setup Check Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={runChecks}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Production Setup Status</h1>
          <p className="mt-2 text-gray-600">Verify your FitnessForge AI deployment is ready for customers</p>
        </div>

        {/* Overall Status */}
        <Alert className={`mb-6 ${status?.ready ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          {status?.ready ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={status?.ready ? "text-green-800" : "text-red-800"}>
            <div className="flex items-center justify-between">
              <span>
                {status?.ready
                  ? "🎉 Your app is ready for production deployment!"
                  : "⚠️ Your app needs configuration before going live"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={runChecks}
                className={status?.ready ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Summary Stats */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{status.summary.total}</div>
                <p className="text-sm text-gray-600">Total Checks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{status.summary.passed}</div>
                <p className="text-sm text-gray-600">Passed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{status.summary.failed}</div>
                <p className="text-sm text-gray-600">Failed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{status.summary.warnings}</div>
                <p className="text-sm text-gray-600">Warnings</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Checks */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Checks</CardTitle>
            <CardDescription>
              Detailed status of all required configurations
              {status && (
                <span className="ml-2 text-xs text-gray-500">
                  Last checked: {new Date(status.timestamp).toLocaleString()}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status?.checks.map((check, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}>
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{check.name}</h4>
                        {check.critical && (
                          <Badge variant="outline" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{check.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>What to do after all checks pass</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Deploy to Vercel or your hosting platform</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Configure your custom domain</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Set up Stripe webhook endpoint</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Test the complete user journey</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Launch to your first customers! 🚀</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
