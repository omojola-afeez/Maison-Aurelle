import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { requireAdminApi } from "@/lib/auth-helpers"

const orderUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]),
  paymentStatus: z.enum(["PENDING", "AUTHORIZED", "PAID", "PARTIALLY_REFUNDED", "REFUNDED", "FAILED"]),
  fulfillmentStatus: z.enum(["UNFULFILLED", "PARTIALLY_FULFILLED", "FULFILLED", "RETURNED"]),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = orderUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const data = parsed.data

    const order = await prisma.order.update({
      where: { id: (await params).id },
      data: {
        status: data.status,
        paymentStatus: data.paymentStatus,
        fulfillmentStatus: data.fulfillmentStatus,
        trackingNumber: data.trackingNumber || null,
        carrier: data.carrier || null,
        shippedAt: data.status === "SHIPPED" ? new Date() : undefined,
        deliveredAt: data.status === "DELIVERED" ? new Date() : undefined,
      },
    })

    return NextResponse.json({ order })
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    console.error("Update order error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
