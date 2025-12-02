'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary cho các lỗi authentication
 * Bắt lỗi khi token hết hạn, network issue, etc.
 */
export class AuthErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error:', error, errorInfo)
    
    // Nếu là lỗi authentication, tự động logout
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      localStorage.removeItem('auth_user')
      window.location.href = '/login?error=session_expired'
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <h1 className="text-xl font-semibold mb-2">
              Đã xảy ra lỗi xác thực
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Phiên đăng nhập của bạn có thể đã hết hạn. Vui lòng đăng nhập lại.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/login'}
                className="w-full"
              >
                Đăng nhập lại
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => this.setState({ hasError: false })}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}