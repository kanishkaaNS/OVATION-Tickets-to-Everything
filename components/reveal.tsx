"use client"

import { useEffect, useRef, type ElementType, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Direction = "up" | "down" | "left" | "right" | "scale" | "none"

interface RevealProps {
  children: ReactNode
  /** Tag to render. Defaults to a div. */
  as?: ElementType
  className?: string
  /** Animate direct children in sequence instead of the container itself. */
  stagger?: boolean
  /** Amount of stagger between children, in seconds. */
  staggerAmount?: number
  /** Direction the element travels in from. */
  direction?: Direction
  /** Distance in px the element travels into place. */
  distance?: number
  /** Delay before the animation starts, in seconds. */
  delay?: number
  /** Animation duration, in seconds. */
  duration?: number
}

function fromVars(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance }
    case "down":
      return { y: -distance }
    case "left":
      return { x: distance }
    case "right":
      return { x: -distance }
    case "scale":
      return { scale: 0.92 }
    case "none":
      return {}
  }
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  stagger = false,
  staggerAmount = 0.12,
  direction = "up",
  distance = 48,
  delay = 0,
  duration = 0.9,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : [el]
      const offset = fromVars(direction, distance)

      gsap.set(targets, { opacity: 0, ...offset })

      gsap.to(targets, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        ease: "power3.out",
        delay,
        stagger: stagger ? staggerAmount : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [stagger, staggerAmount, direction, distance, delay, duration])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
