"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sparkles,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Headphones,
  Clock,
  CheckCircle2,
} from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "support@interviewai.vn",
      href: "mailto:support@interviewai.vn",
    },
    { icon: <Phone className="h-5 w-5" />, label: "Điện thoại", value: "+84 28 1234 5678", href: "tel:+842812345678" },
    { icon: <MapPin className="h-5 w-5" />, label: "Địa chỉ", value: "Quận 1, TP. Hồ Chí Minh", href: "#" },
    { icon: <Clock className="h-5 w-5" />, label: "Giờ làm việc", value: "T2-T6: 9:00 - 18:00", href: "#" },
  ]

  const supportOptions = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Chat trực tuyến",
      desc: "Hỗ trợ nhanh trong giờ làm việc",
      action: "Bắt đầu chat",
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Hỗ trợ kỹ thuật",
      desc: "Giải đáp thắc mắc về sản phẩm",
      action: "Gửi yêu cầu",
    },
  ]

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
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
              <ChevronLeft className="h-4 w-4" />
              Trang chủ
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl font-bold text-foreground mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-xl text-muted-foreground">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {contactInfo.map((info, i) => (
            <a key={i} href={info.href} className="block">
              <Card className="glass border-0 h-full hover:bg-secondary/30 transition-all">
                <CardContent className="p-4 text-center">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                    {info.icon}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{info.label}</p>
                  <p className="text-sm font-medium text-foreground">{info.value}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="glass border-0 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Gửi tin nhắn</CardTitle>
              <CardDescription>Điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Gửi thành công!</h3>
                  <p className="text-muted-foreground mb-4">Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="border-border hover:bg-primary/10 hover:text-foreground"
                  >
                    Gửi tin nhắn khác
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">
                        Họ tên
                      </Label>
                      <Input
                        id="name"
                        placeholder="Nhập họ tên"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-secondary/50 border-0 focus:ring-2 ring-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-secondary/50 border-0 focus:ring-2 ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">
                      Chủ đề
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Tiêu đề tin nhắn"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-secondary/50 border-0 focus:ring-2 ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">
                      Nội dung
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Nhập nội dung tin nhắn..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-secondary/50 border-0 focus:ring-2 ring-primary resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2">
                    <Send className="h-4 w-4" />
                    Gửi tin nhắn
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Support Options */}
          <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Kênh hỗ trợ khác</h3>
            {supportOptions.map((option, i) => (
              <Card key={i} className="glass border-0 group hover:bg-secondary/30 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{option.title}</h4>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                      {option.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* FAQ Link */}
            <Card className="glass border-primary/30 mt-8">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-foreground mb-2">Câu hỏi thường gặp?</h4>
                <p className="text-sm text-muted-foreground mb-4">Xem qua các câu hỏi phổ biến trước khi liên hệ</p>
                <Link href="/faq">
                  <Button
                    variant="outline"
                    className="border-border hover:bg-primary/10 hover:text-foreground bg-transparent"
                  >
                    Xem FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
