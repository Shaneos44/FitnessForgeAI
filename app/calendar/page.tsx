"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUserWorkouts, getUserTrainingPlans } from "@/lib/database"

interface CalendarEvent {
  id: string
  name: string
  type: "workout" | "plan"
  date: Date
  duration?: number
  completed?: boolean
  description?: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadCalendarData()
    }
  }, [user])

  const loadCalendarData = async () => {
    try {
      setLoading(true)

      // Load workouts and training plans
      const [workouts, plans] = await Promise.all([
        getUserWorkouts(user?.uid || "demo-user", 100),
        getUserTrainingPlans(user?.uid || "demo-user"),
      ])

      // Convert to calendar events
      const calendarEvents: CalendarEvent[] = []

      // Add workouts
      workouts.forEach((workout) => {
        if (workout.date) {
          calendarEvents.push({
            id: workout.id,
            name: workout.name || "Workout",
            type: "workout",
            date: new Date(workout.date),
            duration: workout.duration,
            completed: workout.completed,
            description: workout.description,
          })
        }
      })

      // Add training plan events (mock some scheduled workouts)
      plans.forEach((plan) => {
        // Generate some mock scheduled workouts for the next few weeks
        const startDate = new Date()
        for (let i = 0; i < 14; i++) {
          const eventDate = new Date(startDate)
          eventDate.setDate(startDate.getDate() + i)

          // Add workouts on certain days of the week
          if ([1, 3, 5].includes(eventDate.getDay())) {
            // Mon, Wed, Fri
            calendarEvents.push({
              id: `plan-${plan.id}-${i}`,
              name: `${plan.name} - Training`,
              type: "plan",
              date: eventDate,
              duration: 60,
              completed: false,
              description: "Scheduled training session",
            })
          }
        }
      })

      setEvents(calendarEvents)
    } catch (error) {
      console.error("Error loading calendar data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvents(getEventsForDate(date))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Loading calendar...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Calendar</h1>
          <p className="text-gray-600">Track your workouts and training schedule</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Workout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{monthYear}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2 h-20"></div>
                  }

                  const dayEvents = getEventsForDate(day)
                  const isToday =
                    day.getDate() === new Date().getDate() &&
                    day.getMonth() === new Date().getMonth() &&
                    day.getFullYear() === new Date().getFullYear()
                  const isSelected =
                    selectedDate &&
                    day.getDate() === selectedDate.getDate() &&
                    day.getMonth() === selectedDate.getMonth() &&
                    day.getFullYear() === selectedDate.getFullYear()

                  return (
                    <div
                      key={index}
                      className={`p-2 h-20 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        isToday ? "bg-blue-50 border-blue-200" : ""
                      } ${isSelected ? "bg-blue-100 border-blue-300" : ""}`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="text-sm font-medium">{day.getDate()}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${
                              event.type === "workout"
                                ? event.completed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {event.name}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{selectedDate ? formatDate(selectedDate) : "Select a date"}</CardTitle>
              <CardDescription>
                {selectedEvents.length > 0
                  ? `${selectedEvents.length} event${selectedEvents.length > 1 ? "s" : ""}`
                  : "No events scheduled"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedEvents.map((event) => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{event.name}</h4>
                        <Badge variant={event.type === "workout" ? "default" : "secondary"}>{event.type}</Badge>
                      </div>
                      {event.duration && <p className="text-sm text-gray-600">{event.duration} minutes</p>}
                      {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
                      {event.completed !== undefined && (
                        <Badge variant={event.completed ? "default" : "outline"} className="mt-2">
                          {event.completed ? "Completed" : "Scheduled"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No events on this date</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Click on a date to view events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
