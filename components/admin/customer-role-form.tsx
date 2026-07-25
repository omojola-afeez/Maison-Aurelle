"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"

export function CustomerRoleForm({ userId, role }: { userId: string; role: string }) {
  const router = useRouter()
  const [value, setValue] = useState(role)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/customers/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: value }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update customer")
      toast.success("Role updated")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div>
        <label className="text-xs uppercase tracking-wider text-charcoal-400 block mb-2">Role</label>
        <select
          className="h-10 border border-charcoal-200 px-3 text-sm bg-white"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {["CUSTOMER", "SUPPORT", "MANAGER", "ADMIN"].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" isLoading={isLoading} size="sm">
        Save
      </Button>
    </form>
  )
}
