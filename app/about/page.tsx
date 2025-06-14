import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Heart, Zap, Globe } from "lucide-react"

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Founder & CEO",
    bio: "Former Olympic triathlete and sports scientist with 15+ years in endurance coaching. PhD in Exercise Physiology from Stanford.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Marcus Rodriguez",
    role: "Head of AI Development",
    bio: "Machine learning expert with background in sports analytics. Previously at Google DeepMind working on health applications.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Dr. James Wilson",
    role: "Chief Sports Scientist",
    bio: "Exercise physiologist and former coach to professional endurance athletes. Published researcher in training periodization.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Lisa Thompson",
    role: "Head of Product",
    bio: "Former product manager at Strava with passion for endurance sports. Marathon PR of 2:45 and Ironman finisher.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

const values = [
  {
    icon: Target,
    title: "Science-Based Approach",
    description: "Every training plan is built on proven sports science principles and evidence-based methodologies.",
  },
  {
    icon: Users,
    title: "Athlete-Centered Design",
    description: "We put athletes first, designing every feature based on real needs and feedback from our community.",
  },
  {
    icon: Heart,
    title: "Passion for Performance",
    description: "We're athletes ourselves, driven by the same passion for improvement and achievement as our users.",
  },
  {
    icon: Zap,
    title: "Innovation in Training",
    description: "We leverage cutting-edge AI technology to revolutionize how athletes train and improve.",
  },
  {
    icon: Globe,
    title: "Accessible Excellence",
    description: "Making world-class coaching and training plans accessible to athletes at every level, everywhere.",
  },
  {
    icon: Award,
    title: "Commitment to Results",
    description: "We measure our success by your achievements and are committed to helping you reach your goals.",
  },
]

const stats = [
  { number: "50,000+", label: "Active Athletes" },
  { number: "1M+", label: "Workouts Completed" },
  { number: "15+", label: "Event Types Supported" },
  { number: "98%", label: "User Satisfaction" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Revolutionizing Endurance Training with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Artificial Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to make world-class endurance coaching accessible to every athlete, using the power of AI
            to create personalized training plans that adapt to your life.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p>
                FitnessForge AI was born from a simple frustration: why should world-class training be limited to elite
                athletes with access to expensive coaches? Our founder, Dr. Sarah Chen, experienced this firsthand
                during her Olympic training days.
              </p>
              <p>
                After retiring from competition, Sarah combined her sports science expertise with cutting-edge AI
                technology to democratize personalized coaching. What started as a research project at Stanford became a
                mission to help every endurance athlete reach their potential.
              </p>
              <p>
                Today, we're proud to serve athletes from weekend warriors to Olympic hopefuls, all united by the desire
                to push their limits and achieve their goals. Our AI doesn't replace the human element of coaching—it
                amplifies it, making personalized guidance available to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-blue-100 p-4 w-fit mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Athletes, scientists, and technologists united by a passion for performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600">{member.bio}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-blue-100 mb-8">
            To empower every endurance athlete with personalized, science-based training that adapts to their unique
            goals, schedule, and life circumstances—making world-class coaching accessible to all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Join Our Community
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
