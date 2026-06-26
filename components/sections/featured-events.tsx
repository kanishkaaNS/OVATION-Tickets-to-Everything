import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { EventCard } from "@/components/event-card"
import { Reveal } from "@/components/reveal"
import { EVENTS } from "@/lib/events"

export function FeaturedEvents() {
  const events = EVENTS.slice(0, 6)

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">On sale now</p>
          <h2 className="mt-3 text-balance font-display text-4xl text-foreground md:text-5xl">
            Trending events
          </h2>
        </div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </Reveal>

      <Reveal stagger className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </Reveal>
    </section>
  )
}
