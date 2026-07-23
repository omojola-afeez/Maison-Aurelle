import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { generateOrderNumber } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()
    const { items, shippingAddress, couponCode } = body

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )

    // Apply coupon if provided
    let discount = 0
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true },
      })
      if (coupon && new Date() >= coupon.startsAt && (!coupon.expiresAt || new Date() <= coupon.expiresAt)) {
        if (coupon.type === "percentage") {
          discount = (subtotal * Number(coupon.value)) / 100
          if (coupon.maxDiscount) {
            discount = Math.min(discount, Number(coupon.maxDiscount))
          }
        } else if (coupon.type === "fixed_amount") {
          discount = Number(coupon.value)
        }
      }
    }

    const shippingTotal = subtotal > 500 ? 0 : 25
    const taxTotal = (subtotal - discount) * 0.08 // 8% tax
    const total = subtotal + shippingTotal + taxTotal - discount

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: "PENDING",
        paymentStatus: "PENDING",
        fulfillmentStatus: "UNFULFILLED",
        subtotal,
        taxTotal,
        shippingTotal,
        discountTotal: discount,
        total,
        currency: "USD",
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        shippingName: shippingAddress.name,
        shippingAddress: shippingAddress.line1,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingZip: shippingAddress.zip,
        shippingCountry: shippingAddress.country || "US",
        userId: session?.user?.id,
        items: {
          create: items.map((item: { name: string; variantName?: string; sku: string; price: number; quantity: number; image?: string }) => ({
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            productName: item.name,
            variantName: item.variantName,
            sku: item.sku,
            image: item.image,
          })),
        },
      },
    })

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      automatic_payment_methods: { enabled: true },
    })

    // Update order with payment intent
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: paymentIntent.id },
    })

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      clientSecret: paymentIntent.client_secret,
      total,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
