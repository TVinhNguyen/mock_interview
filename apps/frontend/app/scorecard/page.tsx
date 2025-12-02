import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowLeft, TrendingUp, CheckCircle2, XCircle, Download, Share2, Trophy } from "lucide-react"
import { ScoreDonut } from "@/components/score-donut"

export default function ScorecardPage() {
  const scoreBreakdown = [
    { skill: "Problem Solving", score: 90, color: "#10b981" },
    { skill: "Code Quality", score: 85, color: "#6366f1" },
    { skill: "Communication", score: 78, color: "#22d3ee" },
    { skill: "Technical Depth", score: 88, color: "#6366f1" },
    { skill: "Time Management", score: 75, color: "#a1a1aa" },
  ]

  const strengths = [
    "Clear explanation of algorithmic approach",
    "Efficient implementation with O(n) time complexity",
    "Good edge case handling",
    "Clean and readable code structure",
  ]

  const improvements = [
    {
      issue: "Missing null check on line 12",
      suggestion: 'Add validation: if (input === null) return "";',
      severity: "high",
    },
    {
      issue: "Variable naming could be more descriptive",
      suggestion: 'Rename "temp" to "currentSubstring"',
      severity: "medium",
    },
    {
      issue: "Consider optimizing the nested loop",
      suggestion: "Use dynamic programming approach",
      severity: "low",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-success/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px]" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InterviewAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-transparent border-border hover:bg-secondary rounded-full">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent border-border hover:bg-secondary rounded-full">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header Section */}
        <div className="mb-12 animate-fade-up">
          <div className="mb-3 flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-bold text-foreground">Interview Report</h1>
            <Badge className="bg-primary/20 text-primary border-0 text-sm">Python Backend Engineer</Badge>
          </div>
          <p className="text-lg text-muted-foreground">Completed on Nov 22, 2025 - Duration: 45 minutes</p>
        </div>

        {/* Overall Score Section */}
        <Card className="mb-8 glass border-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-8 lg:p-12">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Donut Chart */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <ScoreDonut score={85} />
                  {/* Trophy badge */}
                  <div className="absolute -top-4 -right-4 h-14 w-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <h2 className="text-3xl font-bold text-foreground">Overall Score</h2>
                  <p className="mt-2 text-lg text-muted-foreground">Great performance! You're well-prepared.</p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="flex flex-col justify-center">
                <h3 className="mb-6 text-xl font-semibold text-foreground">Skill Breakdown</h3>
                <div className="space-y-5">
                  {scoreBreakdown.map((item) => (
                    <div key={item.skill}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-foreground">{item.skill}</span>
                        <span className="text-lg font-bold text-foreground">{item.score}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${item.score}%`,
                            background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <Card
            className="glass border-0 border-l-4 border-l-success animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/20">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-foreground">Strengths</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <span className="text-foreground leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card
            className="glass border-0 border-l-4 border-l-destructive animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/20">
                  <TrendingUp className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-foreground">Areas for Improvement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvements.map((item, index) => (
                  <div key={index} className="rounded-xl bg-secondary/50 p-4 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <XCircle
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                          item.severity === "high"
                            ? "text-destructive"
                            : item.severity === "medium"
                              ? "text-yellow-500"
                              : "text-muted-foreground"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{item.issue}</span>
                          <Badge
                            className={`text-xs border-0 ${
                              item.severity === "high"
                                ? "bg-destructive/20 text-destructive"
                                : item.severity === "medium"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {item.severity}
                          </Badge>
                        </div>
                        <code className="block rounded-lg bg-background/80 px-3 py-2 text-xs font-mono text-success">
                          {item.suggestion}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 rounded-full px-8"
            >
              Practice Again
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 bg-transparent border-border hover:bg-secondary"
          >
            Review Recording
          </Button>
        </div>
      </div>
    </div>
  )
}
