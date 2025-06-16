import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createTrainingPlan } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    console.log("[SERVER] Received plan generation request:", {
      eventType: formData.eventType,
      fitnessLevel: formData.fitnessLevel,
      availableDays: formData.availableDays,
    })

    // Validate required fields
    if (!formData.eventType || !formData.fitnessLevel || !formData.availableDays?.length) {
      return NextResponse.json(
        { error: "Missing required fields", details: "Event type, fitness level, and available days are required" },
        { status: 400 },
      )
    }

    // Calculate weeks until event
    const eventDate = new Date(formData.eventDate)
    const today = new Date()
    const weeksUntilEvent = Math.max(4, Math.ceil((eventDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000)))

    // Generate AI training plan
    const prompt = `Create a detailed ${weeksUntilEvent}-week training plan for a ${formData.fitnessLevel} athlete preparing for a ${formData.eventType}.

Training Details:
- Available days: ${formData.availableDays.join(", ")}
- Session duration: ${formData.timePerSession}
- Current volume: ${formData.currentWeeklyMileage || "Not specified"}
- Previous experience: ${formData.previousEvents || "None specified"}
- Injuries/limitations: ${formData.injuries || "None"}
- Goals: ${formData.goals || "Complete the event"}

Please provide:
1. Weekly structure with specific workouts for each available day
2. Progressive volume increases
3. Key workout types (easy, tempo, intervals, long sessions)
4. Recovery recommendations
5. Taper strategy for the final 2 weeks

Format as a structured training plan with clear weekly breakdowns.`

    let plan = ""

    try {
      if (process.env.OPENAI_API_KEY) {
        console.log("[SERVER] Generating AI plan with OpenAI")
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: prompt,
          maxTokens: 2000,
        })
        plan = text
      } else {
        console.log("[SERVER] No OpenAI API key, using fallback plan")
        throw new Error("No OpenAI API key")
      }
    } catch (error) {
      console.log("[SERVER] Using fallback plan due to error:", error.message)

      // Fallback plan generation
      plan = `# ${formData.eventType} Training Plan (${weeksUntilEvent} weeks)

## Overview
This ${weeksUntilEvent}-week training plan is designed for a ${formData.fitnessLevel} athlete preparing for a ${formData.eventType}.

## Weekly Structure
Training ${formData.availableDays.length} days per week: ${formData.availableDays.join(", ")}

### Weeks 1-4: Base Building
- **Easy Sessions**: 60-70% of training time
- **Moderate Sessions**: 20-25% of training time  
- **Hard Sessions**: 10-15% of training time

### Weeks 5-8: Build Phase
- Increase intensity and volume
- Add race-specific workouts
- Focus on event-specific skills

### Weeks 9-${weeksUntilEvent - 2}: Peak Phase
- Highest training loads
- Race simulation workouts
- Fine-tune race strategy

### Final 2 Weeks: Taper
- Reduce volume by 40-50%
- Maintain intensity with shorter sessions
- Focus on recovery and race preparation

## Key Workout Types
1. **Easy/Recovery**: Conversational pace, builds aerobic base
2. **Tempo**: Comfortably hard, race pace practice
3. **Intervals**: High intensity, improves VO2 max
4. **Long Sessions**: Builds endurance for event distance

## Recovery Guidelines
- Include rest days between hard sessions
- Focus on sleep, nutrition, and hydration
- Listen to your body and adjust as needed

## Notes
- Adjust intensity based on how you feel
- Prioritize consistency over perfection
- Consider working with a coach for personalized guidance`
    }

    console.log("[SERVER] Plan generated successfully")

    // Store the plan in the database (optional, will use mock if DB not available)
    try {
      await createTrainingPlan("demo-user", {
        name: `${formData.eventType} Training Plan`,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        plan: plan,
        weeksUntilEvent: weeksUntilEvent,
        status: "active",
      })
    } catch (dbError) {
      console.log("[SERVER] Database storage failed, continuing without storage:", dbError.message)
    }

    return NextResponse.json({
      success: true,
      plan: plan,
      weeksUntilEvent: weeksUntilEvent,
      message: "Training plan generated successfully",
    })
  } catch (error) {
    console.error("[SERVER] Error generating plan:", error)
    return NextResponse.json(
      {
        error: "Failed to generate plan",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
