import Link from "next/link"
import { requireAuth } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"

export const metadata = {
  title: "Order History | Maison Aurelle",
}

export default async function AccountOrdersPage() {
  const user = await requireAuth()

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  })

  return (
    <div className="luxury-container py-12 md:py-16">
      <h1 className="font-serif text-4xl text-emerald mb-2">Order History</h1>
      <p className="text-charcoal-500 mb-12">{orders.length} order{orders.length === 1 ? "" : "s"}</p>

      {orders.length === 0 ? (
        <div className="bg-ivory-100 p-8 text-center">
          <p className="text-charcoal-500 mb-4">You haven't placed any orders yet.</p>
          <Link href="/shop" className="text-emerald hover:underline text-sm">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/checkout/confirmation/${order.id}`}
              className="block border border-charcoal-100 p-6 hover:bg-ivory-50"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">{order.orderNumber}</p>
                <span className="text-xs uppercase tracking-wider text-charcoal-400">{order.status}</span>
              </div>
              <p className="text-sm text-charcoal-500 mb-3">
                {formatDate(order.createdAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
              </p>
              <p className="text-sm font-medium">{formatPrice(Number(order.total))}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
