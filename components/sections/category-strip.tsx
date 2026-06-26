import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { CATEGORIES } from "@/lib/events"

export function CategoryStrip() {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <Reveal>
          <h2 className="text-balance font-display text-3xl text-foreground md:text-4xl">
            Browse by category
          </h2>
        </Reveal>
        <Reveal
          stagger
          staggerAmount={0.08}
          direction="scale"
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4"
        >
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/events?category=${c}`}
              className="group relative flex aspect-square flex-col justify-end overflow-hidden bg-background p-5 transition-colors duration-300 hover:bg-foreground"
            >
              <ArrowUpRight
                size={20}
                className="absolute right-5 top-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-background group-hover:opacity-100"
              />
              <span className="text-lg font-medium text-foreground transition-colors duration-300 group-hover:text-background">
                {c}
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
