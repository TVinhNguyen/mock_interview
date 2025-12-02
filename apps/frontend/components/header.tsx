"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { Notifications } from "@/components/notifications"
import { Sparkles, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // Don't show on interview page
  if (pathname === "/interview") return null

  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">InterviewAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "Trang chủ" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/about", label: "Giới thiệu" },
            { href: "/faq", label: "FAQ" },
            { href: "/contact", label: "Liên hệ" },
          ].map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={`text-sm ${
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated && <Notifications />}
          <ThemeToggle />

          {!isAuthPage && !isLoading && (
            <>
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    {/* User Menu khi đã đăng nhập */}
                    <Link href="/profile">
                      <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10 gap-2">
                        <User className="h-4 w-4" />
                        {user?.full_name || "Tài khoản"}
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Auth Buttons khi chưa đăng nhập */}
                    <Link href="/login">
                      <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10">
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-primary hover:bg-primary/90">Đăng ký</Button>
                    </Link>
                  </>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu */}
          <MobileNav />
        </div>
      </nav>
    </header>
  )
}
