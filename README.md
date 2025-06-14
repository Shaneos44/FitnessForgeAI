# 🏋️ FitnessForge AI

**AI-Powered Personal Fitness Training Platform**

Transform your fitness journey with personalized AI coaching, smart workout generation, and comprehensive progress tracking.

## 🚀 Live Demo
**https://fitnessforgeai.vercel.app**

## ✨ Features

### 🤖 AI-Powered Training
- Personalized workout plan generation
- Real-time AI fitness coach
- Smart exercise recommendations
- Progress-based plan adjustments

### 📊 Comprehensive Tracking
- Workout logging and analytics
- Progress visualization
- Achievement system
- Calendar-based scheduling

### 📱 Device Integration
- Apple Watch sync
- Garmin Connect integration
- Fitbit data import
- Heart rate monitoring

### 👥 Social Features
- Community challenges
- Global leaderboards
- Achievement sharing
- Fitness groups

### 💳 Subscription Plans
- **Basic**: €9.99/month - Essential features
- **Pro**: €19.99/month - Advanced analytics + AI coach
- **Elite**: €39.99/month - Premium features + priority support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project
- Stripe account
- OpenAI API key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/v0-fitness-app-development.git
   cd v0-fitness-app-development
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Fill in your API keys and configuration
   \`\`\`

4. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open http://localhost:3000**

## 🔧 Environment Variables

\`\`\`bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_key

# App Configuration
NEXT_PUBLIC_BASE_URL=https://fitnessforgeai.vercel.app
\`\`\`

## 📦 Deployment

### Deploy to Vercel

1. **Connect GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Configure Stripe webhook**: `https://yourdomain.vercel.app/api/webhooks/stripe`
4. **Deploy!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/v0-fitness-app-development)

## 🧪 Testing

Visit `/setup` after deployment to run production readiness checks.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 📧 Email: support@fitnessforge.ai
- 💬 Discord: [Join our community](https://discord.gg/fitnessforge)
- 📖 Documentation: [docs.fitnessforge.ai](https://docs.fitnessforge.ai)

---

**Built with ❤️ for the fitness community**
\`\`\`

Now let me create a proper package.json with correct repository information:
