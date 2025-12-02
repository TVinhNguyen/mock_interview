"use client"

export function ScoreDonut({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 120
  const offset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 80) return "#10b981"
    if (score >= 60) return "#6366f1"
    return "#f43f5e"
  }

  const getGradient = (score: number) => {
    if (score >= 80) return "url(#gradient-success)"
    if (score >= 60) return "url(#gradient-primary)"
    return "url(#gradient-danger)"
  }

  return (
    <div className="relative h-80 w-80">
      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 280 280">
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="gradient-danger" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle with glass effect */}
        <circle cx="140" cy="140" r="120" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="24" fill="none" />

        {/* Progress circle with gradient and glow */}
        <circle
          cx="140"
          cy="140"
          r="120"
          stroke={getGradient(score)}
          strokeWidth="24"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          filter="url(#glow)"
          style={{
            filter: `drop-shadow(0 0 20px ${getColor(score)}40)`,
          }}
        />
      </svg>

      {/* Center content with modern styling */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-7xl font-bold text-gradient">{score}</div>
        <div className="text-lg text-muted-foreground mt-2">out of 100</div>
      </div>

      {/* Decorative glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20 -z-10"
        style={{
          background: `radial-gradient(circle, ${getColor(score)}, transparent)`,
        }}
      />
    </div>
  )
}
