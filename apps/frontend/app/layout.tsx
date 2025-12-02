import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/toast-provider"
import { Header } from "@/components/header"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Mock Interview - Practice Technical Interviews with AI",
  description:
    "Master your technical interviews with AI-powered mock interviews. Get real-time feedback, coding challenges, and personalized improvement suggestions.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Header />
          {children}
          <ToastProvider />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
