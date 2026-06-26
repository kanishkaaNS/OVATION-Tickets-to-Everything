"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, Ticket } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Events", href: "/events" },
  { label: "Music", href: "/events?category=Music" },
  { label: "Sports", href: "/events?category=Sports" },
  { label: "Arts", href: "/events?category=Arts" },
]

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Light text only when overlaying a dark hero and not scrolled
  const light = overlay && !isScrolled
  const solid = !overlay || isScrolled

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        solid ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className={cn(
            "text-xl font-medium tracking-[0.2em] transition-colors",
            light ? "text-white" : "text-foreground",
          )}
        >
          OVATION
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                light ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            aria-label="View cart"
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all",
              light ? "bg-white text-foreground hover:bg-white/90" : "bg-foreground text-background hover:opacity-80",
            )}
          >
            <Ticket size={16} />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center bg-destructive px-1 text-xs font-bold text-destructive-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn("transition-colors md:hidden", light ? "text-white" : "text-foreground")}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-6 py-8 md:hidden">
          <nav className="flex flex-col gap-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-lg text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
