import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Magnetic } from "@/components/magnetic"

const STEPS = [
  { n: "01", title: "Discover", body: "Browse thousands of events across every category and city." },
  { n: "02", title: "Choose your tickets", body: "Pick the tier that fits, from general admission to VIP." },
  { n: "03", title: "Go", body: "Instant mobile tickets, ready the moment you check out." },
]

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <Reveal stagger className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="group bg-background p-8 transition-colors duration-300 hover:bg-secondary md:p-10">
            <span className="font-mono text-sm text-muted-foreground transition-colors group-hover:text-foreground">
              {s.n}
            </span>
            <h3 className="mt-6 font-display text-2xl text-foreground">{s.title}</h3>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </Reveal>

      <Reveal
        direction="scale"
        className="mt-12 flex flex-col items-start justify-between gap-6 bg-foreground p-10 text-background md:flex-row md:items-center md:p-14"
      >
        <h2 className="max-w-xl text-balance font-display text-3xl leading-tight md:text-4xl">
          Ready to find your next night out?
        </h2>
        <Magnetic className="shrink-0">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-background px-7 py-4 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            Browse events
            <ArrowRight size={16} />
          </Link>
        </Magnetic>
      </Reveal>
    </section>
  )
}
