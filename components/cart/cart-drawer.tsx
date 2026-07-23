"use client"

import { useCartStore } from "@/stores/cart-store"
import { formatPrice, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, totalItems } = useCartStore()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-800/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-luxury",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-charcoal-100">
            <h2 className="font-serif text-xl text-emerald">
              Shopping Bag ({totalItems()})
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:text-emerald transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-charcoal-200 mb-4" />
                <p className="font-serif text-lg text-charcoal mb-2">Your bag is empty</p>
                <p className="text-sm text-charcoal-400 mb-6">
                  Discover our curated collection of luxury pieces.
                </p>
                <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-24 h-32 bg-ivory-200 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-1">
                      {item.variantName}
                    </p>
                    <h3 className="font-serif text-sm text-charcoal mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm font-medium mb-3">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-charcoal-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-charcoal-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-sm min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-charcoal-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-charcoal-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-charcoal-100 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal())}</span>
              </div>
              <p className="text-xs text-charcoal-400">
                Shipping and taxes calculated at checkout.
              </p>
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-14">Proceed to Checkout</Button>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-charcoal-600 hover:text-emerald transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
