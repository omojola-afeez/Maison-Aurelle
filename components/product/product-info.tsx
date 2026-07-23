"use client"

import { useState } from "react"
import { formatPrice, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Truck, Shield, RotateCcw, Star } from "lucide-react"

interface ProductInfoProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    comparePrice?: number | null
    sku: string
    designer?: { name: string } | null
    category?: { name: string } | null
    variants: {
      id: string
      sku: string
      price?: number | null
      inventory: number
      options: { name: string; value: string }[]
    }[]
    reviews: { rating: number }[]
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)

  const averageRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : null

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : null

  // Group options by name
  const optionGroups = product.variants.reduce((groups, variant) => {
    variant.options.forEach((opt) => {
      if (!groups[opt.name]) groups[opt.name] = new Set()
      groups[opt.name].add(opt.value)
    })
    return groups
  }, {} as Record<string, Set<string>>)

  const currentPrice = selectedVariant?.price ?? product.price

  return (
    <div className="space-y-6">
      {/* Designer & Category */}
      <div className="flex items-center gap-3">
        {product.designer && (
          <Badge variant="outline" className="text-xs">
            {product.designer.name}
          </Badge>
        )}
        {product.category && (
          <span className="text-xs text-charcoal-400 uppercase tracking-wider">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl md:text-4xl text-emerald leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      {averageRating && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= Number(averageRating)
                    ? "fill-champagne text-champagne"
                    : "text-charcoal-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-charcoal-500">
            {averageRating} ({product.reviews.length} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-medium">{formatPrice(currentPrice)}</span>
        {product.comparePrice && (
          <span className="text-lg text-charcoal-400 line-through">
            {formatPrice(product.comparePrice)}
          </span>
        )}
        {discount && (
          <Badge variant="destructive" className="text-xs">
            Save {discount}%
          </Badge>
        )}
      </div>

      <Separator />

      {/* Variant Selection */}
      {Object.entries(optionGroups).map(([name, values]) => (
        <div key={name}>
          <label className="text-xs uppercase tracking-[0.15em] text-charcoal-600 mb-3 block">
            {name}
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => {
              const isSelected = selectedVariant?.options.some(
                (o) => o.name === name && o.value === value
              )
              return (
                <button
                  key={value}
                  onClick={() => {
                    const variant = product.variants.find((v) =>
                      v.options.some((o) => o.name === name && o.value === value)
                    )
                    if (variant) setSelectedVariant(variant)
                  }}
                  className={cn(
                    "px-4 py-2 text-sm border transition-all duration-300",
                    isSelected
                      ? "border-emerald bg-emerald text-white"
                      : "border-charcoal-200 hover:border-emerald text-charcoal"
                  )}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Quantity */}
      <div>
        <label className="text-xs uppercase tracking-[0.15em] text-charcoal-600 mb-3 block">
          Quantity
        </label>
        <div className="flex items-center border border-charcoal-200 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 hover:bg-charcoal-50 transition-colors"
          >
            -
          </button>
          <span className="px-4 py-3 min-w-[3rem] text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-3 hover:bg-charcoal-50 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex gap-4">
        <Button
          className="flex-1 h-14 text-xs uppercase tracking-[0.15em]"
          disabled={!selectedVariant || selectedVariant.inventory === 0}
        >
          {selectedVariant?.inventory === 0 ? "Out of Stock" : "Add to Bag"}
        </Button>
        <Button variant="outline" className="h-14 w-14 p-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </Button>
      </div>

      {/* SKU */}
      <p className="text-xs text-charcoal-400">SKU: {selectedVariant?.sku || product.sku}</p>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <Truck className="w-5 h-5 mx-auto mb-2 text-emerald" />
          <p className="text-xs text-charcoal-500">Free Shipping $500+</p>
        </div>
        <div className="text-center">
          <Shield className="w-5 h-5 mx-auto mb-2 text-emerald" />
          <p className="text-xs text-charcoal-500">Authenticity Guaranteed</p>
        </div>
        <div className="text-center">
          <RotateCcw className="w-5 h-5 mx-auto mb-2 text-emerald" />
          <p className="text-xs text-charcoal-500">30-Day Returns</p>
        </div>
      </div>
    </div>
  )
}
