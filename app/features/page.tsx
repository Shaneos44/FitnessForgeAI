import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Calendar,
  TrendingUp,
  Users,
  Smartphone,
  Award,
  Activity,
  Clock,
  Target,
  Zap,
  Heart,
  MapPin,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Generated Training Plans",
    description:
      "Advanced machine learning algorithms analyze your fitness level, goals, and schedule to create personalized training programs.",
    benefits: [
      "Personalized to your fitness level",
      "Adapts to your schedule",
      "Evidence-based periodization",
      "Continuous optimization",
    ],
    category: "AI Technology",
  },
  {
    icon: Calendar,
    title: "Event-Specific Training",
    description:
      "Specialized programs designed for specific events including marathons, triathlons, Ironman, Hyrox, and ultra-endurance challenges.",
    benefits: [
      "Marathon training plans",
      "Triathlon periodization",
      "Ultra-endurance preparation",
      "Race-day strategy",
    ],
    category: "Training Programs",
  },
  {
    icon: TrendingUp,
    title: "Progressive Periodization",
    description:
      "Smart training phases that build your fitness systematically with proper build, peak, and taper periods.",
    benefits: ["Base building phase", "Peak performance timing", "Strategic tapering", "Recovery integration"],
    category: "Training Science",
  },
  {
    icon: Activity,
    title: "Workout Variety",
    description:
      "Diverse training sessions including intervals, tempo runs, long runs, strength training, and recovery workouts.",
    benefits: ["Interval training", "Tempo workouts", "Strength sessions", "Recovery protocols"],
    category: "Workout Types",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Training plans that adapt to your available time, whether you have 30 minutes or 3 hours per session.",
    benefits: [
      "Time-efficient workouts",
      "Flexible scheduling",
      "Busy lifestyle adaptation",
      "Weekend warrior options",
    ],
    category: "Flexibility",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Access your training plans anywhere with our responsive design and mobile-friendly interface.",
    benefits: ["Mobile app access", "Offline capability", "GPS integration", "Real-time tracking"],
    category: "Technology",
  },
  {
    icon: Users,
    title: "All Fitness Levels",
    description:
      "Whether you're a complete beginner or elite athlete, our AI adapts to your current fitness level and experience.",
    benefits: ["Beginner-friendly", "Elite athlete support", "Progressive difficulty", "Skill development"],
    category: "Accessibility",
  },
  {
    icon: Award,
    title: "Performance Analytics",
    description:
      "Detailed analytics and progress tracking to monitor your improvements and adjust your training accordingly.",
    benefits: ["Progress tracking", "Performance metrics", "Trend analysis", "Goal achievement"],
    category: "Analytics",
  },
  {
    icon: Target,
    title: "Goal-Oriented Training",
    description:
      "Set specific goals like finish times, distances, or performance metrics and get training plans designed to achieve them.",
    benefits: ["Time-based goals", "Distance targets", "Performance metrics", "Achievement tracking"],
    category: "Goal Setting",
  },
  {
    icon: Heart,
    title: "Heart Rate Training",
    description:
      "Integrate heart rate data to optimize training intensity and ensure you're training in the right zones.",
    benefits: ["HR zone training", "Intensity optimization", "Recovery monitoring", "Fitness assessment"],
    category: "Biometrics",
  },
  {
    icon: MapPin,
    title: "Route Planning",
    description: "Get suggested routes for your training runs based on distance, terrain, and elevation requirements.",
    benefits: ["Route suggestions", "Terrain variety", "Elevation profiles", "Safety considerations"],
    category: "Navigation",
  },
  {
    icon: Zap,
    title: "Real-Time Adaptations",
    description:
      "Your training plan automatically adjusts based on your performance, recovery, and life circumstances.",
    benefits: ["Dynamic adjustments", "Recovery-based planning", "Life integration", "Injury prevention"],
    category: "Adaptability",
  },
]

const categories = ["All", "AI Technology", "Training Programs", "Training Science", "Technology", "Analytics"]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Every Athlete
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the tools and capabilities that make FitnessForge AI the most comprehensive training platform
            for endurance athletes.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-lg bg-blue-50 p-3 w-fit">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of athletes who are already training smarter with AI-powered plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="/demo"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Demo
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
