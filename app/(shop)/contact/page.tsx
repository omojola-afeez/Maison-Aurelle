"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send message")
      setSent(true)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="luxury-container py-16 max-w-xl mx-auto">
      <h1 className="font-serif text-4xl text-emerald mb-2">Contact Us</h1>
      <p className="text-charcoal-500 mb-12">
        Questions about an order, a piece, or an authentication request — we read every message.
      </p>

      {sent ? (
        <div className="bg-ivory-100 p-8 text-center">
          <p className="font-medium mb-2">Message sent</p>
          <p className="text-charcoal-500 text-sm">We'll get back to you within one business day.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Name</Label>
              <Input required value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                required
                type="email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Subject</Label>
            <Input
              required
              value={values.subject}
              onChange={(e) => setValues({ ...values, subject: e.target.value })}
            />
          </div>
          <div>
            <Label>Message</Label>
            <textarea
              required
              className="w-full border border-charcoal-200 p-4 text-sm min-h-[140px] focus:outline-none focus:border-emerald"
              value={values.message}
              onChange={(e) => setValues({ ...values, message: e.target.value })}
            />
          </div>
          <Button type="submit" isLoading={isLoading}>
            Send Message
          </Button>
        </form>
      )}
    </div>
  )
}
