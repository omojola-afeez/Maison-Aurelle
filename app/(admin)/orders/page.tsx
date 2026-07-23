import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"

async function getOrders() {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })
}

export default async function AdminOrdersPage() {
  await requireAdmin()
  const orders = await getOrders()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Orders</h1>
        <p className="text-charcoal-500 mt-1">
          Manage and fulfill customer orders
        </p>
      </div>

      <div className="bg-white border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-ivory-50">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Order
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Items
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Total
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Payment
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-charcoal-50 hover:bg-ivory-50">
                  <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">
                    <p>{order.shippingName}</p>
                    <p className="text-charcoal-400 text-xs">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs uppercase tracking-wider font-medium ${
                        order.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.paymentStatus === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
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
                  <td className="px-6 py-4 text-sm text-charcoal-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
