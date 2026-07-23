import { requireAdmin } from "@/lib/auth-helpers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Tag,
  FileText,
  Megaphone,
} from "lucide-react"

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/cms", label: "CMS", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 z-30 h-full w-64 bg-white border-r border-charcoal-100">
        <div className="p-6 border-b border-charcoal-100">
          <Link href="/admin" className="font-serif text-xl text-emerald">
            Maison Aurelle
          </Link>
          <p className="text-xs text-charcoal-400 mt-1">Admin Dashboard</p>
        </div>
        <nav className="p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors",
                "text-charcoal-600 hover:bg-ivory-100 hover:text-emerald"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-charcoal-100">
          <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-full bg-emerald flex items-center justify-center text-white text-xs font-medium">
              {user.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name || "Admin"}</p>
              <p className="text-xs text-charcoal-400">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  )
}
