import Link from "next/link"
import { requireAuth } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"

export const metadata = {
  title: "My Account | Maison Aurelle",
}

export default async function AccountPage() {
  const user = await requireAuth()

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.address.findMany({ where: { userId: user.id } }),
  ])

  return (
    <div className="luxury-container py-12 md:py-16">
      <h1 className="font-serif text-4xl text-emerald mb-2">My Account</h1>
      <p className="text-charcoal-500 mb-12">{user.email}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-emerald">Order History</h2>
            <Link href="/account/orders" className="text-sm text-emerald hover:underline">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="bg-ivory-100 p-8 text-center">
              <p className="text-charcoal-500 mb-4">You haven't placed any orders yet.</p>
              <Link href="/shop" className="text-emerald hover:underline text-sm">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="border border-charcoal-100 divide-y divide-charcoal-50">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/checkout/confirmation/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-ivory-50"
                >
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-charcoal-400">{formatDate(order.createdAt)} · {order.status}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(Number(order.total))}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl text-emerald mb-4">Saved Addresses</h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-charcoal-400">No saved addresses yet.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div key={address.id} className="border border-charcoal-100 p-4 text-sm">
                    <p className="font-medium">{address.name}</p>
                    <p className="text-charcoal-500">
                      {address.line1}, {address.city}, {address.state} {address.zip}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/wishlist" className="block text-emerald hover:underline text-sm">
            View Wishlist →
          </Link>
        </div>
      </div>
    </div>
  )
}
