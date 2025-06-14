"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, ChevronLeft, ChevronRight, Play, CheckCircle, Plus, Edit, Trash2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

// Enhanced mock calendar data with more realistic workout plans
const mockWorkouts = {
  "2024-06-15": { type: "HIIT Cardio", duration: "45 min", completed: false, id: 1, intensity: "High", calories: 400 },
  "2024-06-16": {
    type: "Upper Body Strength",
    duration: "60 min",
    completed: false,
    id: 2,
    intensity: "Medium",
    calories: 300,
  },
  "2024-06-17": {
    type: "Active Recovery",
    duration: "30 min",
    completed: false,
    id: 3,
    intensity: "Low",
    calories: 150,
  },
  "2024-06-18": {
    type: "Lower Body Power",
    duration: "50 min",
    completed: false,
    id: 4,
    intensity: "High",
    calories: 350,
  },
  "2024-06-19": { type: "Yoga Flow", duration: "40 min", completed: false, id: 5, intensity: "Low", calories: 200 },
  "2024-06-20": { type: "Long Run", duration: "90 min", completed: false, id: 6, intensity: "Medium", calories: 600 },
  "2024-06-21": { type: "Rest Day", duration: "Recovery", completed: false, id: 7, intensity: "Rest", calories: 0 },
  "2024-06-13": {
    type: "Full Body Circuit",
    duration: "55 min",
    completed: true,
    id: 8,
    intensity: "High",
    calories: 450,
  },
  "2024-06-12": { type: "Tempo Run", duration: "50 min", completed: true, id: 9, intensity: "Medium", calories: 400 },
  "2024-06-11": {
    type: "Core & Flexibility",
    duration: "35 min",
    completed: true,
    id: 10,
    intensity: "Low",
    calories: 180,
  },
}

export default function CalendarPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date(2024, 5, 15)) // June 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddWorkout, setShowAddWorkout] = useState(false)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const selectedWorkout = selectedDate ? mockWorkouts[selectedDate] : null

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "High":
        return "bg-red-100 text-red-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Low":
        return "bg-green-100 text-green-700"
      case "Rest":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const weeklyStats = {
    totalWorkouts: Object.values(mockWorkouts).filter((w) => !w.completed && w.type !== "Rest Day").length,
    completedWorkouts: Object.values(mockWorkouts).filter((w) => w.completed).length,
    totalCalories: Object.values(mockWorkouts)
      .filter((w) => w.completed)
      .reduce((sum, w) => sum + w.calories, 0),
    weeklyGoal: 5,
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Training Calendar</h1>
            <p className="mt-2 text-gray-600">Plan and track your fitness journey</p>
          </div>

          {/* Weekly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{weeklyStats.completedWorkouts}</div>
                <p className="text-sm text-gray-600">Workouts Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{weeklyStats.totalWorkouts}</div>
                <p className="text-sm text-gray-600">Workouts Scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{weeklyStats.totalCalories}</div>
                <p className="text-sm text-gray-600">Calories Burned</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((weeklyStats.completedWorkouts / weeklyStats.weeklyGoal) * 100)}%
                </div>
                <p className="text-sm text-gray-600">Weekly Goal</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </span>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Dialog open={showAddWorkout} onOpenChange={setShowAddWorkout}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Workout
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Workout</DialogTitle>
                            <DialogDescription>
                              Schedule a new workout session for your training plan.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">Workout scheduling form would go here</p>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setShowAddWorkout(false)}>
                                Cancel
                              </Button>
                              <Button onClick={() => setShowAddWorkout(false)}>Add Workout</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {dayNames.map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDay }).map((_, index) => (
                      <div key={`empty-${index}`} className="p-2 h-28"></div>
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const day = index + 1
                      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
                      const workout = mockWorkouts[dateStr]
                      const isSelected = selectedDate === dateStr
                      const isToday = dateStr === "2024-06-15" // Mock today

                      return (
                        <div
                          key={day}
                          className={`p-2 h-28 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            isSelected
                              ? "bg-blue-100 border-blue-300 shadow-md"
                              : isToday
                                ? "bg-yellow-50 border-yellow-300"
                                : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedDate(dateStr)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${isToday ? "text-yellow-600" : "text-gray-900"}`}>
                              {day}
                            </span>
                            {workout?.completed && <CheckCircle className="h-3 w-3 text-green-500" />}
                          </div>
                          {workout && (
                            <div className="text-xs space-y-1">
                              <div
                                className={`px-1 py-0.5 rounded text-xs font-medium ${
                                  workout.completed
                                    ? "bg-green-100 text-green-700"
                                    : getIntensityColor(workout.intensity)
                                }`}
                              >
                                {workout.type}
                              </div>
                              <div className="text-gray-500">{workout.duration}</div>
                              {workout.calories > 0 && <div className="text-gray-500">{workout.calories} cal</div>}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workout Details & Upcoming */}
            <div className="space-y-6">
              {selectedWorkout ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {selectedWorkout.type}
                      {selectedWorkout.completed ? (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      ) : (
                        <Badge variant="outline">Scheduled</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {new Date(selectedDate!).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Duration</h4>
                        <p className="text-gray-600">{selectedWorkout.duration}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Intensity</h4>
                        <Badge className={getIntensityColor(selectedWorkout.intensity)}>
                          {selectedWorkout.intensity}
                        </Badge>
                      </div>
                    </div>

                    {selectedWorkout.calories > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">Target Calories</h4>
                        <p className="text-gray-600">{selectedWorkout.calories} calories</p>
                      </div>
                    )}

                    {selectedWorkout.type !== "Rest Day" && (
                      <div className="space-y-2">
                        {!selectedWorkout.completed ? (
                          <>
                            <Link href={`/workout/${selectedWorkout.id}`}>
                              <Button className="w-full">
                                <Play className="h-4 w-4 mr-2" />
                                Start Workout
                              </Button>
                            </Link>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a date to view workout details</p>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming This Week</CardTitle>
                  <CardDescription>Next scheduled sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(mockWorkouts)
                    .filter(([date, workout]) => !workout.completed && new Date(date) >= new Date("2024-06-15"))
                    .slice(0, 4)
                    .map(([date, workout]) => (
                      <div
                        key={date}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{workout.type}</h4>
                          <p className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{workout.duration}</p>
                          <Badge className={`${getIntensityColor(workout.intensity)} text-xs`}>
                            {workout.intensity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
