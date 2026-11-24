import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#flags", label: "Red flags" },
  { href: "#verdicts", label: "Verdicts" },
  { href: "#results", label: "Results" },
  { href: "#team", label: "Team" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="size-6 text-emerald-600" aria-hidden />
          <span className="font-semibold tracking-tight">
            UPI Fraud Detection
          </span>
          <span className="hidden font-mono text-[0.68rem] tracking-[0.16em] lp-muted sm:inline">
            MCA PBL 2026
          </span>
        </Link>
        <nav
          className="hidden items-center gap-6 text-sm lg:flex"
          aria-label="Sections"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="lp-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/documentation"
            className="lp-muted transition-colors hover:text-foreground"
          >
            Docs
          </Link>
        </nav>
        <Link
          href="/dashboard"
          className="lp-btn lp-btn-line rounded-md !px-4 !py-1.5 !text-sm"
        >
          Open app
        </Link>
      </div>
    </header>
  );
}
