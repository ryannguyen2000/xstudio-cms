'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { ButtonProps } from 'antd'

interface BackButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * Custom back behavior
   * - 'router' (default): Use Next.js router.back()
   * - 'history': Use browser history.back()
   * - string: Navigate to specific path
   * - function: Custom onClick handler
   */
  backTo?: 'router' | 'history' | string | (() => void)

  /**
   * Show back icon
   * @default true
   */
  showIcon?: boolean

  /**
   * Button text
   * @default "Quay lại"
   */
  text?: string

  /**
   * Confirm before going back
   */
  confirmMessage?: string

  /**
   * Custom className for styling
   */
  className?: string
}

const BackButton: React.FC<BackButtonProps> = ({
  backTo = 'router',
  showIcon = true,
  text = 'Back',
  confirmMessage,
  className = '',
  type = 'default',
  ...buttonProps
}) => {
  const router = useRouter()

  const handleBack = () => {
    // Show confirmation if provided
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return
    }

    if (typeof backTo === 'function') {
      // Custom function
      backTo()
    } else if (typeof backTo === 'string') {
      if (backTo === 'router') {
        // Use Next.js router
        router.back()
      } else if (backTo === 'history') {
        // Use browser history
        window.history.back()
      } else {
        // Navigate to specific path
        router.push(backTo)
      }
    }
  }

  return (
    <Button
      type={type}
      icon={showIcon ? <ArrowLeftOutlined /> : undefined}
      onClick={handleBack}
      className={`flex items-center ${className}`}
      {...buttonProps}
    >
      {text}
    </Button>
  )
}

export default BackButton

// Export các preset variants thường dùng
export const BackButtonPrimary: React.FC<Omit<BackButtonProps, 'type'>> = (props) => (
  <BackButton type="primary" {...props} />
)

export const BackButtonText: React.FC<Omit<BackButtonProps, 'type'>> = (props) => (
  <BackButton type="text" {...props} />
)

export const BackButtonLink: React.FC<Omit<BackButtonProps, 'type'>> = (props) => (
  <BackButton type="link" {...props} />
)

// Utility component với custom styling
export const BackButtonFloating: React.FC<BackButtonProps> = (props) => (
  <BackButton
    type="primary"
    shape="circle"
    size="large"
    showIcon={true}
    text=""
    className="fixed top-4 left-4 z-50 shadow-lg hover:shadow-xl transition-shadow"
    {...props}
  />
)

// Component với breadcrumb style
export const BreadcrumbBackButton: React.FC<BackButtonProps & { breadcrumb?: string }> = ({
  breadcrumb,
  ...props
}) => (
  <div className="flex items-center gap-2 mb-4">
    <BackButton type="text" size="small" className="p-0 h-auto" {...props} />
    {breadcrumb && <span className="text-gray-500 text-sm">/ {breadcrumb}</span>}
  </div>
)
