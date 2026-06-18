"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

export default function Sidebar({ isCeo }: { isCeo: boolean }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Order", icon: "📦" },
    ...(isCeo ? [{ href: "/dashboard/users", label: "Kelola User", icon: "👥" }] : []),
  ];

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-[var(--color-sidebar-bg)]">
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <span className="text-lg font-semibold text-white">agen_saufi</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text-active)]"
                  : "text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-bg-hover)] hover:text-[var(--color-sidebar-text-active)]"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
