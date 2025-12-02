import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AI Interview</span>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold text-foreground">Watch Demo</h1>
          <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Demo video would be embedded here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
