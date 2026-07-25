"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import toast from "react-hot-toast"

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    price: number | string | { toString(): string }
    comparePrice?: number | string | { toString(): string } | null
    images: { url: string; alt?: string | null; isPrimary: boolean }[]
    designer?: { name: string } | null
    featured?: boolean
    status?: string
  }
  className?: string
  style?: React.CSSProperties
  initialWishlisted?: boolean
}

export function ProductCard({ product, className, style, initialWishlisted = false }: ProductCardProps) {
  const router = useRouter()
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)
  const [isHovered, setIsHovered] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Prisma returns money fields as Decimal objects, not plain numbers —
  // normalize once here so every usage below is a guaranteed plain number.
  const price = Number(product.price)
  const comparePrice = product.comparePrice != null ? Number(product.comparePrice) : null

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0]
  const discount = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null

  return (
    <div
      className={cn("group relative", className)}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-ivory-200 mb-4 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-charcoal-100">
              <span className="text-charcoal-300 text-sm">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <Badge variant="gold" className="text-[10px]">
                Featured
              </Badge>
            )}
            {discount && (
              <Badge variant="destructive" className="text-[10px]">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Quick Add Button */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm transition-transform duration-500 ease-luxury",
              isHovered ? "translate-y-0" : "translate-y-full"
            )}
          >
            <button
              className="w-full py-3 bg-emerald text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-emerald-600 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                // Add to cart logic
              }}
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          {product.designer && (
            <p className="text-xs text-charcoal-400 uppercase tracking-wider">
              {product.designer.name}
            </p>
          )}
          <h3 className="font-serif text-base text-charcoal group-hover:text-emerald transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{formatPrice(price)}</span>
            {comparePrice && (
              <span className="text-sm text-charcoal-400 line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        className={cn(
          "absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm transition-all duration-300",
          isHovered || isWishlisted ? "opacity-100" : "opacity-0"
        )}
        disabled={isSaving}
        onClick={async (e) => {
          e.preventDefault()
          setIsSaving(true)
          const nextState = !isWishlisted
          setIsWishlisted(nextState) // optimistic
          try {
            const res = await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: product.id }),
            })
            if (res.status === 401) {
              setIsWishlisted(!nextState)
              toast.error("Sign in to save items to your wishlist")
              router.push("/login")
              return
            }
            if (!res.ok) {
              setIsWishlisted(!nextState)
              toast.error("Something went wrong")
            }
          } catch {
            setIsWishlisted(!nextState)
            toast.error("Something went wrong")
          } finally {
            setIsSaving(false)
          }
        }}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isWishlisted ? "fill-red-500 text-red-500" : "text-charcoal"
          )}
        />
      </button>
    </div>
  )
}
