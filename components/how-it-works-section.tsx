import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Settings, Zap, TrendingUp } from "lucide-react"

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Tell us about your fitness level, training history, and current capabilities.",
  },
  {
    step: 2,
    icon: Settings,
    title: "Set Your Goals",
    description: "Choose your event type, target date, available training days, and specific objectives.",
  },
  {
    step: 3,
    icon: Zap,
    title: "AI Generates Your Plan",
    description: "Our advanced AI creates a personalized training program with build, peak, and taper phases.",
  },
  {
    step: 4,
    icon: TrendingUp,
    title: "Train & Track Progress",
    description: "Follow your plan, log workouts, and watch as the AI adapts to your improving fitness.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How FitnessForge AI Works</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Get started with your personalized training plan in just four simple steps.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.step} className="relative">
                <CardHeader className="text-center">
                  <div className="mx-auto rounded-full bg-blue-600 p-3 w-fit">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm leading-6">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
