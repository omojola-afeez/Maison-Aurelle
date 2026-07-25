import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { requireAdminApi } from "@/lib/auth-helpers"
import { slugify } from "@/lib/utils"

const productUpdateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "OUT_OF_STOCK"]),
  featured: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  designerId: z.string().optional().nullable(),
  inventory: z.coerce.number().int().min(0).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = productUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const data = parsed.data

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug ? slugify(data.slug) : undefined,
        description: data.description,
        shortDesc: data.shortDesc,
        price: data.price,
        comparePrice: data.comparePrice ?? null,
        status: data.status,
        featured: data.featured,
        categoryId: data.categoryId || null,
        designerId: data.designerId || null,
      },
      include: { variants: true },
    })

    if (data.inventory !== undefined && product.variants[0]) {
      await prisma.productVariant.update({
        where: { id: product.variants[0].id },
        data: { inventory: data.inventory },
      })
    }

    return NextResponse.json({ product })
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === "P2003" || error?.code === "P2014") {
      return NextResponse.json(
        { error: "Can't delete a product with existing orders. Archive it instead." },
        { status: 409 }
      )
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
