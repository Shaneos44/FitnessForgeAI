import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getUserProfile, getUserWorkouts, getUserStats } from "@/lib/database" // Ensure these use real database

export async function POST(request: NextRequest) {
  try {
    const { message, userId, chatHistory } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get user context for personalized coaching from the real database
    const [userProfile, recentWorkouts, userStats] = await Promise.all([
      getUserProfile(userId).catch((e) => {
        console.error("Error fetching user profile for AI coach:", e)
        return null
      }),
      getUserWorkouts(userId, 5).catch((e) => {
        console.error("Error fetching recent workouts for AI coach:", e)
        return []
      }),
      getUserStats(userId).catch((e) => {
        console.error("Error fetching user stats for AI coach:", e)
        return null
      }),
    ])

    // Build context for the AI coach
    const userContext = `
User Profile:
- Name: ${userProfile?.name || "User"}
- Fitness Level: ${userProfile?.fitnessLevel || "Not specified"}
- Goals: ${userProfile?.goals?.join(", ") || "General fitness"}
- Injuries/Limitations: ${userProfile?.injuries?.join(", ") || "None specified"}

Recent Performance:
- Total Workouts: ${userStats?.totalWorkouts || 0}
- Completed Workouts: ${userStats?.completedWorkouts || 0}
- Completion Rate: ${Math.round(userStats?.completionRate || 0)}%
- Recent Workouts: ${
      recentWorkouts.map((w) => `${w.name} (${w.duration} min, ${w.completedAt?.toLocaleDateString()})`).join("; ") ||
      "None recorded"
    }

Chat History Context:
${chatHistory?.map((msg: any) => `${msg.sender}: ${msg.message}`).join("\n") || "No previous context"}
`

    const systemPrompt = `You are an expert AI fitness coach for FitnessForge AI. You provide personalized, encouraging, and scientifically-backed fitness advice.

Key Guidelines:
- Be encouraging and motivational while being realistic
- Provide specific, actionable advice based on the user's profile and performance
- Reference their recent workouts and progress when relevant
- Ask follow-up questions to better understand their needs
- Keep responses conversational but informative
- If they ask about injuries or medical concerns, recommend consulting a healthcare professional
- Focus on sustainable, long-term fitness habits
- Celebrate their achievements and progress

User Context:
${userContext}

Current Message: "${message}"

Respond as their personal AI fitness coach with specific advice tailored to their situation.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: message,
      system: systemPrompt,
      maxTokens: 500,
    })

    // Generate contextual suggestions based on the response
    const suggestions = generateSuggestions(message, text)

    return NextResponse.json({
      response: text,
      suggestions: suggestions,
    })
  } catch (error) {
    console.error("Error in AI coach:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        response: "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}

function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const lowerMessage = userMessage.toLowerCase()
  const lowerResponse = aiResponse.toLowerCase()

  // Generate contextual suggestions based on the conversation
  if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
    return ["Create a workout plan", "Show me exercises", "Track my progress"]
  }

  if (lowerMessage.includes("goal") || lowerMessage.includes("target")) {
    return ["Update my goals", "Track my progress", "What's next?"]
  }

  if (lowerMessage.includes("tired") || lowerMessage.includes("sore") || lowerResponse.includes("recovery")) {
    return ["Plan a rest day", "Recovery tips", "Adjust my plan"]
  }

  if (lowerResponse.includes("plan") || lowerResponse.includes("program")) {
    return ["Generate new plan", "Modify current plan", "Schedule workouts"]
  }

  // Default suggestions
  return ["That's helpful!", "Tell me more", "What should I do next?", "Create a plan"]
}
