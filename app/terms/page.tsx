export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> December 14, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using FitnessForge AI, you accept and agree to be bound by the terms and provision of
                this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                FitnessForge AI provides AI-powered personalized training plans and fitness coaching services. Our
                platform uses artificial intelligence to create customized workout programs based on your fitness level,
                goals, and preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">As a user of our service, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not share your account with others</li>
                <li>Consult with healthcare professionals before starting any fitness program</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Health and Safety Disclaimer</h2>
              <p className="text-gray-600 mb-4">
                <strong>Important:</strong> FitnessForge AI provides fitness guidance and training plans, but we are not
                medical professionals. Always consult with your doctor before beginning any exercise program, especially
                if you have health concerns or medical conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription and Billing</h2>
              <p className="text-gray-600 mb-4">
                Subscription fees are billed in advance on a monthly or annual basis. You may cancel your subscription
                at any time, but refunds are not provided for partial billing periods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content, features, and functionality of FitnessForge AI are owned by us and are protected by
                copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                FitnessForge AI shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@fitnessforge.ai" className="text-blue-600 hover:underline">
                  legal@fitnessforge.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
