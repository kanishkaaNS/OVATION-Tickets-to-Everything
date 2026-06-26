import { SkeletonBlock, EventsGridSkeleton } from "@/components/skeletons"

export default function EventDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero banner */}
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden bg-secondary">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 md:px-8">
          <SkeletonBlock className="h-7 w-24" />
          <SkeletonBlock className="mt-4 h-12 w-full max-w-2xl" />
          <SkeletonBlock className="mt-3 h-12 w-1/2 max-w-md" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        <SkeletonBlock className="h-4 w-28" />

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-border py-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-5 w-40" />
              ))}
            </div>
            <SkeletonBlock className="mt-8 h-7 w-56" />
            <div className="mt-4 flex flex-col gap-3">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
          </div>

          {/* Ticket selector placeholder */}
          <div>
            <SkeletonBlock className="h-[360px] w-full" />
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-12">
          <SkeletonBlock className="h-8 w-64" />
          <div className="mt-8">
            <EventsGridSkeleton count={3} />
          </div>
        </div>
      </div>
    </main>
  )
}
