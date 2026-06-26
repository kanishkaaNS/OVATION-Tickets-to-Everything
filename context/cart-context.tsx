"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export interface CartLine {
  eventSlug: string
  eventTitle: string
  eventImage: string
  eventDate: string
  venue: string
  city: string
  tierId: string
  tierName: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  email: string
  name: string
  lines: CartLine[]
  subtotal: number
  fees: number
  total: number
}

interface CartContextValue {
  lines: CartLine[]
  addLine: (line: CartLine) => void
  updateQuantity: (eventSlug: string, tierId: string, quantity: number) => void
  removeLine: (eventSlug: string, tierId: string) => void
  clear: () => void
  itemCount: number
  subtotal: number
  lastOrder: Order | null
  placeOrder: (details: { name: string; email: string }) => Order
}

const SERVICE_FEE_RATE = 0.12

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  function addLine(line: CartLine) {
    setLines((prev) => {
      const existing = prev.find((l) => l.eventSlug === line.eventSlug && l.tierId === line.tierId)
      if (existing) {
        return prev.map((l) =>
          l.eventSlug === line.eventSlug && l.tierId === line.tierId
            ? { ...l, quantity: l.quantity + line.quantity }
            : l,
        )
      }
      return [...prev, line]
    })
  }

  function updateQuantity(eventSlug: string, tierId: string, quantity: number) {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => !(l.eventSlug === eventSlug && l.tierId === tierId))
        : prev.map((l) =>
            l.eventSlug === eventSlug && l.tierId === tierId ? { ...l, quantity } : l,
          ),
    )
  }

  function removeLine(eventSlug: string, tierId: string) {
    setLines((prev) => prev.filter((l) => !(l.eventSlug === eventSlug && l.tierId === tierId)))
  }

  function clear() {
    setLines([])
  }

  function placeOrder(details: { name: string; email: string }): Order {
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
    const fees = serviceFee(subtotal)
    const order: Order = {
      id: `OV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name: details.name,
      email: details.email,
      lines,
      subtotal,
      fees,
      total: subtotal + fees,
    }
    setLastOrder(order)
    setLines([])
    return order
  }

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
    return { lines, addLine, updateQuantity, removeLine, clear, itemCount, subtotal, lastOrder, placeOrder }
  }, [lines, lastOrder])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}

export function serviceFee(subtotal: number) {
  return Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100
}
