"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Play, Pause, Square, Clock, MapPin, Heart, Zap } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { logWorkout } from "@/lib/database"

// Mock workout data - in real app this would come from your database
const mockWorkout = {
  id: 1,
  title: "Interval Training Session",
  type: "Speed Work",
  date: "2024-06-15",
  estimatedDuration: "60 minutes",
  targetDistance: "5 miles",
  description: "High-intensity interval training to improve speed and VO2 max",
  warmup: {
    duration: "10 minutes",
    description: "Easy jog with dynamic stretching",
    instructions: [
      "Start with 5 minutes easy jogging",
      "Add leg swings, high knees, and butt kicks",
      "Gradually increase pace to moderate effort",
    ],
  },
  mainSet: {
    duration: "35 minutes",
    description: "6 x 800m intervals at 5K pace",
    instructions: [
      "Run 800m (2 laps) at your 5K race pace",
      "Recovery: 400m easy jog between intervals",
      "Focus on maintaining consistent pace",
      "Target heart rate: 85-90% max HR",
    ],
  },
  cooldown: {
    duration: "15 minutes",
    description: "Easy jog and stretching",
    instructions: ["10 minutes easy jogging", "5 minutes static stretching", "Focus on legs, hips, and calves"],
  },
  notes: "If you feel overly fatigued, reduce the number of intervals to 4-5. Listen to your body.",
  targetPace: "7:30/mile",
  targetHeartRate: "160-170 bpm",
}

export default function WorkoutPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [workoutNotes, setWorkoutNotes] = useState("")
  const [actualDistance, setActualDistance] = useState("")
  const [actualDuration, setActualDuration] = useState("")
  const [effortLevel, setEffortLevel] = useState("")
  const [isCompleting, setIsCompleting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused])

  const handleStartWorkout = () => {
    setIsActive(true)
    setIsPaused(false)
  }

  const handlePauseWorkout = () => {
    setIsPaused(true)
  }

  const handleResumeWorkout = () => {
    setIsPaused(false)
  }

  const handleStopWorkout = () => {
    setIsActive(false)
    setIsPaused(false)
    setElapsedTime(0)
  }

  const handleCompleteWorkout = async () => {
    if (!user) return

    setIsCompleting(true)
    try {
      // Log workout to database
      await logWorkout(user.uid, {
        workoutId: params.id,
        title: mockWorkout.title,
        type: mockWorkout.type,
        plannedDuration: mockWorkout.estimatedDuration,
        plannedDistance: mockWorkout.targetDistance,
        actualDuration:
          actualDuration || `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, "0")}`,
        actualDistance,
        effortLevel: Number.parseInt(effortLevel) || 5,
        notes: workoutNotes,
        completed: true,
        elapsedTime,
      })

      // Redirect to dashboard with success message
      router.push("/dashboard?workout_completed=true")
    } catch (error) {
      console.error("Error completing workout:", error)
      alert("Error saving workout. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mockWorkout.title}</h1>
              <p className="text-gray-600">{new Date(mockWorkout.date).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {mockWorkout.type}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Workout Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workout Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Workout Overview</CardTitle>
                <CardDescription>{mockWorkout.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{mockWorkout.estimatedDuration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-medium">{mockWorkout.targetDistance}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Target Pace</p>
                      <p className="font-medium">{mockWorkout.targetPace}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Heart Rate</p>
                      <p className="font-medium">{mockWorkout.targetHeartRate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workout Phases */}
            <div className="space-y-4">
              {/* Warmup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Warmup</span>
                    <Badge variant="outline">{mockWorkout.warmup.duration}</Badge>
                  </CardTitle>
                  <CardDescription>{mockWorkout.warmup.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockWorkout.warmup.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Main Set */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Main Set</span>
                    <Badge variant="outline">{mockWorkout.mainSet.duration}</Badge>
                  </CardTitle>
                  <CardDescription>{mockWorkout.mainSet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockWorkout.mainSet.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Cooldown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Cooldown</span>
                    <Badge variant="outline">{mockWorkout.cooldown.duration}</Badge>
                  </CardTitle>
                  <CardDescription>{mockWorkout.cooldown.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockWorkout.cooldown.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Coach Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Coach Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  {mockWorkout.notes}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workout Timer */}
            <Card>
              <CardHeader>
                <CardTitle>Workout Timer</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-4xl font-bold text-gray-900">{formatTime(elapsedTime)}</div>

                <div className="flex justify-center space-x-2">
                  {!isActive ? (
                    <Button onClick={handleStartWorkout} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <>
                      {isPaused ? (
                        <Button onClick={handleResumeWorkout} className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </Button>
                      ) : (
                        <Button onClick={handlePauseWorkout} variant="outline" className="flex-1">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button onClick={handleStopWorkout} variant="destructive">
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Workout Logging */}
            <Card>
              <CardHeader>
                <CardTitle>Log Your Workout</CardTitle>
                <CardDescription>Record your actual performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="actualDistance">Actual Distance</Label>
                  <Input
                    id="actualDistance"
                    value={actualDistance}
                    onChange={(e) => setActualDistance(e.target.value)}
                    placeholder="e.g., 5.2 miles"
                  />
                </div>

                <div>
                  <Label htmlFor="actualDuration">Actual Duration</Label>
                  <Input
                    id="actualDuration"
                    value={actualDuration}
                    onChange={(e) => setActualDuration(e.target.value)}
                    placeholder={`Timer: ${formatTime(elapsedTime)}`}
                  />
                </div>

                <div>
                  <Label htmlFor="effortLevel">Effort Level (1-10)</Label>
                  <Input
                    id="effortLevel"
                    type="number"
                    min="1"
                    max="10"
                    value={effortLevel}
                    onChange={(e) => setEffortLevel(e.target.value)}
                    placeholder="Rate your effort"
                  />
                </div>

                <div>
                  <Label htmlFor="workoutNotes">Notes</Label>
                  <Textarea
                    id="workoutNotes"
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    placeholder="How did the workout feel? Any observations..."
                    rows={3}
                  />
                </div>

                <Separator />

                <Button onClick={handleCompleteWorkout} className="w-full" disabled={isCompleting}>
                  {isCompleting ? "Saving Workout..." : "Complete Workout"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
