"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    price: number
    comparePrice?: number | null
    images: { url: string; alt?: string | null; isPrimary: boolean }[]
    designer?: { name: string } | null
    featured?: boolean
    status?: string
  }
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0]
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  return (
    <div
      className={cn("group relative", className)}
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
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-sm text-charcoal-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        className={cn(
          "absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => {
          e.preventDefault()
          setIsWishlisted(!isWishlisted)
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
