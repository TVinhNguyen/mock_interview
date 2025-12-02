"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const passwordStrength = (pass: string) => {
    if (pass.length === 0) return 0
    if (pass.length < 6) return 1
    if (pass.length < 8) return 2
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[!@#$%^&*]/.test(pass)) return 4
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3
    return 2
  }

  // Validate email format
  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailStr)
  }

  const strength = passwordStrength(password)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const emailValid = email.length === 0 || isValidEmail(email)
  const isFormValid = name.length > 0 && email.length > 0 && isValidEmail(email) && password.length >= 6 && passwordsMatch && agreed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Xử lý lỗi validation (422)
        if (response.status === 422 && Array.isArray(data.detail)) {
          const emailError = data.detail.find((err: { loc: string[] }) => err.loc?.includes("email"))
          if (emailError) {
            throw new Error("Email không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: ten@example.com)")
          }
          throw new Error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.")
        }
        // Xử lý lỗi email đã tồn tại
        if (data.detail === "Email already registered" || response.status === 400) {
          throw new Error("Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.")
        }
        throw new Error(data.detail || "Đăng ký thất bại")
      }

      // Lưu token vào cả localStorage và cookie (cookie cho middleware)
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      document.cookie = `token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    // TODO: Implement Google OAuth
    console.log("Google register")
  }

  const handleGitHubRegister = () => {
    // TODO: Implement GitHub OAuth
    console.log("GitHub register")
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4 sm:px-6 pt-20 pb-10">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] animate-glow-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] animate-glow-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Register Form Container */}
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Tạo tài khoản mới</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Bắt đầu hành trình chinh phục phỏng vấn của bạn
          </p>
        </div>

        {/* Register Card */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8">
          {/* Error message */}
          {error && (
            <div className="mb-4 sm:mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Social Register Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="h-11 sm:h-12 bg-transparent border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="hidden sm:inline">Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGitHubRegister}
              disabled={isLoading}
              className="h-11 sm:h-12 bg-transparent border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-5 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs sm:text-sm bg-card text-muted-foreground">hoặc đăng ký bằng email</span>
            </div>
          </div>

          {/* Email Register Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-sm text-foreground">Họ và tên</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="h-11 sm:h-12 pl-10 bg-secondary/50 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ten@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={`h-11 sm:h-12 pl-10 bg-secondary/50 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary ${
                    email.length > 0 && !emailValid ? "border-destructive focus:ring-destructive" : ""
                  }`}
                />
              </div>
              {email.length > 0 && !emailValid && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Email không hợp lệ (ví dụ: ten@example.com)
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm text-foreground">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 sm:h-12 pl-10 pr-10 bg-secondary/50 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strength >= level
                            ? strength <= 2
                              ? "bg-destructive"
                              : strength === 3
                                ? "bg-yellow-500"
                                : "bg-success"
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Độ mạnh: {strength <= 2 ? "Yếu" : strength === 3 ? "Trung bình" : "Mạnh"}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm text-foreground">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={`h-11 sm:h-12 pl-10 pr-10 bg-secondary/50 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary ${
                    confirmPassword.length > 0 && !passwordsMatch ? "border-destructive focus:ring-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-xs flex items-center gap-1 ${passwordsMatch ? "text-success" : "text-destructive"}`}>
                  {passwordsMatch ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {passwordsMatch ? "Mật khẩu khớp" : "Mật khẩu không khớp"}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                disabled={isLoading}
                className="mt-0.5 flex-shrink-0"
              />
              <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                Tôi đồng ý với <Link href="/terms" className="text-primary hover:underline">Điều khoản</Link> và <Link href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang tạo tài khoản...
                </>
              ) : (
                <>
                  Tạo tài khoản
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-5 sm:mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
