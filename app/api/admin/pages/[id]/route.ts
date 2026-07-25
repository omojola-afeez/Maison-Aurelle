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
    const parsed = pageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const data = parsed.data

    const page = await prisma.page.update({
      where: { id: (await params).id },
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
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "A page with that slug already exists" }, { status: 409 })
    }
    console.error("Update page error:", error)
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    await prisma.page.delete({ where: { id: (await params).id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }
    console.error("Delete page error:", error)
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}
