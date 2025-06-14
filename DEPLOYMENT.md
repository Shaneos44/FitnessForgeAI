# 🚀 FitnessForge AI - Vercel Deployment Guide

## Quick Deploy to Vercel

### 1. Deploy to Vercel
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### 2. Set Environment Variables in Vercel Dashboard
Go to your Vercel project → Settings → Environment Variables:

**Required Variables:**
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY = your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_your_publishable_key
STRIPE_SECRET_KEY = sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET = whsec_your_webhook_secret
NEXT_PUBLIC_BASE_URL = https://fitnessforgeai.vercel.app
OPENAI_API_KEY = sk-your_openai_key
\`\`\`

### 3. Configure Stripe Webhook
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://fitnessforgeai.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Test Your Deployment
Visit: `https://fitnessforgeai.vercel.app/setup`

## 🎯 You're Ready for Customers!

Your app will be live at: **https://fitnessforgeai.vercel.app**
\`\`\`

Let me update the base URL in the checkout session:
