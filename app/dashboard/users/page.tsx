import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import UsersTable from "./users-table";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();
  if (session?.user.role !== "CEO") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, profilePicUrl: true, createdAt: true },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Kelola User</h1>
        <Link
          href="/dashboard/users/new"
          className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
        >
          + Tambah User
        </Link>
      </div>

      <div className="rounded border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <UsersTable
          users={users.map((u) => ({
            ...u,
            createdAt: u.createdAt.toISOString(),
          }))}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
