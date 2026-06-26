import { SkeletonBlock } from "@/components/skeletons"

export default function ConfirmationLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-24 pt-32 text-center md:pt-40">
        <SkeletonBlock className="h-16 w-16 rounded-full" />
        <SkeletonBlock className="mt-8 h-12 w-80 max-w-full" />
        <SkeletonBlock className="mt-4 h-5 w-full max-w-md" />
        <SkeletonBlock className="mt-10 h-48 w-full" />
        <SkeletonBlock className="mt-8 h-12 w-44" />
      </div>
    </main>
  )
}
