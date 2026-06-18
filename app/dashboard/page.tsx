import Link from "next/link";
import { prisma } from "@/lib/db";
import { STATUS_LABEL, STATUS_COLOR } from "@/lib/status";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Daftar Order</h1>
        <Link
          href="/dashboard/orders/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Tambah Order
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Nama Pemesan</th>
              <th className="px-4 py-3">No HP</th>
              <th className="px-4 py-3">Status Bayar</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Dibuat</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Belum ada order.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/orders/${order.id}`} className="font-medium text-blue-600 hover:underline">
                    {order.namaPemesan}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{order.noHp}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLOR[order.statusBayar]}`}>
                    {STATUS_LABEL[order.statusBayar]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {order.fileName ? order.fileName : <span className="text-gray-400">belum ada</span>}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
