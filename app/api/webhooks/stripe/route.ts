import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { updateUserProfile } from "@/lib/database"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        console.log("Payment successful:", session.id)

        if (session.metadata?.userId) {
          await updateUserProfile(session.metadata.userId, {
            subscriptionStatus: "active",
            subscriptionId: session.subscription,
            customerId: session.customer,
            planType: session.metadata.planType || "pro",
            subscriptionStartDate: new Date(),
            trialEnd: session.subscription ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          })
        }
        break

      case "customer.subscription.created":
        const newSubscription = event.data.object as Stripe.Subscription
        console.log("New subscription created:", newSubscription.id)

        if (newSubscription.metadata?.userId) {
          await updateUserProfile(newSubscription.metadata.userId, {
            subscriptionStatus: newSubscription.status,
            subscriptionId: newSubscription.id,
            planType: newSubscription.metadata.planType || "pro",
            trialEnd: newSubscription.trial_end ? new Date(newSubscription.trial_end * 1000) : null,
          })
        }
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log("Subscription updated:", updatedSubscription.id)

        if (updatedSubscription.metadata?.userId) {
          await updateUserProfile(updatedSubscription.metadata.userId, {
            subscriptionStatus: updatedSubscription.status,
            planType: updatedSubscription.metadata.planType || "pro",
            trialEnd: updatedSubscription.trial_end ? new Date(updatedSubscription.trial_end * 1000) : null,
          })
        }
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log("Subscription cancelled:", deletedSubscription.id)

        if (deletedSubscription.metadata?.userId) {
          await updateUserProfile(deletedSubscription.metadata.userId, {
            subscriptionStatus: "cancelled",
            subscriptionEndDate: new Date(),
          })
        }
        break

      case "invoice.payment_succeeded":
        const successfulInvoice = event.data.object as Stripe.Invoice
        console.log("Payment succeeded:", successfulInvoice.id)

        if (successfulInvoice.subscription && typeof successfulInvoice.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(successfulInvoice.subscription)
          if (subscription.metadata?.userId) {
            await updateUserProfile(subscription.metadata.userId, {
              lastPaymentDate: new Date(),
              subscriptionStatus: "active",
            })
          }
        }
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log("Payment failed:", failedInvoice.id)

        if (failedInvoice.subscription && typeof failedInvoice.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(failedInvoice.subscription)
          if (subscription.metadata?.userId) {
            await updateUserProfile(subscription.metadata.userId, {
              subscriptionStatus: "past_due",
              lastFailedPayment: new Date(),
            })
          }
        }
        break

      case "customer.created":
        const newCustomer = event.data.object as Stripe.Customer
        console.log("New customer created:", newCustomer.id)
        break

      case "invoice.upcoming":
        const upcomingInvoice = event.data.object as Stripe.Invoice
        console.log("Upcoming invoice:", upcomingInvoice.id)
        // Could send email notification here
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
