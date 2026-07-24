"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PageFormValues {
  id?: string
  slug: string
  title: string
  content: string
  metaTitle: string
  metaDesc: string
  isPublished: boolean
}

export function PageForm({ initialValues }: { initialValues?: PageFormValues }) {
  const router = useRouter()
  const isEdit = Boolean(initialValues?.id)
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState<PageFormValues>(
    initialValues ?? {
      slug: "",
      title: "",
      content: "",
      metaTitle: "",
      metaDesc: "",
      isPublished: false,
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = isEdit ? `/api/admin/pages/${initialValues!.id}` : "/api/admin/pages"
      const method = isEdit ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      toast.success(isEdit ? "Page updated" : "Page created")
      router.push("/admin/cms")
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
          <Label>Title</Label>
          <Input required value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} />
        </div>
        <div>
          <Label>Slug (URL path)</Label>
          <Input
            required
            value={values.slug}
            onChange={(e) => setValues({ ...values, slug: e.target.value })}
            placeholder="e.g. about, faqs, privacy"
          />
        </div>
      </div>

      <div>
        <Label>Content</Label>
        <textarea
          required
          className="w-full border border-charcoal-200 p-4 text-sm min-h-[200px] focus:outline-none focus:border-emerald"
          value={values.content}
          onChange={(e) => setValues({ ...values, content: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Meta Title (SEO)</Label>
          <Input value={values.metaTitle} onChange={(e) => setValues({ ...values, metaTitle: e.target.value })} />
        </div>
        <div>
          <Label>Meta Description (SEO)</Label>
          <Input value={values.metaDesc} onChange={(e) => setValues({ ...values, metaDesc: e.target.value })} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="w-4 h-4 accent-emerald"
          checked={values.isPublished}
          onChange={(e) => setValues({ ...values, isPublished: e.target.checked })}
        />
        Published
      </label>

      <div className="flex items-center gap-4 pt-4 border-t border-charcoal-100">
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? "Save Changes" : "Create Page"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/cms")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
