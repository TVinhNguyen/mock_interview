"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          backdropFilter: "blur(12px)",
        },
        success: {
          iconTheme: {
            primary: "hsl(var(--success))",
            secondary: "hsl(var(--success-foreground))",
          },
        },
        error: {
          iconTheme: {
            primary: "hsl(var(--destructive))",
            secondary: "hsl(var(--destructive-foreground))",
          },
        },
      }}
    />
  )
}
