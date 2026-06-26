"use client"

import { useEffect, useRef, type ElementType, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ParallaxProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Vertical travel as a percentage of the element's height across the scroll. */
  speed?: number
}

/** Drifts its content as the page scrolls to add depth. */
export function Parallax({ children, as: Tag = "div", className, speed = 12 }: ParallaxProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [speed])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
