"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Calendar, Trophy, Target, TrendingUp, Play, CheckCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { getUserProfile, getUserWorkouts, getUserStats } from "@/lib/database"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<any>(null)
  const [workouts, setWorkouts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showWorkoutSuccess, setShowWorkoutSuccess] = useState(false)
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  useEffect(() => {
    // Check for subscription success/failure
    const sessionId = searchParams.get("session_id")
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")

    if (success === "true" && sessionId) {
      setSubscriptionMessage("🎉 Welcome to FitnessForge AI Pro! Your subscription is now active.")
    } else if (canceled === "true") {
      setSubscriptionMessage("❌ Subscription canceled. You can try again anytime.")
    }

    // Check for workout completion
    const workoutCompleted = searchParams.get("workout_completed")
    if (workoutCompleted === "true") {
      setShowWorkoutSuccess(true)
    }
  }, [searchParams])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load data with individual error handling
      const [userProfile, userWorkouts, userStats] = await Promise.allSettled([
        getUserProfile(user.uid),
        getUserWorkouts(user.uid, 5),
        getUserStats(user.uid),
      ])

      // Handle user profile
      if (userProfile.status === "fulfilled") {
        setProfile(userProfile.value)

        // Show welcome message for new users
        if (userProfile.value && !userProfile.value.hasSeenWelcome) {
          setShowWelcome(true)
        }
      } else {
        console.error("Error loading user profile:", userProfile.reason)
      }

      // Handle user workouts
      if (userWorkouts.status === "fulfilled") {
        setWorkouts(userWorkouts.value)
      } else {
        console.error("Error loading user workouts:", userWorkouts.reason)
        setWorkouts([]) // Set empty array as fallback
      }

      // Handle user stats
      if (userStats.status === "fulfilled") {
        setStats(userStats.value)
      } else {
        console.error("Error loading user stats:", userStats.reason)
        setStats({
          totalWorkouts: 0,
          completedWorkouts: 0,
          completionRate: 0,
          totalPlans: 0,
        }) // Set default stats as fallback
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      // Don't show error to user for dashboard - just log it and show defaults
    } finally {
      setLoading(false)
    }
  }

  const dismissWelcome = () => {
    setShowWelcome(false)
    // Update user profile to mark welcome as seen
    if (user) {
      import("@/lib/database").then(({ updateUserProfile }) => {
        updateUserProfile(user.uid, { hasSeenWelcome: true })
      })
    }
  }

  const dismissWorkoutSuccess = () => {
    setShowWorkoutSuccess(false)
  }

  const dismissSubscriptionMessage = () => {
    setSubscriptionMessage(null)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const upcomingWorkouts = [
    { id: 1, name: "Morning Run", time: "7:00 AM", type: "Cardio", duration: "45 min" },
    { id: 2, name: "Strength Training", time: "6:00 PM", type: "Strength", duration: "60 min" },
    { id: 3, name: "Yoga Session", time: "8:00 AM", type: "Flexibility", duration: "30 min" },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Alert Messages */}
          {subscriptionMessage && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {subscriptionMessage}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0 text-green-600 hover:text-green-800"
                  onClick={dismissSubscriptionMessage}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {showWelcome && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Trophy className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                🎉 Welcome to FitnessForge AI! Your personalized training plan is ready. Let's start your fitness
                journey!
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0 text-blue-600 hover:text-blue-800"
                  onClick={dismissWelcome}
                >
                  Get Started
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {showWorkoutSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                🏆 Great job! Workout completed successfully. Keep up the momentum!
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0 text-green-600 hover:text-green-800"
                  onClick={dismissWorkoutSuccess}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile?.name || user?.displayName || "Athlete"}! 👋
            </h1>
            <p className="mt-2 text-gray-600">Ready to crush your fitness goals today?</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalWorkouts || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.completedWorkouts || 0} completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats?.completionRate || 0)}%</div>
                <Progress value={stats?.completionRate || 0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">days in a row</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Training Plans</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPlans || 0}</div>
                <p className="text-xs text-muted-foreground">active plans</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Workout */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Workout</CardTitle>
                  <CardDescription>Your scheduled training for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div>
                      <h3 className="font-semibold text-lg">Morning Cardio Blast</h3>
                      <p className="text-gray-600">High-intensity interval training</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">45 minutes</Badge>
                        <Badge variant="secondary">Cardio</Badge>
                      </div>
                    </div>
                    <Link href="/workout/1">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Workout
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest workout sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workouts.length > 0 ? (
                      workouts.map((workout, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <h4 className="font-medium">{workout.name || "Workout Session"}</h4>
                              <p className="text-sm text-gray-600">
                                {workout.completedAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{workout.duration || "45 min"}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No workouts completed yet</p>
                        <p className="text-sm">Start your first workout to see your progress here!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle>This Week</CardTitle>
                  <CardDescription>Upcoming training sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingWorkouts.map((workout) => (
                      <div key={workout.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div>
                          <h4 className="font-medium text-sm">{workout.name}</h4>
                          <p className="text-xs text-gray-600">{workout.time}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {workout.duration}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full mt-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Full Calendar
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/onboarding">
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Generate New Plan
                    </Button>
                  </Link>
                  <Link href="/progress">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Progress
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
