"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, Check } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { type EventItem } from "@/lib/events"
import { cn } from "@/lib/utils"

export function TicketSelector({ event }: { event: EventItem }) {
  const router = useRouter()
  const { addLine } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [added, setAdded] = useState(false)

  function setQty(tierId: string, qty: number, max: number) {
    setAdded(false)
    setQuantities((prev) => ({ ...prev, [tierId]: Math.max(0, Math.min(qty, Math.min(max, 8))) }))
  }

  const total = useMemo(
    () =>
      event.tiers.reduce((sum, t) => sum + (quantities[t.id] || 0) * t.price, 0),
    [quantities, event.tiers],
  )
  const count = useMemo(
    () => event.tiers.reduce((sum, t) => sum + (quantities[t.id] || 0), 0),
    [quantities, event.tiers],
  )

  function handleAdd(goToCheckout: boolean) {
    event.tiers.forEach((t) => {
      const qty = quantities[t.id] || 0
      if (qty > 0) {
        addLine({
          eventSlug: event.slug,
          eventTitle: event.title,
          eventImage: event.image,
          eventDate: event.date,
          venue: event.venue,
          city: event.city,
          tierId: t.id,
          tierName: t.name,
          price: t.price,
          quantity: qty,
        })
      }
    })
    if (goToCheckout) {
      router.push("/checkout")
    } else {
      setAdded(true)
      setQuantities({})
    }
  }

  return (
    <div className="border border-border">
      <div className="border-b border-border bg-secondary px-6 py-4">
        <h2 className="font-display text-xl text-foreground">Select tickets</h2>
      </div>

      <div className="flex flex-col">
        {event.tiers.map((tier) => {
          const qty = quantities[tier.id] || 0
          const soldOut = tier.available <= 0
          return (
            <div
              key={tier.id}
              className="flex items-center justify-between gap-4 border-b border-border px-6 py-5"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">{tier.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{tier.description}</p>
                <p className="mt-1 font-mono text-sm text-foreground">${tier.price.toFixed(2)}</p>
              </div>

              {soldOut ? (
                <span className="shrink-0 text-sm uppercase tracking-wide text-muted-foreground">Sold out</span>
              ) : (
                <div className="flex shrink-0 items-center border border-border">
                  <button
                    type="button"
                    aria-label={`Remove one ${tier.name}`}
                    onClick={() => setQty(tier.id, qty - 1, tier.available)}
                    className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:opacity-30"
                    disabled={qty === 0}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-mono text-sm text-foreground">{qty}</span>
                  <button
                    type="button"
                    aria-label={`Add one ${tier.name}`}
                    onClick={() => setQty(tier.id, qty + 1, tier.available)}
                    className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-secondary"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {count} {count === 1 ? "ticket" : "tickets"}
          </span>
          <span className="font-display text-2xl text-foreground">${total.toFixed(2)}</span>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            disabled={count === 0}
            onClick={() => handleAdd(true)}
            className="w-full bg-foreground px-6 py-4 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Checkout
          </button>
          <button
            type="button"
            disabled={count === 0}
            onClick={() => handleAdd(false)}
            className={cn(
              "flex w-full items-center justify-center gap-2 border border-border px-6 py-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              added ? "border-foreground text-foreground" : "text-foreground hover:bg-secondary",
            )}
          >
            {added ? (
              <>
                <Check size={16} /> Added to cart
              </>
            ) : (
              "Add to cart"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
