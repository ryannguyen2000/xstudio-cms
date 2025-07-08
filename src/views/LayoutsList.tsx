/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Table, Card, Tag, Space, Typography, Badge } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import _ from 'lodash'
import { useRouter } from 'next/navigation'

import { apiService } from '../services/apiService'
import BackButton from '@/ui/BackButton'

const { Title, Text } = Typography

interface LayoutItem {
  _id: string
  projectId: string
  typeLayout: string
  layoutId: string
  documentName?: string
  uid?: string
  documentId?: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  layoutJson: {
    mobile: any
    desktop: any
  }
}

const LayoutsList: React.FC = () => {
  const [bodyLayouts, setBodyLayouts] = useState<LayoutItem[]>([])
  const [footerLayouts, setFooterLayouts] = useState<LayoutItem[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()

  const documentId = searchParams.get('documentId')

  useEffect(() => {
    loadLayouts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])

  const loadLayouts = async () => {
    setLoading(true)
    try {
      const dataBodyLayouts = await apiService.getCmsLayouts({
        documentId: documentId || undefined,
        type: 'body',
      })
      const dataFooterLayouts = await apiService.getCmsLayouts({
        documentId: documentId || undefined,
        type: 'footer',
      })
      setBodyLayouts(dataBodyLayouts)
      setFooterLayouts(dataFooterLayouts)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  // Phân loại documents theo typeLayout
  const newBodyLayouts = bodyLayouts.filter((doc) => doc.typeLayout === 'body')
  const newFooterLayouts = footerLayouts.filter((doc) => doc.typeLayout === 'footer')

  // Columns cho bảng Body Documents
  const bodyColumns = [
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
      render: (text: string, record: LayoutItem) => (
        <div>
          <Text strong>{text || 'Untitled'}</Text>
          {record.uid && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Path: {record.uid}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Document ID',
      dataIndex: 'documentId',
      key: 'documentId',
      render: (text: string) => (
        <Text code style={{ fontSize: '11px' }}>
          {text || 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished: boolean) => (
        <Tag
          icon={isPublished ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          color={isPublished ? 'success' : 'warning'}
        >
          {isPublished ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: (a: LayoutItem, b: LayoutItem) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => formatDate(date),
      sorter: (a: LayoutItem, b: LayoutItem) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          {/* <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleEditDocument(record)}
          >
            View
          </Button> */}
        </Space>
      ),
    },
  ]

  // Columns cho bảng Footer Documents
  const footerColumns = [
    {
      title: 'Layout ID',
      dataIndex: 'layoutId',
      key: 'layoutId',
      render: (text: string) => (
        <Text code style={{ fontSize: '11px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Global',
      dataIndex: 'isGlobal',
      key: 'isGlobal',
      render: (type: string) => <Tag color="purple">{type ? 'true' : 'falseÏ'}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'typeLayout',
      key: 'typeLayout',
      render: (type: string) => <Tag color="purple">{type.toUpperCase()}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished: boolean) => (
        <Tag
          icon={isPublished ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          color={isPublished ? 'success' : 'warning'}
        >
          {isPublished ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
      sorter: (a: LayoutItem, b: LayoutItem) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => formatDate(date),
      sorter: (a: LayoutItem, b: LayoutItem) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: LayoutItem) => (
        <Space>
          {/* <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDocument(record)}
          >
            View
          </Button> */}
        </Space>
      ),
    },
  ]

  const handleEditDocument = (layout: LayoutItem) => {
    // Xây dựng URL chuyển hướng đến trang chỉnh sửa trong Payload Admin
    const adminEditUrl = `/admin/collections/layouts/${layout._id}`

    // Thêm các query parameters (projectId và documentId)
    const queryParams = new URLSearchParams()
    if (layout.projectId) {
      queryParams.append('projectId', layout.projectId)
    }
    if (layout.documentId) {
      queryParams.append('documentId', layout.documentId)
    }

    // Kết hợp URL và query parameters
    const finalUrl = queryParams.toString()
      ? `${adminEditUrl}?${queryParams.toString()}`
      : adminEditUrl

    // Chuyển hướng sử dụng useRouter
    router.push(finalUrl)
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <div>Loading layouts...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <BackButton />
        <Title level={2}>Layouts Management</Title>
      </div>

      {_.isEmpty(newBodyLayouts) ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Text type="secondary">No Layouts found.</Text>
          </div>
        </Card>
      ) : (
        <div>
          {/* Body Documents Table */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Body Layouts</span>
                <Badge count={newBodyLayouts.length} style={{ backgroundColor: '#52c41a' }} />
              </div>
            }
            style={{ marginBottom: '24px' }}
          >
            <Table
              dataSource={bodyLayouts}
              columns={bodyColumns}
              rowKey="_id"
              rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 800 }}
              onRow={(record) => ({
                onClick: () => {
                  handleEditDocument(record)
                },
              })}
            />
          </Card>

          {/* Footer Layouts Table */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Footer Layouts</span>
                <Badge count={footerLayouts.length} style={{ backgroundColor: '#722ed1' }} />
              </div>
            }
          >
            <Table
              dataSource={newFooterLayouts}
              columns={footerColumns}
              rowKey="_id"
              rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 800 }}
              onRow={(record) => ({
                onClick: () => {
                  handleEditDocument(record)
                },
              })}
            />
          </Card>
        </div>
      )}
    </div>
  )
}

export default LayoutsList
