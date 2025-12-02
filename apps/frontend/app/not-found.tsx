"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
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
        </nav>
      </header>

      <div className="container mx-auto px-6 text-center">
        {/* 404 Illustration */}
        <div className="mb-8 animate-fade-up">
          <div className="relative inline-block">
            {/* Animated circles */}
            <div className="absolute -inset-20 animate-pulse">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-primary/30 rounded-full blur-xl" />
            </div>

            {/* 404 Text */}
            <h1 className="text-[150px] md:text-[200px] font-bold text-gradient leading-none relative">404</h1>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-3xl font-bold text-foreground mb-4">Oops! Trang không tồn tại</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 gap-2 px-6">
                <Home className="h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
            <Button
              variant="outline"
              className="gap-2 border-border hover:bg-primary/10 hover:text-foreground bg-transparent"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-sm text-muted-foreground mb-4">Hoặc thử các trang phổ biến:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/about", label: "Về chúng tôi" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Liên hệ" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
