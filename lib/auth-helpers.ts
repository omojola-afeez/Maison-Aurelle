"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login?callbackUrl=" + encodeURIComponent("/account"))
  }
  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    redirect("/")
  }
  return user
}
