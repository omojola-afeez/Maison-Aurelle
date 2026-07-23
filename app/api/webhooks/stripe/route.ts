import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId

        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "PAID",
              status: "CONFIRMED",
            },
          }),
          prisma.transaction.create({
            data: {
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency.toUpperCase(),
              status: "succeeded",
              gateway: "stripe",
              gatewayId: paymentIntent.id,
              type: "capture",
              orderId,
            },
          }),
        ])

        // TODO: Send order confirmation email
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId

        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "FAILED",
            status: "CANCELLED",
          },
        })
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        const order = await prisma.order.findFirst({
          where: { paymentIntentId },
        })

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: charge.refunded ? "REFUNDED" : "PARTIALLY_REFUNDED",
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
