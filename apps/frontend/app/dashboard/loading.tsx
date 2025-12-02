import { SkeletonCard, SkeletonSessionCard, SkeletonStatCard, Skeleton } from "@/components/skeleton-card"
import { Sparkles } from "lucide-react"

export default function DashboardLoading() {
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
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        {/* Interview Sets */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
          <div className="space-y-3">
            <SkeletonSessionCard />
            <SkeletonSessionCard />
            <SkeletonSessionCard />
          </div>
        </div>
      </div>
    </div>
  )
}
