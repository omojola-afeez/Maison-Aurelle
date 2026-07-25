import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { OrderStatusForm } from "@/components/admin/order-status-form"

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const order = await prisma.order.findUnique({
    where: { id: (await params).id },
    include: { items: true, user: true, transactions: true },
  })

  if (!order) notFound()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">{order.orderNumber}</h1>
        <p className="text-charcoal-500 mt-1">Placed {formatDate(order.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-charcoal-100 p-6">
            <h2 className="font-serif text-xl text-emerald mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-charcoal-50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-charcoal-400">
                      {item.variantName ? `${item.variantName} · ` : ""}SKU {item.sku} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(Number(item.total))}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-charcoal-100 mt-6 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Shipping</span>
                <span>{formatPrice(Number(order.shippingTotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Tax</span>
                <span>{formatPrice(Number(order.taxTotal))}</span>
              </div>
              {Number(order.discountTotal) > 0 && (
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Discount</span>
                  <span>-{formatPrice(Number(order.discountTotal))}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-medium pt-2 border-t border-charcoal-100">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          <OrderStatusForm
            orderId={order.id}
            status={order.status}
            paymentStatus={order.paymentStatus}
            fulfillmentStatus={order.fulfillmentStatus}
            trackingNumber={order.trackingNumber ?? ""}
            carrier={order.carrier ?? ""}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-charcoal-100 p-6">
            <h2 className="font-serif text-lg text-emerald mb-4">Customer</h2>
            <p className="text-sm font-medium">{order.shippingName}</p>
            <p className="text-sm text-charcoal-500">{order.email}</p>
            {order.phone && <p className="text-sm text-charcoal-500">{order.phone}</p>}
          </div>

          <div className="bg-white border border-charcoal-100 p-6">
            <h2 className="font-serif text-lg text-emerald mb-4">Shipping Address</h2>
            <p className="text-sm text-charcoal-600">
              {order.shippingAddress}<br />
              {order.shippingCity}, {order.shippingState} {order.shippingZip}<br />
              {order.shippingCountry}
            </p>
          </div>

          {order.transactions.length > 0 && (
            <div className="bg-white border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg text-emerald mb-4">Transactions</h2>
              <div className="space-y-3">
                {order.transactions.map((t) => (
                  <div key={t.id} className="text-sm">
                    <p className="font-medium">{formatPrice(Number(t.amount))} · {t.type}</p>
                    <p className="text-xs text-charcoal-400">{t.gateway} · {t.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
