"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Watch,
  Heart,
  Activity,
  Wifi,
  WifiOff,
  CheckCircle,
  Bluetooth,
  Battery,
  FolderSyncIcon as Sync,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"

// Mock device data - in production this would come from your backend
const mockDevices = [
  {
    id: "apple-watch-1",
    name: "Apple Watch Series 9",
    type: "smartwatch",
    brand: "Apple",
    connected: true,
    batteryLevel: 85,
    lastSync: "2 minutes ago",
    features: ["Heart Rate", "Steps", "Workouts", "Sleep", "GPS"],
    syncEnabled: true,
  },
  {
    id: "garmin-1",
    name: "Garmin Forerunner 955",
    type: "smartwatch",
    brand: "Garmin",
    connected: false,
    batteryLevel: null,
    lastSync: "Never",
    features: ["Heart Rate", "GPS", "Training Load", "Recovery", "VO2 Max"],
    syncEnabled: false,
  },
  {
    id: "fitbit-1",
    name: "Fitbit Sense 2",
    type: "smartwatch",
    brand: "Fitbit",
    connected: true,
    batteryLevel: 62,
    lastSync: "1 hour ago",
    features: ["Heart Rate", "Steps", "Sleep", "Stress", "SpO2"],
    syncEnabled: true,
  },
]

const mockSyncData = {
  todayStats: {
    steps: 8547,
    heartRate: 72,
    activeMinutes: 45,
    caloriesBurned: 2180,
    workouts: 1,
  },
  recentWorkouts: [
    {
      id: 1,
      name: "Morning Run",
      date: "2024-01-15",
      duration: "32:15",
      heartRate: { avg: 165, max: 182 },
      calories: 420,
      distance: "5.2 km",
      source: "Apple Watch",
    },
    {
      id: 2,
      name: "Strength Training",
      date: "2024-01-14",
      duration: "45:30",
      heartRate: { avg: 135, max: 158 },
      calories: 380,
      distance: null,
      source: "Fitbit Sense 2",
    },
  ],
}

