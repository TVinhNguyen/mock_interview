"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  ChevronLeft,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from "lucide-react"

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  const sessions = [
    {
      id: 1,
      title: "Python Backend",
      date: "28/11/2024",
      time: "14:30",
      score: 85,
      duration: "42 phút",
      questionsAnswered: 8,
      totalQuestions: 8,
      trend: "up",
      topics: ["Data Structures", "APIs"],
    },
    {
      id: 2,
      title: "JavaScript Full-Stack",
      date: "25/11/2024",
      time: "10:15",
      score: 72,
      duration: "85 phút",
      questionsAnswered: 11,
      totalQuestions: 12,
      trend: "down",
      topics: ["React", "Node.js"],
    },
    {
      id: 3,
      title: "Java Spring",
      date: "20/11/2024",
      time: "09:00",
      score: 91,
      duration: "58 phút",
      questionsAnswered: 10,
      totalQuestions: 10,
      trend: "up",
      topics: ["OOP", "Microservices"],
    },
    {
      id: 4,
      title: "DSA Mastery",
      date: "18/11/2024",
      time: "16:45",
      score: 68,
      duration: "55 phút",
      questionsAnswered: 12,
      totalQuestions: 15,
      trend: "same",
      topics: ["Arrays", "Trees"],
    },
    {
      id: 5,
      title: "Python Backend",
      date: "15/11/2024",
      time: "11:00",
      score: 78,
      duration: "40 phút",
      questionsAnswered: 8,
      totalQuestions: 8,
      trend: "up",
      topics: ["Database", "APIs"],
    },
    {
      id: 6,
      title: "JavaScript Full-Stack",
      date: "12/11/2024",
      time: "14:00",
      score: 82,
      duration: "75 phút",
      questionsAnswered: 12,
      totalQuestions: 12,
      trend: "up",
      topics: ["React", "System Design"],
    },
    {
      id: 7,
      title: "Java Spring",
      date: "08/11/2024",
      time: "10:30",
      score: 75,
      duration: "52 phút",
      questionsAnswered: 9,
      totalQuestions: 10,
      trend: "down",
      topics: ["Spring Boot", "REST"],
    },
    {
      id: 8,
      title: "DSA Mastery",
      date: "05/11/2024",
      time: "15:00",
      score: 65,
      duration: "60 phút",
      questionsAnswered: 10,
      totalQuestions: 15,
      trend: "same",
      topics: ["DP", "Graphs"],
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success"
    if (score >= 70) return "text-yellow-500"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-success/10 border-success/30"
    if (score >= 70) return "bg-yellow-500/10 border-yellow-500/30"
    return "bg-destructive/10 border-destructive/30"
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-success" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "high" && session.score >= 85) ||
      (filterType === "medium" && session.score >= 70 && session.score < 85) ||
      (filterType === "low" && session.score < 70)
    return matchesSearch && matchesFilter
  })

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
          <div className="flex items-center gap-3">
            <Link href="/statistics">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
                <BarChart3 className="h-4 w-4" />
                Thống kê
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
                <ChevronLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">Lịch sử luyện tập</h1>
          <p className="text-muted-foreground">Xem lại tất cả các buổi phỏng vấn của bạn</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên bộ phỏng vấn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-0 focus:ring-2 ring-primary"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "Tất cả" },
              { value: "high", label: "Cao" },
              { value: "medium", label: "Trung bình" },
              { value: "low", label: "Thấp" },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={filterType === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(filter.value)}
                className={
                  filterType === filter.value
                    ? "bg-primary hover:bg-primary/90"
                    : "border-border hover:bg-primary/10 hover:text-foreground"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          {[
            { label: "Tổng buổi", value: sessions.length, icon: <Calendar className="h-4 w-4" /> },
            {
              label: "Điểm TB",
              value: `${Math.round(sessions.reduce((a, b) => a + b.score, 0) / sessions.length)}%`,
              icon: <TrendingUp className="h-4 w-4" />,
            },
            { label: "Tổng thời gian", value: "18h", icon: <Clock className="h-4 w-4" /> },
            {
              label: "Hoàn thành",
              value: `${sessions.filter((s) => s.questionsAnswered === s.totalQuestions).length}/${sessions.length}`,
              icon: <CheckCircle2 className="h-4 w-4" />,
            },
          ].map((stat, i) => (
            <Card key={i} className="glass border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sessions List */}
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {filteredSessions.map((session, index) => (
            <Card
              key={session.id}
              className="glass border-0 group hover:bg-secondary/30 transition-all duration-200"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Score */}
                  <div
                    className={`h-16 w-16 rounded-xl ${getScoreBg(session.score)} border flex flex-col items-center justify-center shrink-0`}
                  >
                    <span className={`text-xl font-bold ${getScoreColor(session.score)}`}>{session.score}</span>
                    <div className="flex items-center gap-0.5">{getTrendIcon(session.trend)}</div>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{session.title}</h3>
                      {session.questionsAnswered === session.totalQuestions && (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {session.duration}
                      </span>
                      <span>
                        {session.questionsAnswered}/{session.totalQuestions} câu
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {session.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="bg-primary/10 text-primary border-0 text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
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

          {filteredSessions.length === 0 && (
            <Card className="glass border-0">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Không tìm thấy kết quả</h3>
                <p className="text-muted-foreground text-sm">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
