"use client"

import { useEffect } from "react"
import { useCartStore } from "@/stores/cart-store"

export function ClearCartOnLoad({ shouldClear }: { shouldClear: boolean }) {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    if (shouldClear) {
      clearCart()
    }
    // Only ever needs to run once, on mount, for whatever the order's
    // status was when the page first loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