export default function DevicesPage() {
  const { user } = useAuth()
  const [devices, setDevices] = useState(mockDevices)
  const [isScanning, setIsScanning] = useState(false)
  const [syncInProgress, setSyncInProgress] = useState(false)
  const [lastFullSync, setLastFullSync] = useState("15 minutes ago")

  const handleConnectDevice = async (deviceId: string) => {
    setIsScanning(true)

    // Simulate device connection
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, connected: true, lastSync: "Just now", batteryLevel: Math.floor(Math.random() * 40) + 60 }
            : device,
        ),
      )
      setIsScanning(false)
    }, 3000)
  }

  const handleDisconnectDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, connected: false, batteryLevel: null, lastSync: "Disconnected" } : device,
      ),
    )
  }

  const handleToggleSync = (deviceId: string, enabled: boolean) => {
    setDevices((prev) => prev.map((device) => (device.id === deviceId ? { ...device, syncEnabled: enabled } : device)))
  }

  const handleManualSync = async () => {
    setSyncInProgress(true)

    // Simulate sync process
    setTimeout(() => {
      setLastFullSync("Just now")
      setDevices((prev) => prev.map((device) => (device.connected ? { ...device, lastSync: "Just now" } : device)))
      setSyncInProgress(false)
    }, 2000)
  }

  const getDeviceIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "apple":
        return "⌚"
      case "garmin":
        return "🏃"
      case "fitbit":
        return "💪"
      default:
        return "⌚"
    }
  }

  const connectedDevices = devices.filter((d) => d.connected)
  const availableDevices = devices.filter((d) => !d.connected)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Device Integration</h1>
            <p className="mt-2 text-gray-600">Connect and sync your fitness devices for comprehensive tracking</p>
          </div>

          {/* Sync Status */}
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Sync className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <span>
                  Last sync: {lastFullSync} • {connectedDevices.length} devices connected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleManualSync}
                  disabled={syncInProgress}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {syncInProgress ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Sync className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="devices" className="space-y-6">
            <TabsList>
              <TabsTrigger value="devices">My Devices</TabsTrigger>
              <TabsTrigger value="data">Synced Data</TabsTrigger>
              <TabsTrigger value="settings">Sync Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="space-y-6">
              {/* Connected Devices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Connected Devices ({connectedDevices.length})</span>
                  </CardTitle>
                  <CardDescription>Your active fitness devices</CardDescription>
                </CardHeader>
                <CardContent>
                  {connectedDevices.length > 0 ? (
                    <div className="space-y-4">
                      {connectedDevices.map((device) => (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getDeviceIcon(device.brand)}</div>
                            <div>
                              <h4 className="font-medium">{device.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                  <Wifi className="h-3 w-3 text-green-600" />
                                  <span>Connected</span>
                                </span>
                                {device.batteryLevel && (
                                  <span className="flex items-center space-x-1">
                                    <Battery className="h-3 w-3" />
                                    <span>{device.batteryLevel}%</span>
                                  </span>
                                )}
                                <span>Last sync: {device.lastSync}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => handleDisconnectDevice(device.id)}>
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Watch className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No devices connected</p>
                      <p className="text-sm">Connect a device below to start syncing your fitness data</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Devices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bluetooth className="h-5 w-5 text-blue-600" />
                    <span>Available Devices</span>
                  </CardTitle>
                  <CardDescription>Devices you can connect to FitnessForge AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getDeviceIcon(device.brand)}</div>
                          <div>
                            <h4 className="font-medium">{device.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <WifiOff className="h-3 w-3 text-gray-400" />
                              <span>Not connected</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {device.features.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleConnectDevice(device.id)}
                          disabled={isScanning}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isScanning ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Bluetooth className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              {/* Today's Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Steps</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockSyncData.todayStats.steps.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockSyncData.todayStats.heartRate}</div>
                    <p className="text-xs text-muted-foreground">BPM average</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockSyncData.todayStats.activeMinutes}</div>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Calories</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockSyncData.todayStats.caloriesBurned}</div>
                    <p className="text-xs text-muted-foreground">Burned</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Workouts</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockSyncData.todayStats.workouts}</div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Synced Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Synced Workouts</CardTitle>
                  <CardDescription>Workouts automatically imported from your devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSyncData.recentWorkouts.map((workout) => (
                      <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{workout.name}</h4>
                            <Badge variant="outline">{workout.source}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{workout.date}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Duration: {workout.duration}</span>
                            <span>Avg HR: {workout.heartRate.avg} BPM</span>
                            <span>Calories: {workout.calories}</span>
                            {workout.distance && <span>Distance: {workout.distance}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">Synced</div>
                          <div className="text-xs text-gray-500">Max HR: {workout.heartRate.max}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sync Preferences</CardTitle>
                  <CardDescription>Control how your device data is synchronized</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {devices.map((device) => (
                    <div key={device.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{getDeviceIcon(device.brand)}</div>
                          <div>
                            <h4 className="font-medium">{device.name}</h4>
                            <p className="text-sm text-gray-600">{device.connected ? "Connected" : "Not connected"}</p>
                          </div>
                        </div>
                        <Switch
                          checked={device.syncEnabled && device.connected}
                          onCheckedChange={(checked) => handleToggleSync(device.id, checked)}
                          disabled={!device.connected}
                        />
                      </div>

                      {device.connected && device.syncEnabled && (
                        <div className="ml-12 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            {device.features.map((feature) => (
                              <div key={feature} className="flex items-center justify-between">
                                <Label htmlFor={`${device.id}-${feature}`} className="text-sm">
                                  {feature}
                                </Label>
                                <Switch id={`${device.id}-${feature}`} defaultChecked={true} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Auto-Sync Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-sync">Enable automatic sync</Label>
                        <Switch id="auto-sync" defaultChecked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="background-sync">Background sync (when app is closed)</Label>
                        <Switch id="background-sync" defaultChecked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="wifi-only">Sync only on Wi-Fi</Label>
                        <Switch id="wifi-only" defaultChecked={false} />
                      </div>
                    </div>
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
