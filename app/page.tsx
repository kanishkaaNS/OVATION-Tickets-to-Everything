import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { EventsHero } from "@/components/sections/events-hero"
import { FeaturedEvents } from "@/components/sections/featured-events"
import { CategoryStrip } from "@/components/sections/category-strip"
import { CtaSection } from "@/components/sections/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader overlay />
      <EventsHero />
      <FeaturedEvents />
      <CategoryStrip />
      <CtaSection />
      <SiteFooter />
    </main>
  )
}
