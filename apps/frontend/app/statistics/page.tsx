"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sparkles,
  ChevronLeft,
  TrendingUp,
  Target,
  Clock,
  Award,
  Calendar,
  Zap,
  Brain,
  Code2,
  BarChart3,
} from "lucide-react"

export default function StatisticsPage() {
  const weeklyData = [
    { day: "T2", sessions: 2, score: 78 },
    { day: "T3", sessions: 1, score: 85 },
    { day: "T4", sessions: 3, score: 72 },
    { day: "T5", sessions: 0, score: 0 },
    { day: "T6", sessions: 2, score: 88 },
    { day: "T7", sessions: 1, score: 91 },
    { day: "CN", sessions: 2, score: 82 },
  ]

  const skillsData = [
    { skill: "Data Structures", score: 85, color: "bg-primary" },
    { skill: "Algorithms", score: 72, color: "bg-accent" },
    { skill: "System Design", score: 68, color: "bg-success" },
    { skill: "OOP", score: 90, color: "bg-yellow-500" },
    { skill: "APIs & REST", score: 82, color: "bg-purple-500" },
    { skill: "Database", score: 75, color: "bg-pink-500" },
  ]

  const monthlyProgress = [
    { month: "T8", score: 62 },
    { month: "T9", score: 68 },
    { month: "T10", score: 74 },
    { month: "T11", score: 79 },
    { month: "T12", score: 82 },
  ]

  const achievements = [
    { icon: <Zap className="h-5 w-5" />, title: "Streak 7 ngày", desc: "Luyện tập 7 ngày liên tiếp", unlocked: true },
    { icon: <Target className="h-5 w-5" />, title: "Điểm hoàn hảo", desc: "Đạt 100% trong một bài", unlocked: true },
    { icon: <Brain className="h-5 w-5" />, title: "DSA Master", desc: "Hoàn thành 50 bài DSA", unlocked: false },
    { icon: <Code2 className="h-5 w-5" />, title: "Full-Stack Pro", desc: "Hoàn thành tất cả bộ JS", unlocked: false },
  ]

  const maxScore = Math.max(...weeklyData.map((d) => d.score))
  const maxSessions = Math.max(...weeklyData.map((d) => d.sessions))

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
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12">
        {/* Page Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">Thống kê & Phân tích</h1>
          <p className="text-muted-foreground">Theo dõi tiến độ và cải thiện kỹ năng của bạn</p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {[
            {
              label: "Tổng buổi",
              value: "24",
              change: "+3 tuần này",
              icon: <Calendar className="h-5 w-5" />,
              color: "text-primary",
            },
            {
              label: "Điểm TB",
              value: "82%",
              change: "+5% so với tháng trước",
              icon: <TrendingUp className="h-5 w-5" />,
              color: "text-success",
            },
            {
              label: "Thời gian",
              value: "18h",
              change: "Tổng thời gian luyện",
              icon: <Clock className="h-5 w-5" />,
              color: "text-accent",
            },
            {
              label: "Streak",
              value: "7",
              change: "ngày liên tiếp",
              icon: <Zap className="h-5 w-5" />,
              color: "text-yellow-500",
            },
          ].map((stat, i) => (
            <Card key={i} className="glass border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={stat.color}>{stat.icon}</span>
                  <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Weekly Activity Chart */}
          <Card className="glass border-0 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Hoạt động tuần này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-48">
                {weeklyData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                      {/* Score bar */}
                      <div
                        className="w-full max-w-8 bg-gradient-to-t from-primary to-accent rounded-t-md transition-all duration-500"
                        style={{ height: day.score ? `${(day.score / 100) * 100}%` : "4px" }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">{day.score || "-"}%</p>
                      <p className="text-xs text-muted-foreground">{day.day}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-primary to-accent" />
                  <span className="text-xs text-muted-foreground">Điểm trung bình</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Radar */}
          <Card className="glass border-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Kỹ năng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsData.map((skill, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{skill.skill}</span>
                      <span className="text-sm font-medium text-foreground">{skill.score}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${skill.color} rounded-full transition-all duration-700`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Monthly Progress */}
          <Card className="glass border-0 animate-fade-up" style={{ animationDelay: "0.25s" }}>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Tiến độ theo tháng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-muted-foreground">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                {/* Chart area */}
                <div className="ml-10 h-40 relative">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((line) => (
                    <div
                      key={line}
                      className="absolute left-0 right-0 border-t border-border/50"
                      style={{ bottom: `${line}%` }}
                    />
                  ))}
                  {/* Line chart */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d={`M 0 ${160 - (monthlyProgress[0].score / 100) * 160} ${monthlyProgress
                        .map((p, i) => `L ${(i / (monthlyProgress.length - 1)) * 100}% ${160 - (p.score / 100) * 160}`)
                        .join(" ")} L 100% 160 L 0 160 Z`}
                      fill="url(#areaGradient)"
                    />
                    {/* Line */}
                    <path
                      d={`M 0 ${160 - (monthlyProgress[0].score / 100) * 160} ${monthlyProgress
                        .map((p, i) => `L ${(i / (monthlyProgress.length - 1)) * 100}% ${160 - (p.score / 100) * 160}`)
                        .join(" ")}`}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Points */}
                    {monthlyProgress.map((p, i) => (
                      <circle
                        key={i}
                        cx={`${(i / (monthlyProgress.length - 1)) * 100}%`}
                        cy={160 - (p.score / 100) * 160}
                        r="6"
                        fill="#0a0a0f"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                      />
                    ))}
                  </svg>
                </div>
                {/* X-axis labels */}
                <div className="ml-10 flex justify-between mt-2 text-xs text-muted-foreground">
                  {monthlyProgress.map((p, i) => (
                    <span key={i}>{p.month}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="glass border-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Thành tựu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30"
                        : "bg-secondary/30 opacity-50"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${
                        achievement.unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <p className="font-medium text-foreground text-sm mb-1">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topic Performance */}
        <Card className="glass border-0 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Hiệu suất theo chủ đề
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {skillsData.map((skill, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-secondary/30">
                  <div className="relative h-20 w-20 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-secondary"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={`${(skill.score / 100) * 226} 226`}
                        strokeLinecap="round"
                        className={skill.color.replace("bg-", "text-")}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-foreground">{skill.score}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground font-medium">{skill.skill}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
