"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Ticket, ArrowUp } from "lucide-react"
import { gsap } from "gsap"
import { useCart } from "@/context/cart-context"
import { useLenis } from "@/components/smooth-scroll"
import { cn } from "@/lib/utils"

const LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Events", href: "/events", icon: Compass },
  { label: "Cart", href: "/checkout", icon: Ticket },
]

export function FloatingNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const lenis = useLenis()
  const [visible, setVisible] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)

  // Reveal the nav once the user scrolls past the first viewport.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Animate the pill in/out.
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    gsap.to(el, {
      y: visible ? 0 : 120,
      opacity: visible ? 1 : 0,
      duration: prefersReduced ? 0 : 0.5,
      ease: "power3.out",
    })
  }, [visible])

  // Pop the cart badge whenever the count changes.
  useEffect(() => {
    if (!badgeRef.current || itemCount === 0) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    gsap.fromTo(
      badgeRef.current,
      { scale: 0.4 },
      { scale: 1, duration: 0.45, ease: "back.out(3)" },
    )
  }, [itemCount])

  function scrollToTop() {
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 z-50 -translate-x-1/2",
        visible ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <nav
        ref={navRef}
        style={{ transform: "translateY(120px)", opacity: 0 }}
        className="flex items-center gap-1 border border-border bg-background/80 px-2 py-2 shadow-lg backdrop-blur-md"
      >
        {LINKS.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
          const isCart = href === "/checkout"
          return (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className={cn(
                "group relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span className="hidden sm:inline">{label}</span>
              {isCart && itemCount > 0 && (
                <span
                  ref={badgeRef}
                  className="flex h-5 min-w-5 items-center justify-center bg-destructive px-1 text-xs font-bold text-destructive-foreground"
                >
                  {itemCount}
                </span>
              )}
            </Link>
          )
        })}

        <span className="mx-1 h-6 w-px bg-border" aria-hidden />

        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group flex items-center justify-center p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowUp
            size={18}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </button>
      </nav>
    </div>
  )
}
