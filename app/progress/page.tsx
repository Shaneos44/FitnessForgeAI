"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Award, Activity, Clock } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { getUserWorkouts, getUserStats } from "@/lib/database"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock progress data
const mockProgressData = {
  weeklyStats: [
    { week: "Week 1", distance: 15, duration: 180, workouts: 4 },
    { week: "Week 2", distance: 18, duration: 210, workouts: 5 },
    { week: "Week 3", distance: 22, duration: 250, workouts: 5 },
    { week: "Week 4", distance: 20, duration: 220, workouts: 4 },
    { week: "Week 5", distance: 25, duration: 280, workouts: 6 },
    { week: "Week 6", distance: 28, duration: 320, workouts: 6 },
    { week: "Week 7", distance: 30, duration: 350, workouts: 6 },
    { week: "Week 8", distance: 32, duration: 380, workouts: 7 },
  ],
  achievements: [
    {
      id: 1,
      title: "First Week Complete",
      description: "Completed your first week of training",
      date: "2024-05-01",
      icon: "🎯",
    },
    { id: 2, title: "Distance Milestone", description: "Ran your first 10 miles", date: "2024-05-15", icon: "🏃‍♂️" },
    {
      id: 3,
      title: "Consistency Champion",
      description: "Completed 5 workouts in a week",
      date: "2024-05-22",
      icon: "🔥",
    },
    {
      id: 4,
      title: "Speed Demon",
      description: "Hit your target pace in interval training",
      date: "2024-06-01",
      icon: "⚡",
    },
  ],
  personalRecords: [
    { metric: "Longest Run", value: "15.2 miles", date: "2024-06-10", improvement: "+2.1 miles" },
    { metric: "Fastest 5K", value: "22:45", date: "2024-06-05", improvement: "-1:15" },
    { metric: "Weekly Distance", value: "32 miles", date: "2024-06-14", improvement: "+5 miles" },
    { metric: "Workout Streak", value: "12 days", date: "Current", improvement: "+8 days" },
  ],
}

export default function ProgressPage() {
  const { user } = useAuth()
  const [progressData, setProgressData] = useState(mockProgressData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProgressData()
    }
  }, [user])

  const loadProgressData = async () => {
    try {
      setLoading(true)
      // Load user workouts and calculate progress
      const workouts = await getUserWorkouts(user.uid, 50)
      const stats = await getUserStats(user.uid)

      // Process workouts into weekly stats
      const weeklyStats = processWorkoutsIntoWeeklyStats(workouts)

      setProgressData({
        ...mockProgressData,
        weeklyStats,
        totalWorkouts: stats.totalWorkouts,
        completedWorkouts: stats.completedWorkouts,
      })
    } catch (error) {
      console.error("Error loading progress data:", error)
    } finally {
      setLoading(false)
    }
  }

  const processWorkoutsIntoWeeklyStats = (workouts: any[]) => {
    // Group workouts by week and calculate totals
    const weeklyData = {}

    workouts.forEach((workout) => {
      const date = new Date(workout.completedAt.seconds * 1000)
      const weekKey = getWeekKey(date)

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { distance: 0, duration: 0, workouts: 0 }
      }

      weeklyData[weekKey].workouts += 1
      weeklyData[weekKey].distance += Number.parseFloat(workout.actualDistance) || 0
      weeklyData[weekKey].duration += Number.parseInt(workout.elapsedTime) || 0
    })

    // Convert to array format
    return Object.entries(weeklyData).map(([week, data]) => ({
      week,
      ...data,
    }))
  }

  const getWeekKey = (date: Date) => {
    const year = date.getFullYear()
    const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
    return `Week ${week}`
  }

  const totalDistance = progressData.weeklyStats.reduce((sum, week) => sum + week.distance, 0)
  const totalDuration = progressData.weeklyStats.reduce((sum, week) => sum + week.duration, 0)
  const totalWorkouts = progressData.weeklyStats.reduce((sum, week) => sum + week.workouts, 0)
  const avgPace = totalDuration / totalDistance

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading your progress..." />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Training Progress</h1>
            <p className="mt-2 text-gray-600">Track your fitness journey and celebrate your achievements</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDistance} miles</div>
                <p className="text-xs text-muted-foreground">Last 8 weeks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                </div>
                <p className="text-xs text-muted-foreground">Training time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workouts</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWorkouts}</div>
                <p className="text-xs text-muted-foreground">Sessions completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Pace</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(avgPace)}:{String(Math.floor((avgPace % 1) * 60)).padStart(2, "0")}
                </div>
                <p className="text-xs text-muted-foreground">Per mile</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="records">Personal Records</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Distance Progress</CardTitle>
                    <CardDescription>Your training volume over the past 8 weeks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {progressData.weeklyStats.map((week, index) => (
                        <div key={week.week} className="flex items-center space-x-4">
                          <div className="w-16 text-sm text-gray-600">{week.week}</div>
                          <div className="flex-1">
                            <Progress value={(week.distance / 35) * 100} className="h-2" />
                          </div>
                          <div className="w-16 text-sm font-medium text-right">{week.distance}mi</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Training Consistency */}
                <Card>
                  <CardHeader>
                    <CardTitle>Training Consistency</CardTitle>
                    <CardDescription>Workout frequency over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {progressData.weeklyStats.map((week, index) => (
                        <div key={week.week} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{week.week}</span>
                          <div className="flex space-x-1">
                            {Array.from({ length: 7 }).map((_, dayIndex) => (
                              <div
                                key={dayIndex}
                                className={`w-3 h-3 rounded-sm ${
                                  dayIndex < week.workouts ? "bg-green-500" : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{week.workouts}/7</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Milestones you've reached on your fitness journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50"
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{new Date(achievement.date).toLocaleDateString()}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Records</CardTitle>
                  <CardDescription>Your best performances and improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {progressData.personalRecords.map((record, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{record.metric}</h3>
                          <Award className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mb-1">{record.value}</div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{record.date}</span>
                          <span className="text-green-600 font-medium">{record.improvement}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
