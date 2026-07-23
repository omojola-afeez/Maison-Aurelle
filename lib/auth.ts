import { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"
import prisma from "@/lib/prisma"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
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
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
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
      const isOnApiAuth = nextUrl.pathname.startsWith("/api/auth")

      if (isOnAdmin) {
        if (isLoggedIn && auth.user.role === "ADMIN") return true
        return false
      }

      if (isOnAccount || isOnCheckout) {
        if (isLoggedIn) return true
        return false
      }

      if (isOnApiAuth) return true

      return true
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      // Log sign-in for analytics
      console.log(`User ${user.email} signed in via ${account?.provider}`)
    },
  },
} as const
