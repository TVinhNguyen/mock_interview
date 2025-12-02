import { Skeleton } from "@/components/skeleton-card"
import { Sparkles } from "lucide-react"

export default function ProfileLoading() {
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
          <Skeleton className="h-10 w-40 rounded-lg" />
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8 flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-2xl" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* Tabs */}
        <div className="glass border-0 p-1 mb-6 flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
          ))}
        </div>

        {/* Content */}
        <div className="glass border-0 rounded-xl p-6">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-60 mb-6" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
