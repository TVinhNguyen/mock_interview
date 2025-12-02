import { Skeleton } from "@/components/skeleton-card"
import { Sparkles } from "lucide-react"

export default function ScorecardLoading() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px]" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InterviewAI</span>
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-72 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass border-0 rounded-xl p-6 text-center">
            <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-24 mx-auto" />
          </div>
          <div className="md:col-span-2 glass border-0 rounded-xl p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="glass border-0 rounded-xl p-6 mb-8">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-20 w-20 rounded-full mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass border-0 rounded-xl p-6">
              <Skeleton className="h-5 w-3/4 mb-4" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
