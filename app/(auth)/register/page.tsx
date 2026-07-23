"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { validatePassword } from "@/lib/utils"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "password") {
      const validation = validatePassword(value)
      setPasswordErrors(validation.errors)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const validation = validatePassword(formData.password)
    if (!validation.valid) {
      setError("Please fix password requirements")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
      } else {
        router.push("/login?registered=true")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 border border-charcoal-100 shadow-sm">
      <h1 className="font-serif text-2xl text-emerald mb-2">Create Account</h1>
      <p className="text-sm text-charcoal-500 mb-8">
        Join Maison Aurelle for exclusive access.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-2">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordErrors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {passwordErrors.map((err) => (
                <li key={err} className="text-xs text-red-500">{err}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            className="mt-2"
          />
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" required className="mt-1 accent-emerald" />
          <label className="text-sm text-charcoal-500">
            I agree to the{" "}
            <Link href="/terms" className="text-emerald hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-emerald hover:underline">Privacy Policy</Link>
          </label>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-charcoal-500">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
