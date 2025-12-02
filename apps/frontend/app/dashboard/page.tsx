import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Clock,
  TrendingUp,
  Play,
  Sparkles,
  History,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"

export default function DashboardPage() {
  const interviewSets = [
    {
      id: 1,
      title: "Python Backend",
      level: "Junior",
      duration: "45 phút",
      questions: 8,
      topics: ["Data Structures", "APIs", "Database"],
      icon: "🐍",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      iconBg: "bg-blue-500/20",
    },
    {
      id: 2,
      title: "Java Spring",
      level: "Mid-Level",
      duration: "60 phút",
      questions: 10,
      topics: ["OOP", "Spring Boot", "Microservices"],
      icon: "☕",
      color: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500/20",
    },
    {
      id: 3,
      title: "JavaScript Full-Stack",
      level: "Senior",
      duration: "90 phút",
      questions: 12,
      topics: ["React", "Node.js", "System Design"],
      icon: "⚡",
      color: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      iconBg: "bg-yellow-500/20",
    },
    {
      id: 4,
      title: "DSA Mastery",
      level: "All Levels",
      duration: "60 phút",
      questions: 15,
      topics: ["Arrays", "Trees", "DP"],
      icon: "🧠",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      iconBg: "bg-purple-500/20",
    },
  ]

  const recentSessions = [
    {
      id: 1,
      title: "Python Backend",
      date: "28/11/2024",
      time: "14:30",
      score: 85,
      duration: "42 phút",
      questionsAnswered: 8,
      status: "completed",
    },
    {
      id: 2,
      title: "JavaScript Full-Stack",
      date: "25/11/2024",
      time: "10:15",
      score: 72,
      duration: "85 phút",
      questionsAnswered: 11,
      status: "completed",
    },
    {
      id: 3,
      title: "Java Spring",
      date: "20/11/2024",
      time: "09:00",
      score: 91,
      duration: "58 phút",
      questionsAnswered: 10,
      status: "completed",
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success"
    if (score >= 70) return "text-yellow-500"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-success/10"
    if (score >= 70) return "bg-yellow-500/10"
    return "bg-destructive/10"
  }

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
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InterviewAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
              <History className="h-4 w-4" />
              Lịch sử
            </Button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">JD</span>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-up">
          <h1 className="mb-3 text-4xl font-bold text-foreground">
            Xin chào, <span className="text-gradient">John</span>
          </h1>
          <p className="text-lg text-muted-foreground">Sẵn sàng luyện tập? Chọn một bộ phỏng vấn bên dưới.</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-3 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {[
            {
              label: "Tổng buổi luyện",
              value: "24",
              change: "+3 tuần này",
              icon: <Code2 className="h-5 w-5" />,
              color: "text-primary",
            },
            {
              label: "Điểm trung bình",
              value: "82%",
              change: "+5% cải thiện",
              icon: <TrendingUp className="h-5 w-5" />,
              color: "text-success",
            },
            {
              label: "Thời gian luyện",
              value: "18h",
              change: "30 ngày qua",
              icon: <Clock className="h-5 w-5" />,
              color: "text-accent",
            },
          ].map((stat, i) => (
            <Card key={i} className="glass border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-sm text-success mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interview Sets - Redesigned cards to be more compact and refined */}
        <div className="mb-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Chọn bộ phỏng vấn</h2>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10 gap-1">
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {interviewSets.map((set) => (
              <Card
                key={set.id}
                className={`group cursor-pointer transition-all duration-300 border ${set.borderColor} bg-gradient-to-br ${set.color} backdrop-blur-sm hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10`}
              >
                <CardContent className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl ${set.iconBg} flex items-center justify-center text-2xl`}>
                      {set.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs bg-background/50 text-foreground border-0">
                      {set.level}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-gradient transition-all">
                    {set.title}
                  </h3>

                  {/* Meta info */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {set.duration}
                    </span>
                    <span>{set.questions} câu</span>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {set.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-background/30 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button - Fixed hover state */}
                  <Link href="/interview">
                    <Button
                      size="sm"
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-lg gap-2"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Bắt đầu
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Sessions - Redesigned to be more logical with better information hierarchy */}
        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Lịch sử luyện tập</h2>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10 gap-1">
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {recentSessions.map((session) => (
              <Card key={session.id} className="glass border-0 group hover:bg-secondary/30 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Score circle */}
                    <div
                      className={`h-14 w-14 rounded-xl ${getScoreBg(session.score)} flex items-center justify-center shrink-0`}
                    >
                      <span className={`text-xl font-bold ${getScoreColor(session.score)}`}>{session.score}</span>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{session.title}</h3>
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {session.duration}
                        </span>
                        <span className="hidden sm:inline">{session.questionsAnswered} câu đã trả lời</span>
                      </div>
                    </div>

                    {/* Action - Fixed hover state */}
                    <Link href="/scorecard">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 gap-1"
                      >
                        Chi tiết
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty state hint */}
          {recentSessions.length === 0 && (
            <Card className="glass border-0">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <History className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Chưa có lịch sử</h3>
                <p className="text-muted-foreground text-sm">Bắt đầu một buổi phỏng vấn để xem lịch sử tại đây.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
