import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Calendar, TrendingUp, Users, Smartphone, Award, Activity, Clock } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Generated Plans",
    description:
      "Advanced AI creates personalized training programs based on your specific goals, fitness level, and available time.",
  },
  {
    icon: Calendar,
    title: "Event-Specific Training",
    description:
      "Specialized programs for marathons, half-marathons, triathlons, Ironman, Hyrox, and other endurance events.",
  },
  {
    icon: TrendingUp,
    title: "Progressive Periodization",
    description: "Smart build, peak, and taper phases that optimize your performance for race day.",
  },
  {
    icon: Activity,
    title: "Workout Variety",
    description: "Diverse training sessions including intervals, tempo runs, strength training, and recovery workouts.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Adapts to your available training days and time constraints while maintaining effectiveness.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Access your training plans anywhere with our responsive design and mobile-friendly interface.",
  },
  {
    icon: Users,
    title: "All Fitness Levels",
    description: "Whether you're a beginner or elite athlete, our AI adapts to your current fitness level.",
  },
  {
    icon: Award,
    title: "Performance Tracking",
    description: "Monitor your progress with detailed analytics and adjust your plan as you improve.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Comprehensive features designed to help athletes of all levels achieve their fitness goals.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-lg bg-blue-50 p-2 w-fit">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-6">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
