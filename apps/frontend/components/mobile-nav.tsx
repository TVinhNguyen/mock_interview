"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Menu,
  Sparkles,
  Home,
  LayoutDashboard,
  History,
  BarChart3,
  User,
  HelpCircle,
  Mail,
  Info,
  LogIn,
  UserPlus,
} from "lucide-react"

const mainNavItems = [
  { href: "/", label: "Trang chủ", icon: <Home className="h-5 w-5" /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/history", label: "Lịch sử", icon: <History className="h-5 w-5" /> },
  { href: "/statistics", label: "Thống kê", icon: <BarChart3 className="h-5 w-5" /> },
  { href: "/profile", label: "Hồ sơ", icon: <User className="h-5 w-5" /> },
]

const secondaryNavItems = [
  { href: "/about", label: "Về chúng tôi", icon: <Info className="h-5 w-5" /> },
  { href: "/faq", label: "FAQ", icon: <HelpCircle className="h-5 w-5" /> },
  { href: "/contact", label: "Liên hệ", icon: <Mail className="h-5 w-5" /> },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 hover:bg-primary/10">
          <Menu className="h-5 w-5 text-foreground" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] glass border-border p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">InterviewAI</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-100px)]">
          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">MENU CHÍNH</p>
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            <div className="h-px bg-border my-4" />

            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">THÔNG TIN</p>
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm text-muted-foreground">Chế độ tối</span>
              <ThemeToggle />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-border hover:bg-primary/10 hover:text-foreground bg-transparent"
                >
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4" />
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
