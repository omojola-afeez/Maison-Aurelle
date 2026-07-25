import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { requireAdminApi } from "@/lib/auth-helpers"
import { slugify } from "@/lib/utils"

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  sku: z.string().min(1),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "OUT_OF_STOCK"]).default("DRAFT"),
  featured: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  designerId: z.string().optional().nullable(),
  inventory: z.coerce.number().int().min(0).default(0),
})

export async function POST(req: NextRequest) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const data = parsed.data
    const slug = data.slug ? slugify(data.slug) : slugify(data.name)

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDesc: data.shortDesc,
        price: data.price,
        comparePrice: data.comparePrice ?? null,
        sku: data.sku,
        status: data.status,
        featured: data.featured,
        categoryId: data.categoryId || null,
        designerId: data.designerId || null,
        variants: {
          create: [{ sku: `${data.sku}-DEFAULT`, inventory: data.inventory }],
        },
      },
    })

    return NextResponse.json({ product })
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A product with that slug or SKU already exists" },
        { status: 409 }
      )
    }
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
