"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, User, CreditCard, Dumbbell, Smartphone, Settings, MessageSquare } from "lucide-react"

const categories = [
  { id: "getting-started", name: "Getting Started", icon: User, color: "bg-blue-100 text-blue-600" },
  { id: "training", name: "Training Plans", icon: Dumbbell, color: "bg-green-100 text-green-600" },
  { id: "billing", name: "Billing & Subscriptions", icon: CreditCard, color: "bg-purple-100 text-purple-600" },
  { id: "mobile", name: "Mobile App", icon: Smartphone, color: "bg-orange-100 text-orange-600" },
  { id: "account", name: "Account Settings", icon: Settings, color: "bg-gray-100 text-gray-600" },
  { id: "support", name: "Support", icon: MessageSquare, color: "bg-red-100 text-red-600" },
]

const faqs = [
  {
    category: "getting-started",
    question: "How do I create my first training plan?",
    answer:
      "After signing up, you'll be guided through our onboarding process where you'll provide information about your fitness level, goals, and schedule. Our AI will then generate your personalized training plan automatically.",
  },
  {
    category: "training",
    question: "How often are training plans updated?",
    answer:
      "Training plans are dynamically updated based on your progress, performance data, and feedback. Major adjustments typically happen weekly, while minor tweaks can occur after each workout.",
  },
  {
    category: "billing",
    question: "How much does FitnessForge AI cost?",
    answer:
      "We offer three plans: Basic (€9.99/month), Pro (€19.99/month), and Elite (€39.99/month). All plans include a 14-day free trial.",
  },
  {
    category: "support",
    question: "How can I contact support?",
    answer: "You can reach our support team via email at support@fitnessforge.ai or through our contact form.",
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to common questions and get the support you need</p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5" />
                  <span>All Topics</span>
                </div>
              </button>
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${category.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span>{category.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "all"
                  ? "Frequently Asked Questions"
                  : `${categories.find((c) => c.id === selectedCategory)?.name} FAQ`}
              </h2>
              <Badge variant="outline">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? "result" : "results"}
              </Badge>
            </div>

            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFAQs.map((faq, index) => {
                    const categoryData = categories.find((c) => c.id === faq.category)
                    const IconComponent = categoryData?.icon || HelpCircle
                    return (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded mt-1 ${categoryData?.color || "bg-gray-100 text-gray-600"}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-10 pr-4 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Still need help?</CardTitle>
                <CardDescription>
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/contact"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                  >
                    Contact Support
                  </a>
                  <a
                    href="mailto:support@fitnessforge.ai"
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
                  >
                    Email Us
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
