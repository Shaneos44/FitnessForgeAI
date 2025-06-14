"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Bot, User, Target, TrendingUp, Calendar, Zap, Heart, Brain } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"

// Mock chat data
const mockChatHistory = [
  {
    id: 1,
    sender: "ai",
    message:
      "Hello! I'm your AI fitness coach. I've analyzed your recent workouts and I'm impressed with your consistency! How are you feeling about your current training plan?",
    timestamp: "10:30 AM",
    suggestions: ["Great!", "Could be better", "I have questions"],
  },
  {
    id: 2,
    sender: "user",
    message: "I'm feeling good but I think I need to work on my endurance. My last few runs felt harder than usual.",
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    sender: "ai",
    message:
      "I noticed that too from your workout data. Your heart rate has been elevated in your target zones, which suggests you might be overtraining slightly. Let me suggest some adjustments:\n\n1. Add one easy recovery run per week\n2. Reduce intensity on 2 of your current runs\n3. Focus on proper sleep (I see you've been logging less than 7 hours)\n\nWould you like me to modify your training plan accordingly?",
    timestamp: "10:33 AM",
    suggestions: ["Yes, modify my plan", "Tell me more about recovery", "What about nutrition?"],
  },
]

const quickActions = [
  { icon: Target, label: "Adjust Goals", description: "Modify your fitness targets" },
  { icon: Calendar, label: "Plan Workouts", description: "Schedule upcoming sessions" },
  { icon: TrendingUp, label: "Review Progress", description: "Analyze your performance" },
  { icon: Heart, label: "Health Check", description: "Assess recovery status" },
  { icon: Zap, label: "Motivation Boost", description: "Get inspired to push harder" },
  { icon: Brain, label: "Learn Something", description: "Fitness tips and education" },
]

const coachInsights = [
  {
    type: "warning",
    title: "Recovery Needed",
    message: "Your last 3 workouts show elevated resting heart rate. Consider a rest day.",
    priority: "high",
  },
  {
    type: "success",
    title: "Consistency Win",
    message: "You've completed 12 workouts in a row! Your discipline is paying off.",
    priority: "medium",
  },
  {
    type: "tip",
    title: "Nutrition Opportunity",
    message: "Your post-workout protein intake could be optimized for better recovery.",
    priority: "low",
  },
]

export default function CoachPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(mockChatHistory)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newUserMessage = {
      id: messages.length + 1,
      sender: "user" as const,
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newUserMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsTyping(true)

    try {
      // Call the real AI API
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          userId: user?.uid,
          chatHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const aiResponse = {
        id: messages.length + 2,
        sender: "ai" as const,
        message: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: data.suggestions || ["That helps!", "Tell me more", "What's next?"],
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorResponse = {
        id: messages.length + 2,
        sender: "ai" as const,
        message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const generateAIResponse = (userMessage: string) => {
    // Simple AI response simulation
    const responses = [
      "That's a great question! Based on your training data, I'd recommend focusing on progressive overload while maintaining proper form.",
      "I understand your concern. Let me analyze your recent performance metrics and suggest some personalized adjustments.",
      "Excellent progress! Your consistency is really showing in your performance improvements. Here's what I suggest for your next phase...",
      "I see you're facing some challenges. Let's break this down and create a strategy that works better for your lifestyle.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickAction = (action: string) => {
    const actionMessage = {
      id: messages.length + 1,
      sender: "user" as const,
      message: `Help me with: ${action}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, actionMessage])
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️"
      case "success":
        return "🎉"
      case "tip":
        return "💡"
      default:
        return "ℹ️"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI Fitness Coach</h1>
            <p className="mt-2 text-gray-600">Get personalized guidance and support for your fitness journey</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>FitnessForge AI Coach</CardTitle>
                      <CardDescription>Your personal fitness assistant</CardDescription>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-800">Online</Badge>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                          >
                            <Avatar className="w-8 h-8">
                              {message.sender === "ai" ? (
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              ) : (
                                <AvatarFallback className="bg-gray-100 text-gray-600">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div
                              className={`space-y-2 ${message.sender === "user" ? "items-end" : "items-start"} flex flex-col`}
                            >
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                              </div>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>

                              {message.suggestions && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {message.suggestions.map((suggestion, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleSuggestionClick(suggestion)}
                                      className="text-xs"
                                    >
                                      {suggestion}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-100 px-4 py-2 rounded-lg">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <Separator />

                  <div className="p-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask your AI coach anything..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common coaching requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleQuickAction(action.label)}
                    >
                      <div className="flex items-start space-x-3">
                        <action.icon className="h-5 w-5 mt-0.5 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">{action.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Coach Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Coach Insights</CardTitle>
                  <CardDescription>Personalized recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {coachInsights.map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(insight.priority)}`}>
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">{getInsightIcon(insight.type)}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Coach Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Coaching Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sessions This Month</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Goals Achieved</span>
                    <span className="font-medium">7/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Streak</span>
                    <span className="font-medium">12 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coach Rating</span>
                    <span className="font-medium">4.9/5 ⭐</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
