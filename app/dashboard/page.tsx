import Link from "next/link";
import { prisma } from "@/lib/db";
import OrdersTable from "./orders-table";

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

      <OrdersTable
        orders={orders.map((o) => ({
          id: o.id,
          namaPemesan: o.namaPemesan,
          noHp: o.noHp,
          statusBayar: o.statusBayar,
          fileName: o.fileName,
          createdAt: o.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
