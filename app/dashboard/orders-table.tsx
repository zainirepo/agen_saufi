"use client";

import Link from "next/link";
import DataTable, { type Column } from "@/components/data-table";
import { STATUS_LABEL, STATUS_COLOR } from "@/lib/status";

type Order = {
  id: string;
  namaPemesan: string;
  noHp: string;
  statusBayar: string;
  fileName: string | null;
  createdAt: string;
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const columns: Column<Order>[] = [
    {
      key: "namaPemesan",
      header: "Nama Pemesan",
      sortable: true,
      sortValue: (o) => o.namaPemesan.toLowerCase(),
      render: (o) => (
        <Link href={`/dashboard/orders/${o.id}`} className="font-medium text-blue-600 hover:underline">
          {o.namaPemesan}
        </Link>
      ),
    },
    {
      key: "noHp",
      header: "No HP",
      sortable: true,
      sortValue: (o) => o.noHp,
      render: (o) => <span className="text-gray-600">{o.noHp}</span>,
    },
    {
      key: "statusBayar",
      header: "Status Bayar",
      sortable: true,
      sortValue: (o) => o.statusBayar,
      render: (o) => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLOR[o.statusBayar]}`}>
          {STATUS_LABEL[o.statusBayar]}
        </span>
      ),
    },
    {
      key: "fileName",
      header: "File",
      render: (o) =>
        o.fileName ? (
          <span className="text-gray-600">{o.fileName}</span>
        ) : (
          <span className="text-gray-400">belum ada</span>
        ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      sortable: true,
      sortValue: (o) => new Date(o.createdAt).getTime(),
      render: (o) => <span className="text-gray-400">{new Date(o.createdAt).toLocaleDateString("id-ID")}</span>,
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      searchPlaceholder="Cari nama atau no HP..."
      searchKeys={(o) => `${o.namaPemesan} ${o.noHp}`}
    />
  );
}
