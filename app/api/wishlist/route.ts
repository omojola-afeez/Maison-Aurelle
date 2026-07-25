import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"

const bodySchema = z.object({
  productId: z.string().min(1),
})

// Toggles a product in the current user's wishlist: adds it if absent,
// removes it if present. Returns the resulting wishlisted state.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Please sign in to save items" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const { productId } = parsed.data

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    })

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } })
      return NextResponse.json({ wishlisted: false })
    }

    await prisma.wishlistItem.create({ data: { userId: user.id, productId } })
    return NextResponse.json({ wishlisted: true })
  } catch (error) {
    console.error("Wishlist toggle error:", error)
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 })
  }
}
