import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react"

async function getDashboardStats() {
  const [productCount, orderCount, customerCount, orders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, orderNumber: true, shippingName: true, total: true, status: true, createdAt: true },
    }),
  ])

  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)

  return { productCount, orderCount, customerCount, revenue, recentOrders }
}

export default async function AdminDashboardPage() {
  await requireAdmin()
  const { productCount, orderCount, customerCount, revenue, recentOrders } = await getDashboardStats()

  const cards = [
    { label: "Revenue (paid orders)", value: formatPrice(revenue), icon: DollarSign },
    { label: "Orders", value: orderCount, icon: ShoppingCart },
    { label: "Products", value: productCount, icon: Package },
    { label: "Customers", value: customerCount, icon: Users },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Dashboard</h1>
        <p className="text-charcoal-500 mt-1">Store overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-charcoal-100 p-6">
            <card.icon className="w-6 h-6 text-emerald mb-4" />
            <p className="text-2xl font-serif text-emerald">{card.value}</p>
            <p className="text-sm text-charcoal-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-charcoal-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-emerald">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-emerald hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-charcoal-400">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between py-3 border-b border-charcoal-50 last:border-0 hover:bg-ivory-50 -mx-2 px-2"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal-400">{order.shippingName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(Number(order.total))}</p>
                  <p className="text-xs text-charcoal-400">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
