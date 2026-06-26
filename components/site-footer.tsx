import Link from "next/link"
import { CATEGORIES } from "@/lib/events"

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-2xl font-medium tracking-[0.2em]">OVATION</p>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-background/60">
              Tickets to everything. Discover and book the nights you&apos;ll remember, all in one place.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-background/50">Browse</p>
            <ul className="mt-5 flex flex-col gap-3">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c}>
                  <Link
                    href={`/events?category=${c}`}
                    className="text-sm text-background/80 transition-colors hover:text-background"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-background/50">Company</p>
            <ul className="mt-5 flex flex-col gap-3">
              {["About", "Sell Tickets", "Help Center", "Terms"].map((c) => (
                <li key={c}>
                  <Link href="#" className="text-sm text-background/80 transition-colors hover:text-background">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-background/15 pt-8 text-sm text-background/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Ovation Tickets. All rights reserved.</p>
          <p>A demo experience built on v0.</p>
        </div>
      </div>
    </footer>
  )
}
