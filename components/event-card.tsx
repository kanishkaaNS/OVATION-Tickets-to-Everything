import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { FadeImage } from "@/components/fade-image"
import { formatEventDate, type EventItem } from "@/lib/events"

export function EventCard({ event }: { event: EventItem }) {
  const date = formatEventDate(event.date)
  const fromPrice = Math.min(...event.tiers.map((t) => t.price))

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block transition-transform duration-300 will-change-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <FadeImage
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-0 top-0 flex flex-col items-center bg-background px-4 py-3 text-center">
          <span className="text-xs font-medium tracking-widest text-muted-foreground">{date.month}</span>
          <span className="font-display text-2xl leading-none text-foreground">{date.day}</span>
        </div>
        <span className="absolute right-0 top-0 bg-foreground/90 px-3 py-2 text-xs uppercase tracking-widest text-background">
          {event.category}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-balance text-lg font-medium leading-snug text-foreground">{event.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {event.venue} · {event.city}
          </p>
        </div>
        <ArrowUpRight
          size={20}
          className="mt-1 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        From <span className="font-medium text-foreground">${fromPrice}</span>
      </p>
    </Link>
  )
}
