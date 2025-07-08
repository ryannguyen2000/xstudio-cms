// src/components/nav/ProjectNav.tsx
'use client'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  HomeIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

const ProjectNav: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()

  // Extract project ID from URL
  const projectId = pathname?.split('/').pop()

  const handleBackToDashboard = () => {
    router.push('/admin/collections/dashboard')
  }

  return (
    <nav className="bg-white border-r border-gray-200 w-64 h-full flex flex-col mt-10">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h2 className="font-semibold text-gray-900">Project Settings</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a
              href={`/admin/projects/${projectId}/overview`}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <HomeIcon className="w-5 h-5" />
              Overview
            </a>
          </li>
          <li>
            <a
              href={`/admin/projects/${projectId}/content`}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <DocumentTextIcon className="w-5 h-5" />
              Content Management
            </a>
          </li>
          <li>
            <a
              href={`/admin/projects/${projectId}/settings`}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              Settings
            </a>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">Project ID: {projectId}</p>
      </div>
    </nav>
  )
}

export default ProjectNav
