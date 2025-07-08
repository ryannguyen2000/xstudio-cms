/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Table, Card, Tag, Button, Space, Typography, Badge } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { apiService, Project } from '../services/apiService'
import _ from 'lodash'
import { useRouter } from 'next/navigation'
import BackButton from '@/ui/BackButton'

const { Title, Text } = Typography

interface DocumentItem {
  _id: string
  projectId: string
  documentId: string
  documentName: string
  thumbnail: string
  uid: string
  createdAt: string
  updatedAt: string
  __v: number
}

const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const projectId = searchParams.get('projectId')

  useEffect(() => {
    loadDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const data = await apiService.getDocuments(projectId || undefined)
      // Transform data to match DocumentItem type if necessary
      const documentItems: DocumentItem[] = data.map((doc: any) => ({
        _id: doc._id,
        projectId: doc.projectId,
        documentId: doc.documentId,
        documentName: doc.documentName,
        thumbnail: doc.thumbnail,
        uid: doc.uid,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        __v: doc.__v,
      }))
      setDocuments(documentItems)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns = [
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
      render: (text: string, record: DocumentItem) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{text || 'Untitled'}</div>
          <div className="text-xs text-gray-500">
            Path: <span className="font-mono bg-gray-100 px-1 rounded">{record.uid}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Document ID',
      dataIndex: 'documentId',
      key: 'documentId',
      render: (text: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{text}</code>
      ),
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => (
        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="text-xs text-gray-400">No image</div>
          )}
        </div>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => <div className="text-sm text-gray-600">{formatDate(date)}</div>,
      sorter: (a: DocumentItem, b: DocumentItem) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => <div className="text-sm text-gray-600">{formatDate(date)}</div>,
      sorter: (a: DocumentItem, b: DocumentItem) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: DocumentItem) => (
        <Space>
          {/* <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDocument(record)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            View
          </Button> */}
        </Space>
      ),
    },
  ]

  // const handleEditDocument = (document: DocumentItem) => {
  //   console.log('Edit document:', document)
  //   const layoutUrl = `/admin/collections/layouts?documentId=${document.documentId}`

  //   // Thêm query parameters nếu cần
  //   const queryParams = new URLSearchParams()

  //   const finalUrl = queryParams.toString() ? `${layoutUrl}?${queryParams.toString()}` : layoutUrl

  //   router.push(finalUrl)
  // }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading documents...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <BackButton />
      <div className="mb-6">
        <Title level={2} className="text-gray-900">
          Documents Management
        </Title>
        {currentProject && (
          <Tag color="blue" className="mt-2">
            Project: {currentProject.name}
          </Tag>
        )}
      </div>

      {_.isEmpty(documents) ? (
        <Card className="shadow-sm">
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">📄</div>
            <Text className="text-gray-500">
              No documents found{currentProject ? ` for ${currentProject.name}` : ''}.
            </Text>
          </div>
        </Card>
      ) : (
        <Card
          title={
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">Documents</span>
              <Badge count={documents.length} style={{ backgroundColor: '#3b82f6' }} />
            </div>
          }
          className="shadow-sm"
        >
          <Table
            dataSource={documents}
            columns={columns}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} documents`,
              className: 'mt-4',
            }}
            scroll={{ x: 800 }}
            className="border-0"
            rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
            onRow={(record) => ({
              onClick: () => {
                router.push(`/admin/collections/layouts?documentId=${record?.documentId}`)
              },
            })}
          />
        </Card>
      )}
    </div>
  )
}

export default DocumentsList
