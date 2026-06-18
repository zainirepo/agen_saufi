import { auth, signOut } from "@/lib/auth";
import Sidebar from "./sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar isCeo={session?.user?.role === "CEO"} />

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-[var(--color-topbar-bg)] px-6">
          <div />
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
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
