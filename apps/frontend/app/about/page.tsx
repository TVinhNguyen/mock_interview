import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Globe, Linkedin, ArrowRight, ChevronLeft, Heart, Zap, Shield, Brain } from "lucide-react"

export default function AboutPage() {
  const team = [
    { name: "Nguyễn Văn A", role: "Founder & CEO", avatar: "NV", linkedin: "#" },
    { name: "Trần Thị B", role: "CTO", avatar: "TT", linkedin: "#" },
    { name: "Lê Văn C", role: "Head of AI", avatar: "LV", linkedin: "#" },
    { name: "Phạm Thị D", role: "Product Lead", avatar: "PT", linkedin: "#" },
  ]

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Tận tâm",
      desc: "Chúng tôi đặt sự thành công của người dùng lên hàng đầu",
    },
    { icon: <Zap className="h-6 w-6" />, title: "Đổi mới", desc: "Liên tục cập nhật công nghệ AI tiên tiến nhất" },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Tin cậy",
      desc: "Bảo mật dữ liệu và quyền riêng tư của người dùng",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Thông minh",
      desc: "AI được huấn luyện bởi các chuyên gia hàng đầu",
    },
  ]

  const stats = [
    { value: "50K+", label: "Người dùng" },
    { value: "1M+", label: "Buổi phỏng vấn" },
    { value: "85%", label: "Tỷ lệ thành công" },
    { value: "4.9", label: "Đánh giá" },
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

      <div className="container mx-auto px-6 pt-28 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Về <span className="text-gradient">InterviewAI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sứ mệnh của chúng tôi là giúp mọi lập trình viên tự tin vượt qua các buổi phỏng vấn kỹ thuật
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {stats.map((stat, i) => (
            <Card key={i} className="glass border-0 text-center">
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-gradient mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <h2 className="text-3xl font-bold text-foreground mb-4">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                InterviewAI được thành lập vào năm 2024 bởi một nhóm kỹ sư phần mềm từng trải qua những buổi phỏng vấn
                đầy căng thẳng tại các công ty công nghệ hàng đầu.
              </p>
              <p>
                Chúng tôi hiểu rằng kỹ năng phỏng vấn là một thứ cần được rèn luyện, và không phải ai cũng có điều kiện
                để luyện tập với người thật. Đó là lý do InterviewAI ra đời.
              </p>
              <p>
                Với công nghệ AI tiên tiến, chúng tôi tạo ra trải nghiệm phỏng vấn giả lập chân thực nhất, giúp bạn tự
                tin hơn khi đối mặt với nhà tuyển dụng.
              </p>
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Card className="glass border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-foreground font-semibold">Phục vụ người dùng toàn cầu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, i) => (
              <Card key={i} className="glass border-0 group hover:bg-secondary/30 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Đội ngũ của chúng tôi</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <Card key={i} className="glass border-0 group hover:bg-secondary/30 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                    {member.avatar}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                  <a href={member.linkedin} className="text-primary hover:text-primary/80 transition-colors">
                    <Linkedin className="h-5 w-5 mx-auto" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="glass border-primary/30 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Sẵn sàng bắt đầu?</h2>
            <p className="text-muted-foreground mb-6">
              Tham gia cùng hàng nghìn lập trình viên đã cải thiện kỹ năng phỏng vấn
            </p>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                Bắt đầu miễn phí
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
