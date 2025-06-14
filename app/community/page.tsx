"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Heart,
  MessageCircle,
  Share2,
  Trophy,
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"

// Mock community data
const mockCommunityData = {
  challenges: [
    {
      id: 1,
      title: "Summer Shred Challenge",
      description: "30-day fitness challenge to get summer ready",
      participants: 1247,
      daysLeft: 12,
      progress: 60,
      joined: true,
      prize: "$500 gift card",
      category: "Weight Loss",
    },
    {
      id: 2,
      title: "Marathon Training Group",
      description: "16-week marathon preparation program",
      participants: 324,
      daysLeft: 89,
      progress: 25,
      joined: false,
      prize: "Race entry fees",
      category: "Endurance",
    },
    {
      id: 3,
      title: "Strength Building Bootcamp",
      description: "8-week strength and muscle building challenge",
      participants: 856,
      daysLeft: 34,
      progress: 40,
      joined: true,
      prize: "Gym equipment",
      category: "Strength",
    },
  ],
  posts: [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        level: "Advanced",
        followers: 1234,
      },
      content:
        "Just completed my first 10K run! 🏃‍♀️ The training plan from FitnessForge AI was incredible. Went from barely running 2K to finishing strong at 10K in just 8 weeks!",
      image: "/placeholder.svg?height=300&width=500",
      timestamp: "2 hours ago",
      likes: 47,
      comments: 12,
      shares: 5,
      tags: ["10K", "Running", "Achievement"],
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        level: "Intermediate",
        followers: 567,
      },
      content:
        "Week 4 of the Summer Shred Challenge and I'm down 8 pounds! 💪 The nutrition tracking feature has been a game-changer. Who else is crushing their goals?",
      timestamp: "5 hours ago",
      likes: 89,
      comments: 23,
      shares: 8,
      tags: ["WeightLoss", "SummerShred", "Nutrition"],
    },
    {
      id: 3,
      user: {
        name: "Emma Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        level: "Beginner",
        followers: 234,
      },
      content:
        "New to fitness and feeling overwhelmed? Don't be! Started with just 15-minute workouts and now I'm doing full hour sessions. Progress isn't always linear, but consistency is key! 🌟",
      timestamp: "1 day ago",
      likes: 156,
      comments: 34,
      shares: 19,
      tags: ["Beginner", "Motivation", "Consistency"],
    },
  ],
  leaderboard: [
    { rank: 1, name: "Alex Thompson", points: 2847, streak: 45, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 2, name: "Jessica Park", points: 2756, streak: 38, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 3, name: "David Kim", points: 2689, streak: 42, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 4, name: "Lisa Wang", points: 2634, streak: 35, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 5, name: "You", points: 2598, streak: 28, avatar: "/placeholder.svg?height=32&width=32" },
  ],
  groups: [
    {
      id: 1,
      name: "Morning Warriors",
      description: "Early morning workout enthusiasts",
      members: 2341,
      posts: 156,
      category: "Lifestyle",
      joined: true,
    },
    {
      id: 2,
      name: "Plant-Based Athletes",
      description: "Vegan and vegetarian fitness community",
      members: 1876,
      posts: 234,
      category: "Nutrition",
      joined: false,
    },
    {
      id: 3,
      name: "Home Gym Heroes",
      description: "Making the most of home workouts",
      members: 3456,
      posts: 445,
      category: "Equipment",
      joined: true,
    },
  ],
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { challenges, posts, leaderboard, groups } = mockCommunityData

  const handleLike = (postId: number) => {
    // Handle like functionality
    console.log("Liked post:", postId)
  }

  const handleJoinChallenge = (challengeId: number) => {
    // Handle join challenge functionality
    console.log("Joined challenge:", challengeId)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Community</h1>
            <p className="mt-2 text-gray-600">Connect, compete, and achieve your fitness goals together</p>
          </div>

          <Tabs defaultValue="feed" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>

              <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Progress</DialogTitle>
                    <DialogDescription>Share your fitness journey with the community</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Textarea
                      placeholder="What's your fitness win today?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      rows={4}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Handle post creation
                          setShowCreatePost(false)
                          setPostContent("")
                        }}
                      >
                        Share Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="feed" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{post.user.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {post.user.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{post.timestamp}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-900">{post.content}</p>

                        {post.image && (
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt="Post content"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        )}

                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className="flex items-center space-x-1"
                            >
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                              <Share2 className="h-4 w-4" />
                              <span>{post.shares}</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Community Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Followers</span>
                        <span className="font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Following</span>
                        <span className="font-medium">567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Posts</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Challenges Won</span>
                        <span className="font-medium">3</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trending Topics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Trending Topics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {["#SummerShred", "#MarathonTraining", "#PlantBased", "#HomeWorkout", "#MorningMotivation"].map(
                        (topic) => (
                          <div key={topic} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-600">{topic}</span>
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                          </div>
                        ),
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="relative overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{challenge.category}</Badge>
                        {challenge.joined && <Badge className="bg-green-100 text-green-800">Joined</Badge>}
                      </div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{challenge.participants.toLocaleString()} participants</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{challenge.daysLeft} days left</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-gray-500" />
                          <span>{challenge.prize}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span>{challenge.progress}% complete</span>
                        </div>
                      </div>

                      {challenge.joined ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Your Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${challenge.progress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <Button className="w-full" onClick={() => handleJoinChallenge(challenge.id)}>
                          Join Challenge
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Leaderboard</CardTitle>
                  <CardDescription>Top performers this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((user) => (
                      <div
                        key={user.rank}
                        className={`flex items-center space-x-4 p-4 rounded-lg ${
                          user.name === "You" ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                          <span className="text-sm font-bold">#{user.rank}</span>
                        </div>
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.streak} day streak</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{user.points.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search groups..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{group.category}</Badge>
                        {group.joined && <Badge className="bg-green-100 text-green-800">Joined</Badge>}
                      </div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{group.members.toLocaleString()} members</span>
                        <span>{group.posts} posts this week</span>
                      </div>

                      {group.joined ? (
                        <Button variant="outline" className="w-full">
                          View Group
                        </Button>
                      ) : (
                        <Button className="w-full">Join Group</Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
