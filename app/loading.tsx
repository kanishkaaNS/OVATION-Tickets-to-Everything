import { SkeletonBlock, EventsGridSkeleton } from "@/components/skeletons"

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero placeholder */}
      <section className="relative flex min-h-screen items-end overflow-hidden bg-secondary">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="mt-6 h-16 w-full max-w-3xl" />
          <SkeletonBlock className="mt-4 h-16 w-2/3 max-w-xl" />
          <SkeletonBlock className="mt-8 h-5 w-full max-w-md" />
          <div className="mt-10 flex gap-3">
            <SkeletonBlock className="h-12 w-44" />
            <SkeletonBlock className="h-12 w-36" />
          </div>
        </div>
      </section>

      {/* Featured events placeholder */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="mt-3 h-10 w-72" />
        <div className="mt-12">
          <EventsGridSkeleton count={6} />
        </div>
      </section>
    </main>
  )
}
