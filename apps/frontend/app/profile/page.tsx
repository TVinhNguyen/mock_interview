"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  User,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  Camera,
  Check,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Volume2,
  Smartphone,
} from "lucide-react"

export default function ProfilePage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    marketing: false,
  })

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+84 123 456 789",
    location: "Hồ Chí Minh, Việt Nam",
    company: "Tech Company",
    website: "johndoe.dev",
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
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
              <ChevronLeft className="h-4 w-4" />
              Quay lại Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12 max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">JD</span>
              </div>
              <button className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">Gói Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <TabsList className="glass border-0 p-1 mb-6">
            <TabsTrigger
              value="profile"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="h-4 w-4" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Bell className="h-4 w-4" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <CreditCard className="h-4 w-4" />
              Thanh toán
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-foreground">Thông tin cá nhân</CardTitle>
                <CardDescription>Cập nhật thông tin hồ sơ của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Họ và tên
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="pl-10 bg-secondary/50 border-0 focus:ring-2 ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="pl-10 bg-secondary/50 border-0 focus:ring-2 ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Số điện thoại
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="pl-10 bg-secondary/50 border-0 focus:ring-2 ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-foreground">
                      Địa điểm
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="pl-10 bg-secondary/50 border-0 focus:ring-2 ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-foreground">
                      Công ty
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        className="pl-10 bg-secondary/50 border-0 focus:ring-2 ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-foreground">
                      Website
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        className="pl-10 bg-secondary/50 border-0 focus:ring-2 ring-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <Check className="h-4 w-4" />
                    Lưu thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-foreground">Cài đặt thông báo</CardTitle>
                <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Thông báo qua Email</p>
                      <p className="text-sm text-muted-foreground">Nhận thông báo về kết quả và cập nhật</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Thông báo đẩy</p>
                      <p className="text-sm text-muted-foreground">Nhận thông báo trên trình duyệt</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Báo cáo tuần</p>
                      <p className="text-sm text-muted-foreground">Nhận tổng kết tiến độ hàng tuần</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.weekly}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weekly: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Volume2 className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Tin tức & Khuyến mãi</p>
                      <p className="text-sm text-muted-foreground">Nhận thông tin về tính năng mới và ưu đãi</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-foreground">Đổi mật khẩu</CardTitle>
                <CardDescription>Cập nhật mật khẩu để bảo vệ tài khoản</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-foreground">
                    Mật khẩu hiện tại
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-secondary/50 border-0 focus:ring-2 ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-foreground">
                    Mật khẩu mới
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-secondary/50 border-0 focus:ring-2 ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground">
                    Xác nhận mật khẩu mới
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-secondary/50 border-0 focus:ring-2 ring-primary"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="bg-primary hover:bg-primary/90">Cập nhật mật khẩu</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-foreground">Xác thực 2 bước</CardTitle>
                <CardDescription>Thêm lớp bảo mật cho tài khoản của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">Sử dụng ứng dụng như Google Authenticator</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border hover:bg-primary/10 hover:text-foreground bg-transparent"
                  >
                    Thiết lập
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0 border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
                <CardDescription>Các hành động không thể hoàn tác</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10">
                  <div>
                    <p className="font-medium text-foreground">Xóa tài khoản</p>
                    <p className="text-sm text-muted-foreground">Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu</p>
                  </div>
                  <Button variant="destructive" className="bg-destructive hover:bg-destructive/90">
                    Xóa tài khoản
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="glass border-0 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Sparkles className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Gói Pro</h3>
                      <p className="text-muted-foreground">Thanh toán hàng tháng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-foreground">
                      299.000<span className="text-lg text-muted-foreground">đ/tháng</span>
                    </p>
                    <p className="text-sm text-success">Gia hạn: 15/01/2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-foreground">Phương thức thanh toán</CardTitle>
                <CardDescription>Quản lý thẻ thanh toán của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Hết hạn 12/2025</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Mặc định
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-dashed border-border hover:bg-primary/10 hover:text-foreground bg-transparent"
                >
                  + Thêm phương thức thanh toán
                </Button>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="text-foreground">Lịch sử thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "15/12/2024", amount: "299.000đ", status: "Thành công" },
                    { date: "15/11/2024", amount: "299.000đ", status: "Thành công" },
                    { date: "15/10/2024", amount: "299.000đ", status: "Thành công" },
                  ].map((payment, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                      <div>
                        <p className="font-medium text-foreground">{payment.date}</p>
                        <p className="text-sm text-muted-foreground">Gói Pro - Hàng tháng</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{payment.amount}</p>
                        <p className="text-sm text-success">{payment.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <div className="mt-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  )
}
