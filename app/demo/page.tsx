"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Target, CheckCircle, Play, ArrowRight } from "lucide-react"
import Link from "next/link"

const demoUser = {
  name: "Sarah Johnson",
  eventType: "Marathon",
  eventDate: "2024-10-15",
  daysUntilEvent: 45,
  currentWeek: 8,
  totalWeeks: 16,
  completedWorkouts: 32,
  totalWorkouts: 64,
}

const demoWorkouts = [
  {
    id: 1,
    date: "2024-06-15",
    type: "Easy Run",
    duration: "45 min",
    distance: "6 miles",
    completed: false,
  },
  {
    id: 2,
    date: "2024-06-16",
    type: "Interval Training",
    duration: "60 min",
    distance: "5 miles",
    completed: false,
  },
  {
    id: 3,
    date: "2024-06-17",
    type: "Rest Day",
    duration: "Recovery",
    distance: "-",
    completed: false,
  },
]

const demoProgress = [
  { week: "Week 1", distance: 15, duration: 180 },
  { week: "Week 2", distance: 18, duration: 210 },
  { week: "Week 3", distance: 22, duration: 250 },
  { week: "Week 4", distance: 20, duration: 220 },
  { week: "Week 5", distance: 25, duration: 280 },
  { week: "Week 6", distance: 28, duration: 320 },
  { week: "Week 7", distance: 30, duration: 350 },
  { week: "Week 8", distance: 32, duration: 380 },
]

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const progressPercentage = (demoUser.currentWeek / demoUser.totalWeeks) * 100
  const workoutCompletionRate = (demoUser.completedWorkouts / demoUser.totalWorkouts) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Experience FitnessForge AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            See how our AI-powered platform creates personalized training plans and tracks your progress
          </p>
          <Badge variant="outline" className="mb-8">
            Interactive Demo - No signup required
          </Badge>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Demo Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Dashboard Demo */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Training Dashboard</h2>
              <p className="text-gray-600">
                Get an overview of your training progress, upcoming workouts, and key metrics
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {demoUser.currentWeek}/{demoUser.totalWeeks}
                  </div>
                  <Progress value={progressPercentage} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Week {demoUser.currentWeek} of {demoUser.totalWeeks}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Workout Completion</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(workoutCompletionRate)}%</div>
                  <Progress value={workoutCompletionRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {demoUser.completedWorkouts} of {demoUser.totalWorkouts} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Days to Event</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{demoUser.daysUntilEvent}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {demoUser.eventType} on {new Date(demoUser.eventDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Phase</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Build</div>
                  <p className="text-xs text-muted-foreground mt-2">Building endurance base</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Workouts */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Workouts</CardTitle>
                <CardDescription>Your next scheduled training sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{workout.type}</span>
                        <span className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{workout.duration}</div>
                        <div className="text-sm text-gray-500">{workout.distance}</div>
                      </div>
                      <Button size="sm" disabled>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workouts Demo */}
          <TabsContent value="workouts" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Generated Workouts</h2>
              <p className="text-gray-600">
                Each workout is specifically designed for your fitness level, goals, and schedule
              </p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Interval Training Session</CardTitle>
                    <CardDescription>High-intensity intervals to improve VO2 max</CardDescription>
                  </div>
                  <Badge variant="secondary">Speed Work</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">60</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-sm text-gray-600">Miles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">7:30</div>
                    <div className="text-sm text-gray-600">Target Pace</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">85%</div>
                    <div className="text-sm text-gray-600">Max HR</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Warmup (10 minutes)</h4>
                    <p className="text-blue-800 text-sm">Easy jog with dynamic stretching</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Main Set (35 minutes)</h4>
                    <p className="text-red-800 text-sm">6 x 800m intervals at 5K pace with 400m recovery</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Cooldown (15 minutes)</h4>
                    <p className="text-green-800 text-sm">Easy jog and stretching</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Demo */}
          <TabsContent value="progress" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Your Progress</h2>
              <p className="text-gray-600">Monitor your improvements with detailed analytics and performance metrics</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Distance Progress</CardTitle>
                <CardDescription>Your training volume over the past 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoProgress.map((week, index) => (
                    <div key={week.week} className="flex items-center space-x-4">
                      <div className="w-16 text-sm text-gray-600">{week.week}</div>
                      <div className="flex-1">
                        <Progress value={(week.distance / 35) * 100} className="h-3" />
                      </div>
                      <div className="w-16 text-sm font-medium text-right">{week.distance}mi</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Distance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">190 miles</div>
                  <p className="text-sm text-gray-600">Last 8 weeks</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Pace</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">8:15</div>
                  <p className="text-sm text-gray-600">Per mile</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consistency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">92%</div>
                  <p className="text-sm text-gray-600">Workout completion</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
              <p className="text-blue-100 mb-6">
                Join thousands of athletes who are already training smarter with AI-powered plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
