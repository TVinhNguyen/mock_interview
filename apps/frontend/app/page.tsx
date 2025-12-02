import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Code2,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Play,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Star,
  CheckCircle2,
  Quote,
  Building2,
  GraduationCap,
  Rocket,
  Target,
  BarChart3,
} from "lucide-react"
import { AIVisualizer } from "@/components/ai-visualizer"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[150px] animate-glow-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-glow-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent blur-lg opacity-50" />
            </div>
            <span className="text-xl font-bold text-foreground">InterviewAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Tính năng
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Cách hoạt động
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Đánh giá
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Bảng giá
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 rounded-full px-6">
                Bắt đầu miễn phí
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="flex flex-col animate-fade-up">
            <div className="mb-8 inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium w-fit">
              <div className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-accent">Nền tảng phỏng vấn AI hàng đầu Việt Nam</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-[1.1] text-foreground text-balance lg:text-7xl">
              Chinh phục mọi
              <span className="block text-gradient">Cuộc phỏng vấn</span>
            </h1>

            <p className="mb-10 text-xl leading-relaxed text-muted-foreground text-pretty max-w-lg">
              Luyện tập với AI thông minh, nhận phản hồi chi tiết và xây dựng sự tự tin để đạt được công việc mơ ước.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold hover:opacity-90 hover-glow transition-all"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Thử miễn phí ngay
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg bg-transparent border-border hover:bg-secondary"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Xem hướng dẫn
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex gap-10">
              {[
                { value: "50K+", label: "Phiên phỏng vấn" },
                { value: "95%", label: "Tỷ lệ thành công" },
                { value: "4.9", label: "Đánh giá" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="glass-strong rounded-3xl p-1">
              <div className="rounded-2xl bg-background/50 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-success/80" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">live session</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-success">Recording</span>
                  </div>
                </div>

                <div className="aspect-[4/3] flex items-center justify-center">
                  <AIVisualizer isActive={true} />
                </div>

                <div className="p-5 border-t border-border">
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm text-foreground">
                      <span className="text-accent font-semibold">AI:</span> Bạn có thể giải thích cách tiếp cận của
                      mình với thuật toán này không?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 glass rounded-2xl flex items-center justify-center animate-float">
              <Code2 className="h-10 w-10 text-accent" />
            </div>
            <div
              className="absolute -bottom-4 -left-4 w-20 h-20 glass rounded-2xl flex items-center justify-center animate-float"
              style={{ animationDelay: "1s" }}
            >
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-6">
          <p className="text-center text-muted-foreground mb-10">
            Được tin dùng bởi hàng nghìn ứng viên tại các công ty hàng đầu
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {["Google", "Microsoft", "Meta", "Amazon", "Apple", "Shopee", "VNG", "FPT"].map((company) => (
              <div key={company} className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-semibold">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-accent">Tính năng nổi bật</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-foreground text-balance lg:text-5xl">
              Mọi thứ bạn cần để
              <span className="text-gradient"> thành công</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Công cụ chuyên nghiệp được thiết kế cho việc chuẩn bị phỏng vấn nghiêm túc
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "Hội thoại AI thông minh",
                description:
                  "Luyện tập với AI thông minh có khả năng thích ứng với trình độ của bạn và tạo ra cuộc hội thoại tự nhiên.",
                gradient: "from-primary/20 to-primary/5",
              },
              {
                icon: <Code2 className="h-6 w-6" />,
                title: "Code Editor chuyên nghiệp",
                description:
                  "Viết và kiểm tra code trong IDE chuyên nghiệp với syntax highlighting và phản hồi real-time.",
                gradient: "from-accent/20 to-accent/5",
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Phân tích chi tiết",
                description: "Nhận phản hồi toàn diện với biểu đồ trực quan và đề xuất cải thiện cụ thể.",
                gradient: "from-success/20 to-success/5",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Đa ngôn ngữ lập trình",
                description:
                  "Luyện tập với Python, Java, JavaScript, C++, và nhiều hơn nữa. Chọn ngôn ngữ yêu thích của bạn.",
                gradient: "from-primary/20 to-primary/5",
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Phản hồi tức thì",
                description:
                  "Nhận phản hồi ngay lập tức về cách tiếp cận, chất lượng code và kỹ năng giao tiếp của bạn.",
                gradient: "from-accent/20 to-accent/5",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Theo dõi tiến độ",
                description: "Giám sát sự tiến bộ của bạn theo thời gian với phân tích chi tiết và lộ trình học tập.",
                gradient: "from-success/20 to-success/5",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group glass rounded-2xl p-8 hover-lift hover-glow cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium mb-6">
              <Rocket className="h-4 w-4 text-accent" />
              <span className="text-accent">Cách hoạt động</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-foreground text-balance lg:text-5xl">
              3 bước đơn giản để
              <span className="text-gradient"> thành thạo</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Quy trình được tối ưu hóa giúp bạn tiến bộ nhanh chóng
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                icon: <Target className="h-8 w-8" />,
                title: "Chọn vị trí & cấp độ",
                description:
                  "Lựa chọn loại phỏng vấn phù hợp với vị trí và cấp độ kinh nghiệm của bạn. Từ Junior đến Senior, Frontend đến Backend.",
              },
              {
                step: "02",
                icon: <MessageSquare className="h-8 w-8" />,
                title: "Phỏng vấn với AI",
                description:
                  "Tham gia phiên phỏng vấn thực tế với AI. Trả lời câu hỏi, viết code và giải thích cách tiếp cận của bạn.",
              },
              {
                step: "03",
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Nhận phản hồi & cải thiện",
                description: "Xem báo cáo chi tiết với điểm số, nhận xét và đề xuất cải thiện cụ thể cho từng kỹ năng.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
                <div className="glass rounded-3xl p-8 h-full hover-lift">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl font-bold text-gradient opacity-50">{item.step}</div>
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium mb-6">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-accent">Đánh giá từ người dùng</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-foreground text-balance lg:text-5xl">
              Câu chuyện
              <span className="text-gradient"> thành công</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Hàng nghìn người đã thành công với InterviewAI
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Nguyễn Văn An",
                role: "Software Engineer @ Google",
                avatar: "A",
                content:
                  "InterviewAI đã giúp tôi tự tin hơn rất nhiều. Sau 2 tuần luyện tập, tôi đã pass được vòng phỏng vấn kỹ thuật tại Google!",
                rating: 5,
              },
              {
                name: "Trần Thị Bình",
                role: "Frontend Developer @ Shopee",
                avatar: "B",
                content:
                  "Phản hồi chi tiết từ AI giúp tôi nhận ra những điểm yếu cần cải thiện. Giao diện đẹp và dễ sử dụng.",
                rating: 5,
              },
              {
                name: "Lê Minh Châu",
                role: "Backend Developer @ VNG",
                avatar: "C",
                content:
                  "Các câu hỏi rất sát với thực tế. Tôi đã gặp nhiều câu tương tự trong buổi phỏng vấn thật. Highly recommend!",
                rating: 5,
              },
              {
                name: "Phạm Hoàng Dũng",
                role: "Full-stack Developer @ FPT",
                avatar: "D",
                content:
                  "Code editor tích hợp rất tiện lợi. Có thể luyện tập mọi lúc mọi nơi. Đã giới thiệu cho cả nhóm của mình.",
                rating: 5,
              },
              {
                name: "Võ Thị Hà",
                role: "Data Engineer @ Microsoft",
                avatar: "H",
                content:
                  "Từ một fresher lo lắng, giờ tôi đã tự tin hơn nhiều khi đối diện với nhà tuyển dụng. Cảm ơn InterviewAI!",
                rating: 5,
              },
              {
                name: "Đỗ Quang Huy",
                role: "DevOps Engineer @ Grab",
                avatar: "H",
                content:
                  "Tính năng theo dõi tiến độ giúp tôi thấy rõ sự tiến bộ của mình. Rất motivating để tiếp tục luyện tập.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="glass rounded-2xl p-6 hover-lift">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4 text-accent" />
              <span className="text-accent">Bảng giá</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-foreground text-balance lg:text-5xl">
              Gói phù hợp với
              <span className="text-gradient"> mọi nhu cầu</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Bắt đầu miễn phí, nâng cấp khi cần
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                name: "Miễn phí",
                price: "0đ",
                period: "/ mãi mãi",
                description: "Hoàn hảo để bắt đầu",
                features: ["3 phiên phỏng vấn / tháng", "Câu hỏi cơ bản", "Báo cáo điểm số", "Code editor cơ bản"],
                cta: "Bắt đầu ngay",
                popular: false,
              },
              {
                name: "Pro",
                price: "199.000đ",
                period: "/ tháng",
                description: "Dành cho ai nghiêm túc",
                features: [
                  "Phỏng vấn không giới hạn",
                  "Tất cả các loại câu hỏi",
                  "Phản hồi AI chi tiết",
                  "Code editor nâng cao",
                  "Theo dõi tiến độ",
                  "Hỗ trợ ưu tiên",
                ],
                cta: "Dùng thử 7 ngày",
                popular: true,
              },
              {
                name: "Doanh nghiệp",
                price: "Liên hệ",
                period: "",
                description: "Cho team và công ty",
                features: [
                  "Mọi tính năng của Pro",
                  "Quản lý team",
                  "API access",
                  "Câu hỏi tùy chỉnh",
                  "Báo cáo tổng hợp",
                  "Account manager riêng",
                ],
                cta: "Liên hệ ngay",
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative glass rounded-3xl p-8 ${plan.popular ? "ring-2 ring-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Phổ biến nhất
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register" className="block">
                  <Button
                    className={`w-full rounded-xl h-12 font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-accent animate-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 400 400%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')] opacity-10" />

          <div className="relative p-12 text-center lg:p-20">
            <h2 className="mb-6 text-4xl font-bold text-primary-foreground text-balance lg:text-5xl">
              Sẵn sàng chinh phục phỏng vấn?
            </h2>
            <p className="mb-10 text-xl text-primary-foreground/90 text-pretty max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn lập trình viên đã đạt được công việc mơ ước với InterviewAI.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 rounded-full px-10 py-6 text-lg font-semibold"
              >
                <Play className="mr-2 h-5 w-5" />
                Bắt đầu luyện tập ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">InterviewAI</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Nền tảng luyện phỏng vấn AI hàng đầu, giúp bạn tự tin chinh phục mọi cuộc phỏng vấn.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Sản phẩm</h4>
              <ul className="space-y-3">
                {["Tính năng", "Bảng giá", "Doanh nghiệp", "Cập nhật"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Hỗ trợ</h4>
              <ul className="space-y-3">
                {["Trung tâm trợ giúp", "Liên hệ", "Hướng dẫn", "Blog"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Pháp lý</h4>
              <ul className="space-y-3">
                {["Điều khoản sử dụng", "Chính sách bảo mật", "Cookie"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">2025 InterviewAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
