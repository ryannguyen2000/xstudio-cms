'use client'

import React, { useEffect, useState } from 'react'
import { Space, Table, Tag, Button } from 'antd'
import type { TableProps } from 'antd'
import { useRouter } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'

import { apiService, Project } from '../services/apiService'

interface ProjectDataType {
  key: string
  projectDisplayName: string
  ownerId: string
  createdAt: string
  ownersGroupId: string[]
}

// Định nghĩa cột cho bảng
const columns: TableProps<ProjectDataType>['columns'] = [
  {
    title: 'Project Name',
    dataIndex: 'projectDisplayName',
    key: 'projectDisplayName',
    render: (text) => <span className="font-medium text-blue-600">{text}</span>,
  },
  {
    title: 'Owner ID',
    dataIndex: 'ownerId',
    key: 'ownerId',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) =>
      new Date(text).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  },
  {
    title: 'Owners Group',
    dataIndex: 'ownersGroupId',
    key: 'ownersGroupId',
    render: (ownersGroupId: string[]) => (
      <>
        {ownersGroupId.map((id) => (
          <Tag color="blue" key={id} className="m-1">
            {id}
          </Tag>
        ))}
      </>
    ),
  },
]

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await apiService.getProjects(user?.id)
        setProjects(response?.data || [])
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  // Ánh xạ dữ liệu projects sang định dạng bảng
  const dataSource: ProjectDataType[] = projects.map((project) => ({
    key: project?.projectId,
    projectDisplayName: project?.projectDisplayName,
    ownerId: project?.ownerId,
    createdAt: project?.createdAt,
    ownersGroupId: project?.ownersGroupId,
  }))

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Projects List</h1>
      {loading ? (
        <div className="text-center text-gray-600">Loading projects...</div>
      ) : (
        <Table<ProjectDataType>
          columns={columns}
          dataSource={dataSource}
          className="shadow-md rounded-lg bg-white"
          rowClassName="hover:bg-gray-50 cursor-pointer"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => {
              router.push(`/admin/collections/documents?projectId=${record?.key}`)
            },
          })}
        />
      )}
    </div>
  )
}

export default ProjectsList
