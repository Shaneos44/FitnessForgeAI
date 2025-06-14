import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventDate, fitnessLevel, availableDays, timePerSession, currentWeeklyMileage, goals, injuries } =
      body

    // Validate required fields
    if (!eventType || !eventDate || !fitnessLevel || !availableDays || !timePerSession) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Please fill in all required training plan details",
        },
        { status: 400 },
      )
    }

    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not configured")
      return NextResponse.json(
        {
          error: "AI service not configured",
          details: "Training plan generation is temporarily unavailable",
        },
        { status: 500 },
      )
    }

    // Validate date is in the future
    const targetDate = new Date(eventDate)
    const today = new Date()
    if (targetDate <= today) {
      return NextResponse.json(
        {
          error: "Invalid event date",
          details: "Event date must be in the future",
        },
        { status: 400 },
      )
    }

    // Calculate weeks until event
    const weeksUntilEvent = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7))

    if (weeksUntilEvent < 4) {
      return NextResponse.json(
        {
          error: "Insufficient training time",
          details: "We recommend at least 4 weeks to create an effective training plan",
        },
        { status: 400 },
      )
    }

    const prompt = `Create a personalized ${weeksUntilEvent}-week training plan for a ${eventType} with the following details:

Event Date: ${eventDate} (${weeksUntilEvent} weeks from now)
Fitness Level: ${fitnessLevel}
Available Training Days: ${availableDays.join(", ")} (${availableDays.length} days per week)
Time Per Session: ${timePerSession}
Current Weekly Volume: ${currentWeeklyMileage || "Not specified"}
Goals: ${goals || "Complete the event successfully"}
Injuries/Limitations: ${injuries || "None specified"}

Please create a detailed, week-by-week training plan that includes:

1. **Training Phases**: Clearly define base building, build-up, peak, and taper phases
2. **Weekly Structure**: Specific workouts for each available training day
3. **Progressive Overload**: Gradual increase in volume and intensity
4. **Workout Types**: Mix of easy runs, tempo runs, intervals, long runs, and recovery
5. **Recovery Guidelines**: Rest days and easy week recommendations
6. **Race Strategy**: Pacing and fueling recommendations for event day
7. **Flexibility Notes**: How to adjust if life gets in the way

Format the response with clear headers, bullet points, and weekly breakdowns. Make it actionable and specific to their fitness level and available time.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are an expert endurance coach and exercise physiologist with 20+ years of experience. Create comprehensive, safe, and effective training plans based on scientific principles of periodization and sports science. Always prioritize injury prevention and sustainable progression.",
      maxTokens: 2000,
    })

    if (!text || text.length < 100) {
      throw new Error("Generated plan is too short or empty")
    }

    console.log("Successfully generated training plan for:", eventType, "user fitness level:", fitnessLevel)
    return NextResponse.json({ plan: text })
  } catch (error) {
    console.error("Error generating training plan:", error)

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            error: "AI service authentication failed",
            details: "Please try again later",
          },
          { status: 500 },
        )
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "Service temporarily busy",
            details: "Please try again in a few minutes",
          },
          { status: 429 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Failed to generate training plan",
        details: "Our AI coach is temporarily unavailable. Please try again later.",
      },
      { status: 500 },
    )
  }
}
