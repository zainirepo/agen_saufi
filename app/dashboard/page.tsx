import Link from "next/link";
import { prisma } from "@/lib/db";
import OrdersTable from "./orders-table";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Daftar Order</h1>
        <Link
          href="/dashboard/orders/new"
          className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
        >
          + Tambah Order
        </Link>
      </div>

      <div className="rounded border border-gray-200 bg-white p-4 shadow-sm md:p-6">
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
    </div>
  );
}
