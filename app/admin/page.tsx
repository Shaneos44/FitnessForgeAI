"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, CreditCard, TrendingUp, Activity, Search, Shield, Eye, Ban, Mail } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"

// Enhanced mock admin data with more realistic metrics
const mockStats = {
  totalUsers: 1247,
  activeSubscriptions: 892,
  monthlyRevenue: 15680,
  totalWorkouts: 8934,
  newUsersThisWeek: 47,
  churnRate: 3.2,
  avgWorkoutsPerUser: 7.2,
  topPlan: "Pro",
}

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    subscriptionStatus: "active",
    planType: "pro",
    joinDate: "2024-01-15",
    lastActive: "2024-06-14",
    totalWorkouts: 45,
    revenue: 19.99,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    subscriptionStatus: "past_due",
    planType: "basic",
    joinDate: "2024-02-20",
    lastActive: "2024-06-13",
    totalWorkouts: 23,
    revenue: 9.99,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    subscriptionStatus: "cancelled",
    planType: "elite",
    joinDate: "2024-03-10",
    lastActive: "2024-06-10",
    totalWorkouts: 67,
    revenue: 0,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    subscriptionStatus: "active",
    planType: "pro",
    joinDate: "2024-04-05",
    lastActive: "2024-06-15",
    totalWorkouts: 32,
    revenue: 19.99,
  },
  {
    id: "5",
    name: "Alex Chen",
    email: "alex@example.com",
    subscriptionStatus: "trialing",
    planType: "pro",
    joinDate: "2024-06-01",
    lastActive: "2024-06-15",
    totalWorkouts: 8,
    revenue: 0,
  },
]

const mockRecentActivity = [
  { type: "user_signup", user: "Emma Davis", timestamp: "2 minutes ago" },
  { type: "subscription_created", user: "Tom Brown", plan: "Pro", timestamp: "15 minutes ago" },
  { type: "workout_completed", user: "Lisa Garcia", workout: "HIIT Training", timestamp: "32 minutes ago" },
  { type: "subscription_cancelled", user: "Mark Taylor", timestamp: "1 hour ago" },
  { type: "user_signup", user: "Rachel Kim", timestamp: "2 hours ago" },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  // Check if user is admin
  const isAdmin = user?.email === "admin@fitnessforge.ai" || user?.email?.includes("admin")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.subscriptionStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "trialing":
        return "bg-blue-100 text-blue-800"
      case "past_due":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_signup":
        return <Users className="h-4 w-4 text-green-600" />
      case "subscription_created":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      case "workout_completed":
        return <Activity className="h-4 w-4 text-purple-600" />
      case "subscription_cancelled":
        return <Ban className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const handleUserAction = (action: string, userId: string) => {
    console.log(`Admin action: ${action} for user ${userId}`)
    // In real app, this would make API calls
    alert(`Action "${action}" would be performed for user ${userId}`)
  }

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Alert className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription>Access denied. You don't have permission to view the admin dashboard.</AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage users, subscriptions, and monitor app performance</p>
          </div>

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{mockStats.newUsersThisWeek} this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activeSubscriptions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{mockStats.churnRate}% churn rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalWorkouts.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{mockStats.avgWorkoutsPerUser} avg per user</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Enhanced Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search users by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="trialing">Trialing</SelectItem>
                        <SelectItem value="past_due">Past Due</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Enhanced Users Table */}
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">{user.totalWorkouts} workouts</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                Joined {new Date(user.joinDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge className={getStatusColor(user.subscriptionStatus)}>{user.subscriptionStatus}</Badge>
                            <p className="text-sm text-gray-600 mt-1">{user.planType} plan</p>
                            <p className="text-xs text-gray-500">${user.revenue}/month</p>
                          </div>
                          <div className="flex space-x-2">
                            <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
                                  <DialogDescription>Detailed information and actions for this user</DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Account Information</h4>
                                        <div className="space-y-2 text-sm">
                                          <p>
                                            <strong>Email:</strong> {selectedUser.email}
                                          </p>
                                          <p>
                                            <strong>Join Date:</strong>{" "}
                                            {new Date(selectedUser.joinDate).toLocaleDateString()}
                                          </p>
                                          <p>
                                            <strong>Last Active:</strong>{" "}
                                            {new Date(selectedUser.lastActive).toLocaleDateString()}
                                          </p>
                                          <p>
                                            <strong>Status:</strong>
                                            <Badge
                                              className={`ml-2 ${getStatusColor(selectedUser.subscriptionStatus)}`}
                                            >
                                              {selectedUser.subscriptionStatus}
                                            </Badge>
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium mb-2">Usage Statistics</h4>
                                        <div className="space-y-2 text-sm">
                                          <p>
                                            <strong>Plan:</strong> {selectedUser.planType}
                                          </p>
                                          <p>
                                            <strong>Total Workouts:</strong> {selectedUser.totalWorkouts}
                                          </p>
                                          <p>
                                            <strong>Monthly Revenue:</strong> ${selectedUser.revenue}
                                          </p>
                                          <p>
                                            <strong>Engagement:</strong> High
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex space-x-2 pt-4 border-t">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUserAction("send_email", selectedUser.id)}
                                      >
                                        <Mail className="h-4 w-4 mr-1" />
                                        Send Email
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUserAction("reset_password", selectedUser.id)}
                                      >
                                        Reset Password
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUserAction("suspend_account", selectedUser.id)}
                                      >
                                        <Ban className="h-4 w-4 mr-1" />
                                        Suspend
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pro Plan</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Basic Plan</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Elite Plan</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">MRR</span>
                        <span className="font-medium">$15,680</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ARPU</span>
                        <span className="font-medium">$17.58</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">LTV</span>
                        <span className="font-medium">$421</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Churn Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly Churn</span>
                        <span className="font-medium">3.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Retention Rate</span>
                        <span className="font-medium">96.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Lifetime</span>
                        <span className="font-medium">24 months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>App Analytics</CardTitle>
                  <CardDescription>User engagement and workout completion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Workout Completion Rates</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">HIIT Workouts</span>
                          <span className="font-medium">87%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Strength Training</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Yoga Sessions</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Running</span>
                          <span className="font-medium">85%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">User Engagement</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Daily Active Users</span>
                          <span className="font-medium">1,247</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Weekly Active Users</span>
                          <span className="font-medium">3,891</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Avg Session Duration</span>
                          <span className="font-medium">47 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Feature Adoption</span>
                          <span className="font-medium">73%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Real-time platform activity and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm">
                            <strong>{activity.user}</strong> {activity.type.replace("_", " ")}
                            {activity.plan && ` (${activity.plan})`}
                            {activity.workout && ` - ${activity.workout}`}
                          </p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
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
