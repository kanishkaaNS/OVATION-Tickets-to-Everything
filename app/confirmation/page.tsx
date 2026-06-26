import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ConfirmationClient } from "@/components/confirmation-client"

export const metadata = {
  title: "Booking confirmed | OVATION",
}

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <ConfirmationClient />
      <SiteFooter />
    </main>
  )
}
