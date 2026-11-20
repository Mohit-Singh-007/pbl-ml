"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  BrainCircuit,
  LayoutDashboard,
  ListChecks,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/check", label: "Check transaction", icon: ScanSearch },
  { href: "/transactions", label: "Transactions", icon: ListChecks },
  { href: "/insights", label: "Model insights", icon: BrainCircuit },
  { href: "/documentation", label: "Documentation", icon: BookOpen },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="border-b bg-card md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-4 py-4 md:py-6">
        <ShieldCheck className="size-6 text-emerald-600" aria-hidden />
        <div className="leading-tight">
          <p className="font-semibold">UPI Fraud Detection</p>
          <p className="text-xs text-muted-foreground">
            Random Forest classifier
          </p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
