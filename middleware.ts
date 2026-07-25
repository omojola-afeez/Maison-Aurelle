import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Edge-safe: only the authorized() callback runs here, checked against the
// JWT already present on the request. No Prisma, no bcrypt.
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*", "/wishlist/:path*"],
}
