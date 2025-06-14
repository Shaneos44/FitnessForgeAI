"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft } from "lucide-react"

const eventTypes = [
  "5K Run",
  "10K Run",
  "Half Marathon",
  "Marathon",
  "Sprint Triathlon",
  "Olympic Triathlon",
  "Half Ironman",
  "Ironman",
  "Hyrox",
  "Spartan Race",
  "Ultra Marathon",
  "Cycling Century",
  "Other",
]

const fitnessLevels = [
  "Beginner (New to training)",
  "Recreational (1-2 years experience)",
  "Intermediate (3-5 years experience)",
  "Advanced (5+ years experience)",
  "Elite (Competitive athlete)",
]

const trainingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    fitnessLevel: "",
    eventType: "",
    eventDate: "",
    currentWeeklyMileage: "",
    availableDays: [] as string[],
    timePerSession: "",
    previousEvents: "",
    injuries: "",
    goals: "",
  })
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Generate AI training plan and save user data
      setLoading(true)
      try {
        // Generate AI training plan
        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const { plan } = await response.json()

          // Store plan in localStorage for demo
          localStorage.setItem(
            "userProfile",
            JSON.stringify({
              ...formData,
              onboardingCompleted: true,
            }),
          )

          localStorage.setItem(
            "trainingPlan",
            JSON.stringify({
              plan,
              eventType: formData.eventType,
              eventDate: formData.eventDate,
              status: "active",
            }),
          )

          router.push("/dashboard?welcome=true")
        } else {
          throw new Error("Failed to generate plan")
        }
      } catch (error) {
        console.error("Error completing onboarding:", error)
        // Still redirect to dashboard even if plan generation fails
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                placeholder="Enter your age"
              />
            </div>

            <div>
              <Label htmlFor="fitnessLevel">Current Fitness Level</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, fitnessLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  {fitnessLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentMileage">Current Weekly Training Volume</Label>
              <Input
                id="currentMileage"
                value={formData.currentWeeklyMileage}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentWeeklyMileage: e.target.value }))}
                placeholder="e.g., 20 miles/week, 5 hours/week"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventType">Target Event</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, eventType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target event" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((event) => (
                    <SelectItem key={event} value={event}>
                      {event}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, eventDate: e.target.value }))}
              />
            </div>

            <div>
              <Label>Available Training Days</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {trainingDays.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.availableDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label htmlFor={day} className="text-sm">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="timePerSession">Time Available Per Session</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, timePerSession: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time per session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
                  <SelectItem value="45-60 minutes">45-60 minutes</SelectItem>
                  <SelectItem value="60-90 minutes">60-90 minutes</SelectItem>
                  <SelectItem value="90+ minutes">90+ minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="previousEvents">Previous Events/Experience</Label>
              <Textarea
                id="previousEvents"
                value={formData.previousEvents}
                onChange={(e) => setFormData((prev) => ({ ...prev, previousEvents: e.target.value }))}
                placeholder="Tell us about your previous races or training experience..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="injuries">Current Injuries or Limitations</Label>
              <Textarea
                id="injuries"
                value={formData.injuries}
                onChange={(e) => setFormData((prev) => ({ ...prev, injuries: e.target.value }))}
                placeholder="Any injuries, physical limitations, or areas of concern..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="goals">Specific Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
                placeholder="What do you want to achieve? (e.g., finish time, complete the event, personal best...)"
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Let's Get You Started</h1>
          <p className="mt-2 text-gray-600">Tell us about yourself so we can create the perfect training plan</p>

          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= step ? "bg-blue-600" : "bg-gray-300"}`} />
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Step {step} of 3:{" "}
              {step === 1 ? "Personal Information" : step === 2 ? "Training Preferences" : "Goals & Experience"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your current fitness level"}
              {step === 2 && "Set up your training schedule and preferences"}
              {step === 3 && "Share your goals and any special considerations"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button onClick={handleNext} disabled={loading}>
                {loading ? "Creating Your Plan..." : step === 3 ? "Create My Plan" : "Next"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
