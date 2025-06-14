import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Target, Calendar } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              AI-Powered Training Plans for Every Athlete{" "}
              <span className="font-semibold text-blue-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Get Started <ArrowRight className="inline h-4 w-4" />
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Personal{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Fitness Coach
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get personalized training plans for marathons, triathlons, Hyrox, and more. Our AI analyzes your fitness
            level, schedule, and goals to create the perfect training program.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 font-semibold">Personalized Plans</h3>
              <p className="mt-2 text-sm text-gray-600">Tailored to your fitness level and goals</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 font-semibold">AI-Powered</h3>
              <p className="mt-2 text-sm text-gray-600">Advanced algorithms optimize your training</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 font-semibold">Adaptive Scheduling</h3>
              <p className="mt-2 text-sm text-gray-600">Fits your busy lifestyle perfectly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
