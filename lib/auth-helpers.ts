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

/**
 * Same check as requireAdmin(), but for API route handlers: returns null
 * instead of calling redirect() (which throws and isn't meant for routes
 * that need to return a JSON error response).
 */
export async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return null
  }
  return user
}
