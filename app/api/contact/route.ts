import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendEmail } from "@/lib/email"

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(5),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }
    const { name, email, subject, message } = parsed.data

    await sendEmail({
      to: process.env.CONTACT_INBOX_EMAIL || "hello@maisonaurelle.com",
      subject: `[Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
