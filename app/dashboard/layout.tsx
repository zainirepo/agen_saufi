import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <nav className="flex items-center gap-5">
          <Link href="/dashboard" className="font-semibold text-gray-900">
            agen_saufi
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Order
          </Link>
          {session?.user?.role === "CEO" && (
            <Link href="/dashboard/users" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Kelola User
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          {session?.user?.profilePicUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.profilePicUrl}
              alt={session.user.name ?? "Avatar"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-gray-600">
            {session?.user?.name} <span className="text-gray-400">({session?.user?.role})</span>
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="text-gray-500 hover:text-gray-900">
              Keluar
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
