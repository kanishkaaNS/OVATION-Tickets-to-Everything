"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

/** Access the active Lenis instance (or null if reduced motion / not ready). */
export function useLenis() {
  return useContext(LenisContext)
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Respect users who prefer reduced motion.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const lenis = new Lenis({
      // Lerp gives a continuous, buttery glide (lower = smoother/floatier).
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis
    setLenisInstance(lenis)

    // Drive Lenis from GSAP's ticker and keep ScrollTrigger in sync.
    lenis.on("scroll", ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // Smoothly scroll to in-page anchors.
    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!target) return
      const id = target.getAttribute("href")
      if (!id || id === "#") return
      const el = document.querySelector(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el as HTMLElement, { offset: -80 })
      }
    }
    document.addEventListener("click", onAnchorClick)

    return () => {
      document.removeEventListener("click", onAnchorClick)
      gsap.ticker.remove(update)
      lenis.destroy()
      lenisRef.current = null
      setLenisInstance(null)
    }
  }, [])

  // On route change, jump to the top and refresh ScrollTrigger measurements.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => window.clearTimeout(id)
  }, [pathname])

  return <LenisContext.Provider value={lenisInstance}>{children}</LenisContext.Provider>
}
