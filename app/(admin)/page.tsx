import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

async function getDashboardStats() {
  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: { take: 1 } },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { variants: true },
      take: 5,
    }),
  ])

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    lowStockProducts: lowStockProducts.filter((p) =>
      p.variants.some((v) => v.inventory < 10)
    ),
  }
}

export default async function AdminDashboardPage() {
  await requireAdmin()
  const stats = await getDashboardStats()

  const cards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Products",
      value: stats.totalProducts.toString(),
      change: "-2.1%",
      trend: "down",
      icon: Package,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Dashboard</h1>
        <p className="text-charcoal-500 mt-1">
          Welcome back. Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white p-6 border border-charcoal-100">
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-5 h-5 text-emerald" />
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  card.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-medium">{card.value}</p>
            <p className="text-sm text-charcoal-400 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-charcoal-100">
        <div className="p-6 border-b border-charcoal-100">
          <h2 className="font-serif text-xl text-emerald">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Order
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Total
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-charcoal-50 hover:bg-ivory-50">
                  <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-600">{order.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs uppercase tracking-wider font-medium ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts.length > 0 && (
        <div className="bg-white border border-charcoal-100">
          <div className="p-6 border-b border-charcoal-100">
            <h2 className="font-serif text-xl text-emerald">Low Stock Alert</h2>
          </div>
          <div className="p-6 space-y-4">
            {stats.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b border-charcoal-50 last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-charcoal-400">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    {product.variants.reduce((sum, v) => sum + v.inventory, 0)} units left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
