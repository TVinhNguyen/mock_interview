import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Internal API Gateway URL (trong Docker network)
const API_GATEWAY_INTERNAL = process.env.API_GATEWAY_INTERNAL || 'http://api-gateway:8000'

// Các route công khai - không cần đăng nhập
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/faq',
  '/demo',
]

// Các route cần bảo vệ - yêu cầu đăng nhập
const protectedRoutes = [
  '/dashboard',
  '/interview',
  '/profile',
  '/history',
  '/statistics',
  '/scorecard',
]

/**
 * Kiểm tra format cơ bản của JWT token
 * JWT format: header.payload.signature (3 parts separated by dots)
 */
function isValidJWTFormat(token: string): boolean {
  if (!token || token.length < 10) return false
  
  // JWT phải có 3 parts: header.payload.signature
  const parts = token.split('.')
  if (parts.length !== 3) return false
  
  // Mỗi part phải là base64url string (không rỗng)
  return parts.every(part => part.length > 0 && /^[A-Za-z0-9_-]+$/.test(part))
}

/**
 * Validate token với backend
 * - Dùng internal URL trong Docker network
 * - Timeout 1 giây (nhanh)
 * - Nếu fail → deny access (secure-fail)
 */
async function validateTokenWithBackend(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_GATEWAY_INTERNAL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(1000), // Timeout 1 giây
    })
    
    return response.ok
  } catch (error) {
    // Nếu backend không respond, DENY access (secure fail)
    // - Token không thể verify
    // - Tốt hơn allow access với token không biết
    console.error('Token validation failed:', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Lấy token từ cookie (vì middleware chạy server-side, không access được localStorage)
  const tokenValue = request.cookies.get('token')?.value
  
  // Kiểm tra token có format JWT hợp lệ không
  const hasValidFormat = tokenValue && 
                         tokenValue !== 'undefined' && 
                         tokenValue !== 'null' && 
                         isValidJWTFormat(tokenValue)
  
  // Validate token với backend nếu có format hợp lệ
  // Điều này kiểm tra: expiry, signature, user exists
  let isValidToken = false
  if (hasValidFormat) {
    isValidToken = await validateTokenWithBackend(tokenValue!)
  }
  
  // Tạo response
  const response = NextResponse.next()
  
  // Nếu token không hợp lệ, xóa cookie
  if (tokenValue && !isValidToken) {
    response.cookies.delete('token')
  }
  
  // Kiểm tra xem route có cần bảo vệ không
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Nếu là route cần bảo vệ và token không hợp lệ -> redirect về login
  if (isProtectedRoute && !isValidToken) {
    const loginUrl = new URL('/login', request.url)
    // Lưu lại URL hiện tại để redirect sau khi login
    loginUrl.searchParams.set('callbackUrl', pathname)
    const redirectResponse = NextResponse.redirect(loginUrl)
    // Xóa cookie không hợp lệ
    redirectResponse.cookies.delete('token')
    return redirectResponse
  }
  
  // Nếu đã có token hợp lệ mà vào trang login/register -> redirect về dashboard
  if (isValidToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return response
}

// Cấu hình các path mà middleware sẽ chạy
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}
