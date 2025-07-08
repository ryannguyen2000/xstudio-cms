/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { apiService, Project } from '../../services/apiService'
import Image from 'next/image'

// SVG Icon Components
const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
)

const MediaIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  count?: number
}

interface PageTypeItem {
  label: string
  count: number
  href: string
}

interface StatusItem {
  label: string
  count: number
  color: string
}

const ContentCMSSidebar = () => {
  const pathname = usePathname()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  // Load projects khi component mount
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const projectsData = await apiService.getProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Navigation items
  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <DashboardIcon />,
    },
    {
      label: 'Media Library',
      href: '/admin/collections/media',
      icon: <MediaIcon />,
    },
  ]

  // Page Types với count
  const pageTypes: PageTypeItem[] = [
    { label: 'Projects', count: 12, href: '/admin/collections/projects' },
  ]

  // Status items
  const statusItems: StatusItem[] = [
    { label: 'Published', count: 18, color: 'text-green-600' },
    { label: 'Draft', count: 6, color: 'text-yellow-600' },
    { label: 'Scheduled', count: 2, color: 'text-blue-600' },
  ]

  const isActiveLink = (href: string) => {
    return pathname === href
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 justify-center">
          <Image width={100} height={100} src="/assets/logoXStudio.png" alt="" />
          <div></div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Navigation
          </h2>
          <nav className="space-y-1">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Page Types Section */}
        <div className="p-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Page Types
          </h2>
          <nav className="space-y-1">
            {pageTypes.map((pageType, index) => (
              <Link
                key={index}
                href={pageType.href}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                  isActiveLink(pageType.href)
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{pageType.label}</span>
                {/* <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {pageType.count}
                </span> */}
              </Link>
            ))}
          </nav>
        </div>

        {/* Status Section */}
        <div className="p-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Status
          </h2>
          <div className="space-y-2">
            {statusItems.map((status, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-1">
                <span className={`text-sm ${status.color}`}>{status.label}</span>
                {/* <span className="text-xs font-medium text-gray-900">{status.count}</span> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <SettingsIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContentCMSSidebar
