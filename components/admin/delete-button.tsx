"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export function AdminDeleteButton({
  url,
  confirmMessage = "Are you sure? This can't be undone.",
  onDeleted,
}: {
  url: string
  confirmMessage?: string
  onDeleted?: () => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch(url, { method: "DELETE" })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Failed to delete")
        }
        toast.success("Deleted")
        onDeleted?.()
        router.refresh()
      } catch (err: any) {
        toast.error(err.message || "Something went wrong")
      } finally {
        setConfirming(false)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title={confirmMessage}
      className={`p-2 transition-colors ${
        confirming ? "text-red-600 bg-red-50" : "hover:text-red-500"
      }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  )
}
