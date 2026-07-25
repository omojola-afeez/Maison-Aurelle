import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { requireAdminApi } from "@/lib/auth-helpers"
import { slugify } from "@/lib/utils"

const pageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  isPublished: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = pageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const data = parsed.data

    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: slugify(data.slug),
        content: data.content,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        isPublished: data.isPublished,
      },
    })

    return NextResponse.json({ page })
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "A page with that slug already exists" }, { status: 409 })
    }
    console.error("Create page error:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
