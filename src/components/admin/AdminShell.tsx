"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Building2, BarChart3, LogOut, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/firms", label: "Firms & Postcodes", icon: Building2 },
  { href: "/admin/operators", label: "Town Map", icon: MapPin },
  { href: "/admin/stats", label: "Statistics", icon: BarChart3 },
];

export function AdminShell({
  title,
  subtitle,
  children,
  sidebarExtra,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Rendered under the main nav (e.g. taxi firms on Town Map). */
  sidebarExtra?: React.ReactNode;
  /** Wider page canvas for map tools */
  wide?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6",
            wide ? "max-w-[1600px]" : "max-w-7xl"
          )}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              TaxiScanner Admin
            </p>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Customer site
            </Link>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "mx-auto grid gap-6 px-4 py-6 sm:px-6",
          wide
            ? "max-w-[1600px] lg:grid-cols-[240px_1fr]"
            : "max-w-7xl lg:grid-cols-[220px_1fr]"
        )}
      >
        <aside className="h-fit space-y-4">
          <nav className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {sidebarExtra ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              {sidebarExtra}
            </div>
          ) : null}
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
