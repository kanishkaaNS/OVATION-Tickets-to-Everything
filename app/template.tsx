import type { ReactNode } from "react"
import { PageTransition } from "@/components/page-transition"

// template.tsx remounts on every navigation, giving each route a fresh
// entrance animation while layout.tsx (and smooth scroll) persists.
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
