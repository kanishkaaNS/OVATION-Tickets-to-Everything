"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"

interface MagneticProps {
  children: ReactNode
  className?: string
  /** How strongly the element follows the cursor (0-1). */
  strength?: number
}

/**
 * Wraps an interactive element so it gently follows the cursor on hover —
 * a subtle micro-interaction. Falls back to no movement for reduced motion.
 */
export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" })

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      xTo(x * strength)
      yTo(y * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
