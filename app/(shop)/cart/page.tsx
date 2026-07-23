"use client"

import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCartStore()

  const shippingCost = subtotal() > 500 ? 0 : 25
  const tax = (subtotal() + shippingCost) * 0.08
  const total = subtotal() + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="luxury-container py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-charcoal-200 mx-auto mb-6" />
        <h1 className="font-serif text-3xl text-emerald mb-4">Your bag is empty</h1>
        <p className="text-charcoal-500 mb-8">Discover our curated collection of luxury pieces.</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="luxury-container py-8 md:py-16">
      <h1 className="font-serif text-3xl text-emerald mb-8">Shopping Bag ({totalItems()})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-6 border border-charcoal-100">
              <div className="relative w-32 h-40 bg-ivory-200 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-1">
                      {item.variantName}
                    </p>
                    <h3 className="font-serif text-lg text-charcoal">{item.name}</h3>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-charcoal-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-medium mb-4">{formatPrice(item.price)}</p>
                <div className="flex items-center border border-charcoal-200 w-fit">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-4 py-2 hover:bg-charcoal-50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-4 py-2 hover:bg-charcoal-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-ivory-100 p-6 h-fit">
          <h2 className="font-serif text-xl text-emerald mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-charcoal-500">Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Shipping</span>
              <span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>
          <Separator className="mb-6" />
          <div className="flex justify-between text-lg font-medium mb-6">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button className="w-full h-14" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <p className="text-xs text-charcoal-400 text-center mt-4">
            Shipping and taxes calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}
