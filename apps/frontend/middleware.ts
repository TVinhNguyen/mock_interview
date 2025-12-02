import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware đơn giản - chỉ kiểm tra có cookie hay không
 * KHÔNG validate với backend mỗi request (quá chậm, gây timeout)
 * 
 * Flow authentication:
 * 1. Login → Backend set HttpOnly cookie
 * 2. Middleware chỉ check cookie exists + JWT format + expiry
 * 3. API calls tự validate (credentials: 'include')
 * 4. Nếu token expired → API trả 401 → frontend redirect
 */

// Các route cần bảo vệ - yêu cầu đăng nhập
const protectedRoutes = [
  '/dashboard',
  '/interview',
  '/profile',
  '/history',
  '/statistics',
  '/scorecard',
]

// Các route auth - redirect nếu đã login
const authRoutes = ['/login', '/register']

/**
 * Kiểm tra format cơ bản của JWT token
 */
function isValidJWTFormat(token: string): boolean {
  if (!token || token.length < 10) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  return parts.every(part => part.length > 0 && /^[A-Za-z0-9_-]+$/.test(part))
}

/**
 * Kiểm tra JWT đã expired chưa (client-side check)
 * Không cần gọi backend - chỉ decode payload
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    
    // Decode payload (base64url)
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    )
    
    // Check exp claim
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip static files và API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Lấy token từ HttpOnly cookie
  const token = request.cookies.get('auth_token')?.value
  
  // Kiểm tra token có hợp lệ không (format + expiry, không gọi backend)
  const hasValidToken = token && 
                        token !== 'undefined' && 
                        token !== 'null' && 
                        isValidJWTFormat(token) &&
                        !isTokenExpired(token)
  
  // Kiểm tra route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  const isAuthRoute = authRoutes.includes(pathname)
  
  // Protected route + no valid token → redirect to login
  if (isProtectedRoute && !hasValidToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    
    const response = NextResponse.redirect(loginUrl)
    if (token) {
      response.cookies.delete('auth_token')
    }
    return response
  }
  
  // Auth route + valid token → redirect to dashboard
  if (isAuthRoute && hasValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Config để middleware chạy trên các routes cần thiết
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
