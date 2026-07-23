import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  variantName?: string
  sku: string
}

interface CartStore {
  items: CartItem[]
  coupon: string | null
  discount: number
  isOpen: boolean

  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCoupon: (code: string | null) => void
  setIsOpen: (open: boolean) => void

  totalItems: () => number
  subtotal: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discount: 0,
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.variantId === item.variantId)
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }))
        } else {
          set((state) => ({ items: [...state.items, item] }))
        }
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [], coupon: null, discount: 0 }),

      setCoupon: (code) => set({ coupon: code }),
      setIsOpen: (open) => set({ isOpen: open }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      total: () => {
        const subtotal = get().subtotal()
        const discount = get().discount
        return Math.max(0, subtotal - discount)
      },
    }),
    {
      name: "maison-aurelle-cart",
      partialize: (state) => ({ items: state.items, coupon: state.coupon, discount: state.discount }),
    }
  )
)
