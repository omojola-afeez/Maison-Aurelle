import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

async function getCustomers() {
  return prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function AdminCustomersPage() {
  await requireAdmin()
  const customers = await getCustomers()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Customers</h1>
        <p className="text-charcoal-500 mt-1">
          Manage your customer base
        </p>
      </div>

      <div className="bg-white border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-100 bg-ivory-50">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Orders
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Total Spent
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Joined
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-charcoal-400 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-charcoal-50 hover:bg-ivory-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald flex items-center justify-center text-white text-sm font-medium">
                        {customer.name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{customer.name || "Guest"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm">{customer._count.orders}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    ${customer.orders.reduce((sum, o) => sum + Number(o.total), 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal-400">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs uppercase tracking-wider font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
