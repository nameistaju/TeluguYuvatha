"use client";

import { BarChart3, Boxes, FolderTree, Inbox, LayoutDashboard, Package, Settings, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type React from "react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/collections", label: "Collections", icon: Boxes },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/engagement", label: "Messages", icon: Inbox },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/analytics", label: "Analytics", icon: BarChart3 }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("ty_admin_token");
    if (token) {
      setHasToken(true);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("ty_admin_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-[var(--border)] bg-[var(--panel)] lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="px-5 py-5">
          <p className="text-xl font-semibold">Telugu Yuvatha</p>
          <p className="text-sm text-[var(--muted)]">Commerce command center</p>
          {mounted && hasToken ? (
            <button
              onClick={handleSignOut}
              className="mt-3 text-sm text-[var(--accent)] font-bold hover:underline cursor-pointer block text-left"
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" className="mt-3 inline-block text-sm text-[var(--accent)]">
              Admin login
            </Link>
          )}
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "text-[#d7dce4] hover:bg-[var(--panel-strong)]"
                }`}
              >
                <Icon size={17} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="px-5 py-6 lg:px-8">
        {mounted && hasToken ? children : null}
      </main>
    </div>
  );
}
