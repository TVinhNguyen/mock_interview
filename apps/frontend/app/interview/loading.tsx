import { Skeleton } from "@/components/skeleton-card"
import { Sparkles } from "lucide-react"

export default function InterviewLoading() {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="glass border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="flex-1 p-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-3/4 rounded-xl" />
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
          <div className="flex-1 p-4">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
