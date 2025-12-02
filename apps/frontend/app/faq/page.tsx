"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  ChevronLeft,
  Search,
  ChevronDown,
  HelpCircle,
  CreditCard,
  User,
  Shield,
  Zap,
  MessageSquare,
} from "lucide-react"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", label: "Tất cả", icon: <HelpCircle className="h-4 w-4" /> },
    { id: "account", label: "Tài khoản", icon: <User className="h-4 w-4" /> },
    { id: "billing", label: "Thanh toán", icon: <CreditCard className="h-4 w-4" /> },
    { id: "features", label: "Tính năng", icon: <Zap className="h-4 w-4" /> },
    { id: "security", label: "Bảo mật", icon: <Shield className="h-4 w-4" /> },
  ]

  const faqs = [
    {
      category: "account",
      question: "Làm thế nào để tạo tài khoản?",
      answer:
        "Bạn có thể tạo tài khoản bằng cách nhấp vào nút 'Đăng ký' ở góc trên bên phải. Bạn có thể đăng ký bằng email hoặc thông qua tài khoản Google/Facebook.",
    },
    {
      category: "account",
      question: "Tôi quên mật khẩu, phải làm sao?",
      answer:
        "Nhấp vào 'Quên mật khẩu' ở trang đăng nhập, nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu trong vòng vài phút.",
    },
    {
      category: "billing",
      question: "Các gói dịch vụ có giá bao nhiêu?",
      answer:
        "Chúng tôi có 3 gói: Miễn phí (0đ - giới hạn 3 buổi/tháng), Pro (299.000đ/tháng - không giới hạn), và Doanh nghiệp (liên hệ). Xem chi tiết tại trang Bảng giá.",
    },
    {
      category: "billing",
      question: "Tôi có thể hủy đăng ký bất cứ lúc nào không?",
      answer:
        "Có, bạn có thể hủy đăng ký bất cứ lúc nào từ trang Cài đặt. Bạn vẫn có thể sử dụng dịch vụ đến hết chu kỳ thanh toán hiện tại.",
    },
    {
      category: "billing",
      question: "Phương thức thanh toán nào được chấp nhận?",
      answer:
        "Chúng tôi chấp nhận thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), ví điện tử (Momo, ZaloPay), và chuyển khoản ngân hàng.",
    },
    {
      category: "features",
      question: "AI phỏng vấn hoạt động như thế nào?",
      answer:
        "AI của chúng tôi được huấn luyện trên hàng triệu câu hỏi phỏng vấn thực tế. Nó sẽ đặt câu hỏi, đánh giá câu trả lời của bạn, và đưa ra phản hồi chi tiết để bạn cải thiện.",
    },
    {
      category: "features",
      question: "Có bao nhiêu bộ phỏng vấn?",
      answer:
        "Hiện tại chúng tôi có hơn 20 bộ phỏng vấn cho các ngôn ngữ và framework phổ biến: Python, Java, JavaScript, React, Node.js, và nhiều hơn nữa. Chúng tôi liên tục cập nhật thêm.",
    },
    {
      category: "features",
      question: "Tôi có thể luyện tập không giới hạn không?",
      answer:
        "Với gói Miễn phí, bạn có 3 buổi/tháng. Với gói Pro hoặc Doanh nghiệp, bạn có thể luyện tập không giới hạn.",
    },
    {
      category: "security",
      question: "Dữ liệu của tôi có được bảo mật không?",
      answer:
        "Chúng tôi sử dụng mã hóa AES-256 cho tất cả dữ liệu. Chúng tôi không bao giờ chia sẻ thông tin cá nhân của bạn với bên thứ ba.",
    },
    {
      category: "security",
      question: "Các buổi phỏng vấn có được ghi lại không?",
      answer:
        "Chúng tôi chỉ lưu kết quả và phản hồi để bạn có thể xem lại. Bạn có thể xóa lịch sử bất cứ lúc nào từ trang Cài đặt.",
    },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    return matchesSearch && matchesCategory
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
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10">
              <ChevronLeft className="h-4 w-4" />
              Trang chủ
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-6 pt-28 pb-12 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-4xl font-bold text-foreground mb-4">Câu hỏi thường gặp</h1>
          <p className="text-xl text-muted-foreground">Tìm câu trả lời cho các thắc mắc của bạn</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-secondary/50 border-0 focus:ring-2 ring-primary rounded-xl"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className={`gap-2 ${
                activeCategory === cat.id
                  ? "bg-primary hover:bg-primary/90"
                  : "border-border hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              {cat.icon}
              {cat.label}
            </Button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {filteredFaqs.map((faq, index) => (
            <Card
              key={index}
              className={`glass border-0 overflow-hidden transition-all ${
                openIndex === index ? "bg-secondary/30" : ""
              }`}
            >
              <CardContent className="p-0">
                <button
                  className="w-full p-5 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="h-px bg-border mb-4" />
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredFaqs.length === 0 && (
            <Card className="glass border-0">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Không tìm thấy kết quả</h3>
                <p className="text-muted-foreground text-sm">Thử tìm kiếm với từ khóa khác hoặc liên hệ hỗ trợ.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact CTA */}
        <Card className="glass border-primary/30 mt-10 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Vẫn cần hỗ trợ?</h3>
            <p className="text-muted-foreground text-sm mb-4">Đội ngũ của chúng tôi luôn sẵn sàng giúp đỡ</p>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90">Liên hệ hỗ trợ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
