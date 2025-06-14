"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Settings, CreditCard, Bell, Save, CheckCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { SubscriptionManager } from "@/components/subscription-manager"
import { getUserProfile, updateUserProfile } from "@/lib/database"

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    fitnessLevel: "",
    goals: "",
    injuries: "",
    preferredWorkoutTime: "",
    notifications: {
      workoutReminders: true,
      progressUpdates: true,
      weeklyReports: true,
      marketingEmails: false,
    },
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const userProfile = await getUserProfile(user.uid)

      if (userProfile) {
        setProfile(userProfile)
        setFormData({
          name: userProfile.name || user.displayName || "",
          email: userProfile.email || user.email || "",
          age: userProfile.age || "",
          fitnessLevel: userProfile.fitnessLevel || "",
          goals: userProfile.goals || "",
          injuries: userProfile.injuries || "",
          preferredWorkoutTime: userProfile.preferredWorkoutTime || "",
          notifications: userProfile.notifications || {
            workoutReminders: true,
            progressUpdates: true,
            weeklyReports: true,
            marketingEmails: false,
          },
        })
      } else {
        // Set defaults for new user
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || "",
          email: user.email || "",
        }))
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      await updateUserProfile(user.uid, formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }))
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-2 text-gray-600">Manage your account and preferences</p>
          </div>

          {saved && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="subscription">
                <CreditCard className="h-4 w-4 mr-2" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and fitness information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="Enter your age"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fitnessLevel">Fitness Level</Label>
                      <Select
                        value={formData.fitnessLevel}
                        onValueChange={(value) => handleInputChange("fitnessLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your fitness level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="elite">Elite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goals">Fitness Goals</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => handleInputChange("goals", e.target.value)}
                      placeholder="Describe your fitness goals..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="injuries">Injuries or Limitations</Label>
                    <Textarea
                      id="injuries"
                      value={formData.injuries}
                      onChange={(e) => handleInputChange("injuries", e.target.value)}
                      placeholder="Any injuries or physical limitations..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Preferences</CardTitle>
                  <CardDescription>Customize your training experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="preferredWorkoutTime">Preferred Workout Time</Label>
                    <Select
                      value={formData.preferredWorkoutTime}
                      onValueChange={(value) => handleInputChange("preferredWorkoutTime", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="early-morning">Early Morning (5-7 AM)</SelectItem>
                        <SelectItem value="morning">Morning (7-10 AM)</SelectItem>
                        <SelectItem value="midday">Midday (10 AM-2 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2-6 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6-9 PM)</SelectItem>
                        <SelectItem value="night">Night (9 PM+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Account Status</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Account Type</span>
                      <Badge variant="secondary">{profile?.subscription?.planType || "Free"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Member Since</span>
                      <span className="text-sm text-gray-600">
                        {profile?.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <SubscriptionManager />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you'd like to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Workout Reminders</h4>
                        <p className="text-sm text-gray-600">Get notified about upcoming workouts</p>
                      </div>
                      <Button
                        variant={formData.notifications.workoutReminders ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleNotificationChange("workoutReminders", !formData.notifications.workoutReminders)
                        }
                      >
                        {formData.notifications.workoutReminders ? "On" : "Off"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Progress Updates</h4>
                        <p className="text-sm text-gray-600">Receive updates about your fitness progress</p>
                      </div>
                      <Button
                        variant={formData.notifications.progressUpdates ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleNotificationChange("progressUpdates", !formData.notifications.progressUpdates)
                        }
                      >
                        {formData.notifications.progressUpdates ? "On" : "Off"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Weekly Reports</h4>
                        <p className="text-sm text-gray-600">Get weekly summaries of your activity</p>
                      </div>
                      <Button
                        variant={formData.notifications.weeklyReports ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNotificationChange("weeklyReports", !formData.notifications.weeklyReports)}
                      >
                        {formData.notifications.weeklyReports ? "On" : "Off"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-gray-600">Receive tips, news, and promotional content</p>
                      </div>
                      <Button
                        variant={formData.notifications.marketingEmails ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleNotificationChange("marketingEmails", !formData.notifications.marketingEmails)
                        }
                      >
                        {formData.notifications.marketingEmails ? "On" : "Off"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
