// src/components/nav/index.tsx
'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

import DefaultNav from './DefaultNav'
import ProjectNav from './ProjectNav'
import './index.scss'

const CustomNav: React.FC = () => {
  const pathname = usePathname()

  // Kiểm tra nếu đang ở route projects
  const isProjectRoute = pathname?.includes('/admin/projects/')

  if (isProjectRoute) {
    return <ProjectNav />
  }

  return <DefaultNav />
}

export default CustomNav
