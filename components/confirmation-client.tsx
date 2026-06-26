"use client"

import Link from "next/link"
import { Check, Calendar, MapPin, Ticket } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatEventDate } from "@/lib/events"

export function ConfirmationClient() {
  const { lastOrder } = useCart()

  if (!lastOrder) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-32 text-center">
        <h1 className="font-display text-4xl text-foreground">No recent order</h1>
        <p className="mt-4 text-muted-foreground">
          Looks like you haven&apos;t completed a booking in this session.
        </p>
        <Link
          href="/events"
          className="mt-8 bg-foreground px-7 py-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Browse events
        </Link>
      </div>
    )
  }

  const totalTickets = lastOrder.lines.reduce((sum, l) => sum + l.quantity, 0)

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center bg-foreground text-background">
          <Check size={28} />
        </div>
        <h1 className="mt-6 text-balance font-display text-4xl text-foreground md:text-5xl">
          You&apos;re going!
        </h1>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground">
          Your booking is confirmed. We&apos;ve sent {totalTickets}{" "}
          {totalTickets === 1 ? "ticket" : "tickets"} to{" "}
          <span className="text-foreground">{lastOrder.email}</span>.
        </p>
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          Order <span className="text-foreground">{lastOrder.id}</span>
        </p>
      </div>

      <div className="mt-12 border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-6 py-4">
          <Ticket size={18} className="text-foreground" />
          <h2 className="font-display text-xl text-foreground">Your tickets</h2>
        </div>
        <ul className="flex flex-col">
          {lastOrder.lines.map((line) => {
            const date = formatEventDate(line.eventDate)
            return (
              <li key={`${line.eventSlug}-${line.tierId}`} className="border-b border-border px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{line.eventTitle}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {line.quantity} × {line.tierName}
                    </p>
                    <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} /> {date.full} · {date.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin size={14} /> {line.venue}, {line.city}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-foreground">
                    ${(line.price * line.quantity).toFixed(2)}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-col gap-2 px-6 py-5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono text-foreground">${lastOrder.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service fees</span>
            <span className="font-mono text-foreground">${lastOrder.fees.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
            <span className="font-medium text-foreground">Total paid</span>
            <span className="font-display text-2xl text-foreground">${lastOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/events"
          className="bg-foreground px-7 py-4 text-center text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Discover more events
        </Link>
        <Link
          href="/"
          className="border border-border px-7 py-4 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}
