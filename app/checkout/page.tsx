import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutClient } from "@/components/checkout-client"

export const metadata = {
  title: "Checkout | OVATION",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <CheckoutClient />
      <SiteFooter />
    </main>
  )
}
