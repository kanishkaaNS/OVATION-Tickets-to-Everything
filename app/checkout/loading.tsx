import { SkeletonBlock } from "@/components/skeletons"

export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="mt-6 h-14 w-64" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SkeletonBlock className="h-7 w-44" />
            <div className="mt-6 flex flex-col gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-4 border-b border-border pb-6">
                  <SkeletonBlock className="h-24 w-20 shrink-0" />
                  <div className="flex-1">
                    <SkeletonBlock className="h-5 w-2/3" />
                    <SkeletonBlock className="mt-2 h-4 w-1/3" />
                    <SkeletonBlock className="mt-2 h-4 w-1/2" />
                    <SkeletonBlock className="mt-4 h-9 w-28" />
                  </div>
                </div>
              ))}
            </div>
            <SkeletonBlock className="mt-10 h-7 w-40" />
            <div className="mt-6 grid gap-4">
              <SkeletonBlock className="h-12 w-full" />
              <SkeletonBlock className="h-12 w-full" />
            </div>
          </div>

          <div>
            <SkeletonBlock className="h-72 w-full" />
          </div>
        </div>
      </div>
    </main>
  )
}
