import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { requireAdminApi } from "@/lib/auth-helpers"

const roleSchema = z.object({
  role: z.enum(["CUSTOMER", "ADMIN", "MANAGER", "SUPPORT"]),
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
    const parsed = roleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role: parsed.data.role },
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }
    console.error("Update customer error:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}
