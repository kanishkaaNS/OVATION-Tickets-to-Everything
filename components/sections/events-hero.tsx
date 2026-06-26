"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Magnetic } from "@/components/magnetic"

gsap.registerPlugin(ScrollTrigger)

export function EventsHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Background drifts slower than the page for depth.
      gsap.to(imageRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      // Headline + copy ease up and fade as the hero leaves.
      gsap.to(contentRef.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-end overflow-hidden bg-foreground"
    >
      <div className="grain-overlay absolute inset-0" />
      <img
        ref={imageRef}
        src="/images/hero-events.png"
        alt="A vast crowd facing a brightly lit concert stage at night"
        className="absolute inset-0 h-[120%] w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-foreground/20" />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24"
      >
        <p className="animate-reveal-up text-sm uppercase tracking-[0.3em] text-background/70">
          Tickets to everything
        </p>
        <h1 className="animate-reveal-up animation-delay-100 mt-6 max-w-4xl text-balance font-display text-5xl leading-[0.95] text-background md:text-7xl lg:text-8xl">
          Find your next unforgettable night.
        </h1>
        <p className="animate-reveal-up animation-delay-200 mt-6 max-w-xl text-pretty text-lg leading-relaxed text-background/70">
          Music, comedy, conferences, sports, and more. One place to discover, book, and go.
        </p>

        <div className="animate-reveal-up animation-delay-300 mt-10 flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <Link
              href="/events"
              className="group inline-flex items-center justify-center gap-2 bg-background px-7 py-4 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              Browse all events
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/events?category=Music"
              className="inline-flex items-center justify-center gap-2 border border-background/40 px-7 py-4 text-sm font-medium text-background transition-colors hover:bg-background/10"
            >
              Explore music
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
