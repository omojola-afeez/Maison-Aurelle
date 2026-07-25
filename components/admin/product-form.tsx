"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Option {
  id: string
  name: string
}

interface ProductFormValues {
  id?: string
  name: string
  slug: string
  description: string
  shortDesc: string
  price: number
  comparePrice: number | null
  sku: string
  status: string
  featured: boolean
  categoryId: string | null
  designerId: string | null
  inventory: number
}

export function ProductForm({
  categories,
  designers,
  initialValues,
}: {
  categories: Option[]
  designers: Option[]
  initialValues?: ProductFormValues
}) {
  const router = useRouter()
  const isEdit = Boolean(initialValues?.id)
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? {
      name: "",
      slug: "",
      description: "",
      shortDesc: "",
      price: 0,
      comparePrice: null,
      sku: "",
      status: "DRAFT",
      featured: false,
      categoryId: null,
      designerId: null,
      inventory: 0,
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = isEdit ? `/api/admin/products/${initialValues!.id}` : "/api/admin/products"
      const method = isEdit ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      toast.success(isEdit ? "Product updated" : "Product created")
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-charcoal-100 p-8 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Name</Label>
          <Input
            required
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>
        <div>
          <Label>Slug (optional, generated from name)</Label>
          <Input
            value={values.slug}
            onChange={(e) => setValues({ ...values, slug: e.target.value })}
            placeholder="auto-generated if left blank"
          />
        </div>
      </div>

      <div>
        <Label>Short Description</Label>
        <Input
          value={values.shortDesc}
          onChange={(e) => setValues({ ...values, shortDesc: e.target.value })}
        />
      </div>

      <div>
        <Label>Description</Label>
        <textarea
          required
          className="w-full border border-charcoal-200 p-4 text-sm min-h-[120px] focus:outline-none focus:border-emerald"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label>Price (USD)</Label>
          <Input
            required
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) => setValues({ ...values, price: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label>Compare-at Price</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={values.comparePrice ?? ""}
            onChange={(e) =>
              setValues({ ...values, comparePrice: e.target.value ? parseFloat(e.target.value) : null })
            }
          />
        </div>
        <div>
          <Label>Inventory</Label>
          <Input
            type="number"
            min="0"
            value={values.inventory}
            onChange={(e) => setValues({ ...values, inventory: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>SKU</Label>
          <Input
            required
            disabled={isEdit}
            value={values.sku}
            onChange={(e) => setValues({ ...values, sku: e.target.value })}
          />
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="w-full h-10 border border-charcoal-200 px-3 text-sm bg-white"
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value })}
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
            <option value="OUT_OF_STOCK">Out of stock</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Category</Label>
          <select
            className="w-full h-10 border border-charcoal-200 px-3 text-sm bg-white"
            value={values.categoryId ?? ""}
            onChange={(e) => setValues({ ...values, categoryId: e.target.value || null })}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Designer</Label>
          <select
            className="w-full h-10 border border-charcoal-200 px-3 text-sm bg-white"
            value={values.designerId ?? ""}
            onChange={(e) => setValues({ ...values, designerId: e.target.value || null })}
          >
            <option value="">None</option>
            {designers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="w-4 h-4 accent-emerald"
          checked={values.featured}
          onChange={(e) => setValues({ ...values, featured: e.target.checked })}
        />
        Featured on homepage
      </label>

      <div className="flex items-center gap-4 pt-4 border-t border-charcoal-100">
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
