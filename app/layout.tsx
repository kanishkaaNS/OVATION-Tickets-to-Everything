import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/cart-context'
import { SmoothScroll } from '@/components/smooth-scroll'
import { FloatingNav } from '@/components/floating-nav'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'OVATION | Tickets to Everything',
  description: 'Book tickets to music festivals, conferences, comedy, sports, theater and more. One place for every night out.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          <SmoothScroll>
            {children}
            <FloatingNav />
          </SmoothScroll>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
