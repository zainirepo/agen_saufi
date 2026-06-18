import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <Link href="/dashboard" className="font-semibold text-gray-900">
          agen_saufi
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">
            {session?.user?.name} <span className="text-gray-400">({(session?.user as { role?: string })?.role})</span>
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
