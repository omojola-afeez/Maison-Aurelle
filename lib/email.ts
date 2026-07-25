import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.EMAIL_FROM || "Maison Aurelle <no-reply@maisonaurelle.com>"

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string
  subject: string
  text: string
  replyTo?: string
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email send:", subject)
    return { skipped: true }
  }

  return resend.emails.send({
    from: FROM,
    to,
    subject,
    text,
    replyTo,
  })
}
