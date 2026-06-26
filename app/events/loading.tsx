import { SkeletonBlock, EventsGridSkeleton } from "@/components/skeletons"

export default function EventsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-32 md:px-8 md:pt-40">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="mt-3 h-14 w-80 max-w-full" />
          <SkeletonBlock className="mt-4 h-5 w-full max-w-xl" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-10 w-24" />
          ))}
        </div>
        <SkeletonBlock className="mt-8 h-4 w-20" />
        <div className="mt-6">
          <EventsGridSkeleton count={9} />
        </div>
      </section>
    </main>
  )
}
