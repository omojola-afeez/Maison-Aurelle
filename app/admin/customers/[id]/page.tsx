import { notFound } from "next/navigation"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { CustomerRoleForm } from "@/components/admin/customer-role-form"

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const customer = await prisma.user.findUnique({
    where: { id: (await params).id },
    include: { orders: { orderBy: { createdAt: "desc" } }, addresses: true },
  })

  if (!customer) notFound()

  const totalSpent = customer.orders.reduce((sum, o) => sum + Number(o.total), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">{customer.name || "Guest"}</h1>
        <p className="text-charcoal-500 mt-1">{customer.email} · Joined {formatDate(customer.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-charcoal-100 p-6">
            <h2 className="font-serif text-xl text-emerald mb-4">Orders ({customer.orders.length})</h2>
            {customer.orders.length === 0 ? (
              <p className="text-sm text-charcoal-400">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between py-3 border-b border-charcoal-50 last:border-0 hover:bg-ivory-50 -mx-2 px-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-charcoal-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(Number(order.total))}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-charcoal-100 p-6">
            <h2 className="font-serif text-lg text-emerald mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Total Spent</span>
                <span className="font-medium">{formatPrice(totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Orders</span>
                <span className="font-medium">{customer.orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Current Role</span>
                <span className="font-medium">{customer.role}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-charcoal-100 p-6">
            <h2 className="font-serif text-lg text-emerald mb-4">Change Role</h2>
            <CustomerRoleForm userId={customer.id} role={customer.role} />
          </div>
        </div>
      </div>
    </div>
  )
}
