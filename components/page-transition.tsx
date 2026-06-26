"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { gsap } from "gsap"

/**
 * Plays a smooth entrance for each route. A full-screen wipe sweeps away
 * while the page content eases up into place. Used from app/template.tsx,
 * which remounts on every navigation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(prefersReduced)
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(
        overlayRef.current,
        { scaleY: 1 },
        { scaleY: 0, transformOrigin: "top", duration: 0.6, ease: "power4.inOut" },
      )
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.35",
      )
    })

    return () => ctx.revert()
  }, [pathname])

  return (
    <>
      {!reduced && (
        <div
          ref={overlayRef}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] bg-foreground"
          style={{ transform: "scaleY(0)" }}
        />
      )}
      <div ref={contentRef}>{children}</div>
    </>
  )
}
