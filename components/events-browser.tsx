"use client"

import { useMemo, useState } from "react"
import { EventCard } from "@/components/event-card"
import { CATEGORIES, EVENTS, type EventCategory } from "@/lib/events"
import { cn } from "@/lib/utils"

export function EventsBrowser({ initialCategory }: { initialCategory?: string }) {
  const valid = CATEGORIES.includes(initialCategory as EventCategory)
  const [active, setActive] = useState<EventCategory | "All">(valid ? (initialCategory as EventCategory) : "All")

  const filtered = useMemo(
    () => (active === "All" ? EVENTS : EVENTS.filter((e) => e.category === active)),
    [active],
  )

  const filters: (EventCategory | "All")[] = ["All", ...CATEGORIES]

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "border px-4 py-2 text-sm transition-all duration-300 active:scale-95",
              active === f
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:-translate-y-0.5 hover:border-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "event" : "events"}
      </p>

      {filtered.length > 0 ? (
        // Keying on `active` remounts the grid so cards re-animate when the filter changes.
        <div key={active} className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event, i) => (
            <div
              key={event.slug}
              className="animate-reveal-up opacity-0"
              style={{ animationDelay: `${Math.min(i * 60, 480)}ms` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">No events in this category yet. Check back soon.</p>
      )}
    </div>
  )
}
