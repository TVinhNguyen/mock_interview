"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000'

// Types
export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  job_title: string | null
  experience_level: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  full_name: string
  job_title?: string
  experience_level?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Storage keys
const USER_STORAGE_KEY = "auth_user"

// Helper để lấy user từ localStorage (client-side only)
function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// Helper để lưu user vào localStorage
function setStoredUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_STORAGE_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const isAuthenticated = !!user

  // Verify session với backend
  const verifySession = useCallback(async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Gửi HttpOnly cookie
      })
      
      if (response.ok) {
        const userData = await response.json()
        return userData
      }
      return null
    } catch (error) {
      console.error('Session verification failed:', error)
      return null
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      // Cleanup old localStorage keys (migration from old auth system)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('auth_status')
        // Giữ 'user' key cũ nếu tồn tại, sẽ overwrite bằng auth_user
      }
      
      // Lấy user từ localStorage trước (instant UI)
      const storedUser = getStoredUser()
      if (storedUser) {
        setUser(storedUser)
      }
      
      // Verify với backend (async)
      const verifiedUser = await verifySession()
      
      if (verifiedUser) {
        setUser(verifiedUser)
        setStoredUser(verifiedUser)
      } else if (storedUser) {
        // Token invalid, clear stored user
        setUser(null)
        setStoredUser(null)
      }
      
      setIsLoading(false)
    }
    
    initAuth()
  }, [verifySession])

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Nhận HttpOnly cookie
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: "Email hoặc mật khẩu không đúng" }
        }
        if (response.status === 422 && Array.isArray(data.detail)) {
          return { success: false, error: "Dữ liệu không hợp lệ" }
        }
        return { success: false, error: data.detail || "Đăng nhập thất bại" }
      }
      
      // Lưu user data
      const userData: User = data.user
      setUser(userData)
      setStoredUser(userData)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: "Không thể kết nối đến server" }
    }
  }, [])

  // Register function
  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        if (response.status === 400) {
          return { success: false, error: result.detail || "Email đã được sử dụng" }
        }
        return { success: false, error: result.detail || "Đăng ký thất bại" }
      }
      
      // Lưu user data
      const userData: User = result.user
      setUser(userData)
      setStoredUser(userData)
      
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: "Không thể kết nối đến server" }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    // Clear state
    setUser(null)
    setStoredUser(null)
    
    // Redirect to login
    router.push('/login')
  }, [router])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const userData = await verifySession()
    if (userData) {
      setUser(userData)
      setStoredUser(userData)
    }
  }, [verifySession])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook để sử dụng auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook để bảo vệ route (client-side)
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isAuthenticated, router, redirectTo, pathname])
  
  return { isLoading, isAuthenticated }
}
