"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DataTable, { type Column } from "@/components/data-table";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicUrl: string | null;
  createdAt: string;
};

export default function UsersTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Hapus user ini? Tindakan tidak bisa dibatalkan.")) return;
    setError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Gagal menghapus user");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  const columns: Column<UserRow>[] = [
    {
      key: "avatar",
      header: "",
      render: (u) =>
        u.profilePicUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.profilePicUrl} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
            {u.name.charAt(0).toUpperCase()}
          </div>
        ),
    },
    {
      key: "name",
      header: "Nama",
      sortable: true,
      sortValue: (u) => u.name.toLowerCase(),
      render: (u) => <span className="font-medium text-gray-900">{u.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      sortValue: (u) => u.email.toLowerCase(),
      render: (u) => <span className="text-gray-600">{u.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      sortValue: (u) => u.role,
      render: (u) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            u.role === "CEO" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          {u.role}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      sortable: true,
      sortValue: (u) => new Date(u.createdAt).getTime(),
      render: (u) => <span className="text-gray-400">{new Date(u.createdAt).toLocaleDateString("id-ID")}</span>,
    },
    {
      key: "aksi",
      header: "Aksi",
      render: (u) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/users/${u.id}`} className="text-sm font-medium text-blue-600 hover:underline">
            Edit
          </Link>
          {u.id !== currentUserId && (
            <button
              onClick={() => handleDelete(u.id)}
              disabled={deletingId === u.id}
              className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
            >
              {deletingId === u.id ? "Menghapus..." : "Hapus"}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Cari nama atau email..."
        searchKeys={(u) => `${u.name} ${u.email}`}
      />
    </div>
  );
}
