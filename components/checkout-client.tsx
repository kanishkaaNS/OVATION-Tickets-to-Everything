"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ArrowLeft, Lock } from "lucide-react"
import { FadeImage } from "@/components/fade-image"
import { useCart, serviceFee } from "@/context/cart-context"
import { formatEventDate } from "@/lib/events"

export function CheckoutClient() {
  const router = useRouter()
  const { lines, updateQuantity, removeLine, subtotal } = useCart()
  const { placeOrder } = useCart()
  const [form, setForm] = useState({ name: "", email: "", card: "", exp: "", cvc: "" })
  const [submitting, setSubmitting] = useState(false)

  const fees = serviceFee(subtotal)
  const total = subtotal + fees

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (lines.length === 0) return
    setSubmitting(true)
    // Simulated processing for the demo flow
    setTimeout(() => {
      placeOrder({ name: form.name, email: form.email })
      router.push("/confirmation")
    }, 700)
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-32 text-center">
        <h1 className="font-display text-4xl text-foreground">Your cart is empty</h1>
        <p className="mt-4 text-muted-foreground">
          Browse events and add some tickets to get started.
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

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Continue browsing
      </Link>
      <h1 className="mt-6 font-display text-5xl text-foreground md:text-6xl">Checkout</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        {/* Cart + form */}
        <div>
          <h2 className="font-display text-2xl text-foreground">Your tickets</h2>
          <ul className="mt-6 flex flex-col">
            {lines.map((line) => {
              const date = formatEventDate(line.eventDate)
              return (
                <li
                  key={`${line.eventSlug}-${line.tierId}`}
                  className="flex gap-4 border-b border-border py-6"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-secondary">
                    <FadeImage
                      src={line.eventImage || "/placeholder.svg"}
                      alt={line.eventTitle}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/events/${line.eventSlug}`}
                      className="font-medium text-foreground transition-opacity hover:opacity-70"
                    >
                      {line.eventTitle}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">{line.tierName}</p>
                    <p className="text-sm text-muted-foreground">
                      {date.month} {date.day} · {line.venue}, {line.city}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(line.eventSlug, line.tierId, line.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-secondary"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-mono text-sm text-foreground">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(line.eventSlug, line.tierId, line.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-secondary"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm text-foreground">
                          ${(line.price * line.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeLine(line.eventSlug, line.tierId)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Details form */}
          <form id="checkout-form" onSubmit={handleSubmit} className="mt-10">
            <h2 className="font-display text-2xl text-foreground">Your details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" className="sm:col-span-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Alex Morgan"
                  className="input-base"
                />
              </Field>
              <Field label="Email" className="sm:col-span-2">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="input-base"
                />
              </Field>
            </div>

            <h2 className="mt-10 flex items-center gap-2 font-display text-2xl text-foreground">
              Payment
              <Lock size={16} className="text-muted-foreground" />
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Demo only — no real card is charged.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Card number" className="sm:col-span-2">
                <input
                  required
                  inputMode="numeric"
                  value={form.card}
                  onChange={(e) => setForm({ ...form, card: e.target.value })}
                  placeholder="4242 4242 4242 4242"
                  className="input-base font-mono"
                />
              </Field>
              <Field label="Expiry">
                <input
                  required
                  value={form.exp}
                  onChange={(e) => setForm({ ...form, exp: e.target.value })}
                  placeholder="MM / YY"
                  className="input-base font-mono"
                />
              </Field>
              <Field label="CVC">
                <input
                  required
                  inputMode="numeric"
                  value={form.cvc}
                  onChange={(e) => setForm({ ...form, cvc: e.target.value })}
                  placeholder="123"
                  className="input-base font-mono"
                />
              </Field>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border">
            <div className="border-b border-border bg-secondary px-6 py-4">
              <h2 className="font-display text-xl text-foreground">Order summary</h2>
            </div>
            <div className="flex flex-col gap-3 px-6 py-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Service fees</span>
                <span className="font-mono text-foreground">${fees.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-4">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-display text-2xl text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="w-full bg-foreground px-6 py-4 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Processing…" : `Pay $${total.toFixed(2)}`}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Tickets are delivered instantly to your email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-2 ${className || ""}`}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
