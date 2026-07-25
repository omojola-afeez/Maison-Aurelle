import type { NextAuthConfig } from "next-auth"

// This config is intentionally free of anything that needs the Node.js
// runtime (Prisma, bcrypt). It's consumed by middleware.ts, which runs on
// the Edge runtime and can only do a lightweight JWT check. The full
// config with providers and the Prisma adapter lives in lib/auth.ts and
// is used everywhere else (route handlers, server components).
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/register",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      if (trigger === "update" && session) {
        token.name = session.name
        token.image = session.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnAccount = nextUrl.pathname.startsWith("/account")
      const isOnCheckout = nextUrl.pathname.startsWith("/checkout")
      const isOnWishlist = nextUrl.pathname.startsWith("/wishlist")

      if (isOnAdmin) {
        return isLoggedIn && auth.user.role === "ADMIN"
      }

      if (isOnAccount || isOnCheckout || isOnWishlist) {
        return isLoggedIn
      }

      return true
    },
  },
}

export default authConfig
