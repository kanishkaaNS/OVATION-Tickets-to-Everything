import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TicketSelector } from "@/components/ticket-selector"
import { EventCard } from "@/components/event-card"
import { Reveal } from "@/components/reveal"
import { EVENTS, getEvent, formatEventDate } from "@/lib/events"

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = getEvent(slug)
  if (!event) return { title: "Event not found | OVATION" }
  return {
    title: `${event.title} | OVATION`,
    description: event.summary,
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = getEvent(slug)
  if (!event) notFound()

  const date = formatEventDate(event.date)
  const related = EVENTS.filter((e) => e.category === event.category && e.slug !== event.slug).slice(0, 3)
  const fallbackRelated = EVENTS.filter((e) => e.slug !== event.slug).slice(0, 3)
  const suggestions = related.length > 0 ? related : fallbackRelated

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero banner */}
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden bg-foreground">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 md:px-8">
          <span className="inline-block bg-background px-3 py-1.5 text-xs uppercase tracking-widest text-foreground">
            {event.category}
          </span>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl leading-tight text-background md:text-6xl">
            {event.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          All events
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          {/* Details */}
          <div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-border py-6">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{date.full}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Doors {event.doors}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {event.venue}, {event.city}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-2xl text-foreground">About this event</h2>
              <div className="mt-4 flex flex-col gap-4">
                {event.description.map((p, i) => (
                  <p key={i} className="text-pretty leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {event.lineup && event.lineup.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl text-foreground">Lineup</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {event.lineup.map((name) => (
                    <li
                      key={name}
                      className="border border-border px-4 py-2 text-sm text-foreground"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Ticket selector */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <TicketSelector event={event} />
          </div>
        </div>

        {/* Related */}
        {suggestions.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <Reveal>
              <h2 className="font-display text-3xl text-foreground">You might also like</h2>
            </Reveal>
            <Reveal stagger className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </Reveal>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
