import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { EventsBrowser } from "@/components/events-browser"

export const metadata = {
  title: "All Events | OVATION",
  description: "Browse and book tickets to every event \u2014 music, sports, comedy, arts and more.",
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-32 md:px-8 md:pt-40">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Explore</p>
          <h1 className="mt-3 text-balance font-display text-5xl text-foreground md:text-6xl">All events</h1>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
            Every show, game, and gathering in one place. Filter by category to find your night.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <EventsBrowser initialCategory={category} />
      </section>

      <SiteFooter />
    </main>
  )
}
