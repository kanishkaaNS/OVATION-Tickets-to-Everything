import { cn } from "@/lib/utils"

/** A single shimmering placeholder block. */
export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton-block", className)} aria-hidden />
}

/** Placeholder matching the shape of an EventCard. */
export function EventCardSkeleton() {
  return (
    <div className="block">
      <SkeletonBlock className="aspect-[4/5] w-full" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="mt-2 h-4 w-1/2" />
        </div>
        <SkeletonBlock className="h-5 w-5 shrink-0" />
      </div>
      <SkeletonBlock className="mt-3 h-4 w-20" />
    </div>
  )
}

/** A responsive grid of event card placeholders. */
export function EventsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}
