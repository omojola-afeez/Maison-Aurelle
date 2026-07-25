import { notFound } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ClearCartOnLoad } from "@/components/checkout/clear-cart-on-load"
import { CheckCircle, Package, Truck } from "lucide-react"

interface ConfirmationPageProps {
  params: Promise<{ orderId: string }>
}

async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })
  return order
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const order = await getOrder((await params).orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="luxury-container py-16 max-w-2xl mx-auto text-center">
      <ClearCartOnLoad shouldClear={Boolean(order.paymentIntentId)} />
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-6" />
        <h1 className="font-serif text-3xl text-emerald mb-4">Thank You for Your Order</h1>
        <p className="text-charcoal-600">
          Your order <span className="font-medium">{order.orderNumber}</span> has been confirmed.
        </p>
      </div>

      <div className="bg-ivory-100 p-8 text-left mb-8">
        <h2 className="font-serif text-xl text-emerald mb-6">Order Details</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-charcoal-400">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium">{formatPrice(Number(item.total))}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-charcoal-200 mt-6 pt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-charcoal-500">Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal-500">Shipping</span>
            <span>{formatPrice(Number(order.shippingTotal))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal-500">Tax</span>
            <span>{formatPrice(Number(order.taxTotal))}</span>
          </div>
          <div className="flex justify-between text-lg font-medium pt-4 border-t border-charcoal-200">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 border border-charcoal-100">
          <Package className="w-6 h-6 text-emerald mx-auto mb-2" />
          <p className="text-sm font-medium">Order Confirmed</p>
          <p className="text-xs text-charcoal-400">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="p-4 border border-charcoal-100">
          <Truck className="w-6 h-6 text-charcoal-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-charcoal-400">Processing</p>
          <p className="text-xs text-charcoal-400">Preparing your order</p>
        </div>
        <div className="p-4 border border-charcoal-100">
          <Package className="w-6 h-6 text-charcoal-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-charcoal-400">Delivered</p>
          <p className="text-xs text-charcoal-400">Estimated 5-7 days</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/account/orders">View Order History</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
