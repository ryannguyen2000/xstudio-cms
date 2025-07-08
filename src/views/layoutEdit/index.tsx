'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDocumentInfo, useForm } from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation'
import {
  Upload,
  Button as AntButton,
  Select,
  Input,
  message,
  Image,
  Switch,
  Card,
  Badge,
  Tooltip,
} from 'antd'
import {
  InboxOutlined,
  SaveOutlined,
  MobileOutlined,
  DesktopOutlined,
  FileImageOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { apiService } from '@/services/apiService'
import type { UploadProps } from 'antd'
import BackButton from '@/ui/BackButton'

import RichTextEditor from '@/ui/RichText'
import { LayoutDataTypes, LayoutElement } from './types'

const { Dragger } = Upload

const LayoutEdit: React.FC = () => {
  const { id } = useDocumentInfo()
  const form = useForm()
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'desktop'>('desktop')
  const [layoutData, setLayoutData] = useState<LayoutDataTypes | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  const updateLayoutElement = useCallback(
    (elementId: string, field: string, value: string) => {
      if (!layoutData?.layoutJson) return

      const updatedLayout = JSON.parse(JSON.stringify(layoutData.layoutJson))
      const element = updatedLayout[selectedDevice][elementId]

      if (!element) {
        message.error(`Không tìm thấy element với ID ${elementId}`)
        return
      }

      if (field === 'text') {
        element.data.cms = { ...element.data.cms, valueInput: value }
      } else if (field === 'media') {
        element.data.cms = { ...element.data.cms, url: value }
      } else if (field === 'richText') {
        element.data.cms = { ...element.data.cms, richText: value }
      }

      const newLayoutData = { ...layoutData, layoutJson: updatedLayout }
      setLayoutData(newLayoutData)
      setHasChanges(true)

      // Thử các cách update form
      // if (typeof form.setFieldValue === 'function') {
      //   form.setFieldValue('layoutJson', updatedLayout)
      // } else if (typeof form.setValue === 'function') {
      //   form.setValue('layoutJson', updatedLayout)
      // } else if (typeof form.dispatch === 'function') {
      //   form.dispatch({
      //     type: 'UPDATE',
      //     path: 'layoutJson',
      //     value: updatedLayout,
      //   })
      // } else if (typeof form.dispatchFields === 'function') {
      //   form.dispatchFields({
      //     type: 'UPDATE',
      //     path: 'layoutJson',
      //     value: updatedLayout,
      //   })
      // } else {
      //   console.warn('No method found to update form field')
      // }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutData, selectedDevice, form],
  )

  const handleRichTextChange = useCallback(
    (newContent: string, elementId: string) => {
      if (!layoutData || !layoutData.layoutJson) return

      // Kiểm tra xem content có thực sự thay đổi không
      const currentElement = layoutData.layoutJson[selectedDevice][elementId]
      if (currentElement?.data?.cms?.richText === newContent) {
        return // Không có thay đổi, bỏ qua
      }

      updateLayoutElement(elementId, 'richText', newContent)
    },
    [layoutData, selectedDevice, updateLayoutElement],
  )

  useEffect(() => {
    loadDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, id])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const data = await apiService.getCmsLayoutDetail(id?.toString() || '')
      console.log('Loaded layout data:', data)
      setLayoutData(data)
    } catch (error) {
      console.error('Error loading documents:', error)
      message.error('Không thể tải dữ liệu layout')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const response = await apiService.uploadMediaToServer(file)
      return response
    } catch (error) {
      message.error('Lỗi khi upload hình ảnh')
      throw error
    }
  }

  const handleSave = async () => {
    if (!hasChanges) return

    setLoading(true)
    try {
      // Cách 1: Thử submit trực tiếp
      if (typeof form.submit === 'function') {
        await form.submit()
        // if (result) {
        //   message.success('Lưu thay đổi thành công')
        //   setHasChanges(false)
        //   await loadDocuments()
        // }
        message.success('Lưu thay đổi thành công')
        setHasChanges(false)
        await loadDocuments()
      }
      // Cách 2: Thử với dữ liệu manual
      else {
        // Fallback: Gọi API trực tiếp với Payload format
        const payload = {
          layoutJson: layoutData?.layoutJson,
          richTextContent: layoutData?.richTextContent, // Thêm RichText content
        }

        const response = await fetch(`/api/layouts/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          message.success('Lưu thay đổi thành công')
          setHasChanges(false)
          await loadDocuments()
        } else {
          throw new Error('Failed to save')
        }
      }
    } catch (error) {
      console.error('Error saving document:', error)
      message.error('Lỗi khi lưu thay đổi')
    } finally {
      setLoading(false)
    }
  }

  const createDraggerProps = (elementId: string, field: string): UploadProps => ({
    name: 'file',
    multiple: false,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file: File) => {
      // Validate file type
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('Chỉ chấp nhận file hình ảnh!')
        return Upload.LIST_IGNORE
      }

      // Validate file size (max 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('Hình ảnh phải nhỏ hơn 5MB!')
        return Upload.LIST_IGNORE
      }

      handleImageUpload(file)
        .then((url) => {
          updateLayoutElement(elementId, 'media', url)
          message.success('Upload thành công!')
        })
        .catch((error) => {
          console.error('Upload error:', error)
          message.error('Upload thất bại!')
        })

      return false // Prevent default upload
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  })

  const renderImagePreview = (url: string, title: string, elementId?: string, field?: string) => {
    if (!url) return null

    return (
      <div className="mt-3">
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-2">
          <Image
            src={url}
            alt={title}
            width={200}
            height={120}
            className="rounded-md object-cover"
            preview={{
              mask: <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">Preview</div>,
            }}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip title="Xóa ảnh">
              <button
                onClick={() => elementId && field && updateLayoutElement(elementId, 'media', '')}
                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-colors"
              >
                <DeleteOutlined className="text-xs" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }

  const renderCompactUpload = (elementId: string, field: string, currentUrl?: string) => {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={currentUrl || ''}
            onChange={(e) => updateLayoutElement(elementId, 'media', e.target.value)}
            placeholder="Nhập URL hình ảnh hoặc upload file"
            className="flex-1"
            prefix={<FileImageOutlined className="text-gray-400" />}
          />
          <Upload {...createDraggerProps(elementId, field)}>
            <AntButton icon={<UploadOutlined />} className="px-3">
              Upload
            </AntButton>
          </Upload>
        </div>

        {currentUrl && renderImagePreview(currentUrl, `Image ${elementId}`, elementId, 'media')}

        {!currentUrl && (
          <Dragger
            {...createDraggerProps(elementId, field)}
            className="!border-dashed !border-gray-300 !bg-gray-50/50 hover:!border-blue-400 hover:!bg-blue-50/50 transition-colors"
            style={{ padding: '16px' }}
          >
            <div className="text-center py-2">
              <InboxOutlined className="text-2xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Kéo thả hoặc click để upload</p>
              <p className="text-xs text-gray-400">JPG, PNG, GIF, WEBP (max 5MB)</p>
            </div>
          </Dragger>
        )}
      </div>
    )
  }

  const getElementIcon = (elementType: string) => {
    switch (elementType) {
      case 'Image':
        return <FileImageOutlined className="text-blue-500" />
      case 'Button':
        return <EditOutlined className="text-green-500" />
      case 'Text':
        return <EditOutlined className="text-purple-500" />
      case 'Link':
        return <EditOutlined className="text-orange-500" />
      default:
        return <EditOutlined className="text-gray-500" />
    }
  }

  const renderElementForm = (elementId: string, element: LayoutElement) => {
    const contentTypes = ['Text', 'Button', 'Link']
    const layoutTypes = ['grid', 'flex']
    const styleKeys = ['style_mobile', 'style_tablet', 'style_laptop', 'style_pc']

    return (
      <Card
        key={elementId}
        className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getElementIcon(element.value)}
              {/* <span className="font-semibold">{element?.name}</span> */}
              {/* <Badge count={elementId} className="!bg-gray-100 !text-gray-600 !text-xs" /> */}
            </div>
          </div>
        }
        size="small"
      >
        {/* element?.data?.cms?.type ===
            'richText' ? */}
        {/* Content elements với rich text */}
        {contentTypes.includes(element.value) &&
          (element?.data?.cms?.type === 'richText' ? (
            <div className="mb-4">
              <RichTextEditor
                key={`${elementId}-${selectedDevice}`} // Thêm key để tránh conflict
                value={element.data?.cms?.richText || ''}
                onChangeRichText={(textContent: string) =>
                  handleRichTextChange(textContent, elementId)
                }
                placeholder="Nhập nội dung cho element này..."
                height={250}
              />
            </div>
          ) : (
            <div className="mb-4">
              <Input onChange={(e) => updateLayoutElement(elementId, 'text', e?.target?.value)} />
            </div>
          ))}

        {/* Image elements */}
        {element?.data?.cms?.type === 'media' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Media:</label>
            {/* {renderCompactUpload(elementId, 'media', element.data?.cms?.url)} */}
          </div>
        )}

        {/* Layout elements với background images */}
        {layoutTypes.includes(element.value) && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FileImageOutlined />
              Background Images
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {styleKeys.map(
                (styleKey) =>
                  element[styleKey as keyof LayoutElement] && (
                    <div
                      key={styleKey}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50/50"
                    >
                      <h5 className="text-sm font-medium mb-3 capitalize text-gray-700 flex items-center gap-2">
                        {selectedDevice === 'mobile' ? <MobileOutlined /> : <DesktopOutlined />}
                        {styleKey.replace('style_', '')} Background
                      </h5>

                      {/* {renderCompactUpload(
                        elementId,
                        styleKey,
                        element[styleKey as keyof LayoutElement]?.backgroundImage
                          ?.replace(/^url\(/, '')
                          .replace(/\)$/, '') || '',
                      )} */}
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
      </Card>
    )
  }

  const handleChangePublish = async (value: boolean) => {
    try {
      await apiService.updateCmsLayout({
        isPublished: value,
        cmsLayoutId: layoutData?._id as string,
        layoutId: layoutData?.layoutId as string,
      })
      message.success(`Layout ${value ? 'published' : 'unpublished'} successfully`)
    } catch (error) {
      console.log(error)
      message.error('Failed to update publish status')
    }
  }

  if (!layoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md w-full text-center shadow-lg">
          {loading ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="py-8">
              <div className="text-gray-400 text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Layout data is not found</h3>
              <p className="text-gray-500">This document has no JSON layout or defective data.</p>
            </div>
          )}
        </Card>
      </div>
    )
  }

  const currentDeviceLayout = layoutData?.layoutJson ? layoutData?.layoutJson[selectedDevice] : {}
  const elementCount = Object.keys(currentDeviceLayout).filter((key) => key !== 'root').length

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-scroll overflow-x-hidden">
      {/* Header cố định */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-start">
              <BackButton />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Layout Editor</h2>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={selectedDevice}
                onChange={(value) => setSelectedDevice(value as 'mobile' | 'desktop')}
                className="w-36"
                size="middle"
              >
                <Select.Option value="desktop">
                  <div className="flex items-center gap-2">
                    <DesktopOutlined />
                    Desktop
                  </div>
                </Select.Option>
                <Select.Option value="mobile">
                  <div className="flex items-center gap-2">
                    <MobileOutlined />
                    Mobile
                  </div>
                </Select.Option>
              </Select>

              {hasChanges && (
                <AntButton
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={loading}
                  className="shadow-sm"
                >
                  Save Changes
                </AntButton>
              )}

              <Switch
                onChange={handleChangePublish}
                checkedChildren={
                  <>
                    <EyeOutlined /> Published
                  </>
                }
                unCheckedChildren="Draft"
                defaultChecked
                className="bg-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {selectedDevice === 'mobile' ? <MobileOutlined /> : <DesktopOutlined />}
              {selectedDevice === 'mobile' ? 'Mobile' : 'Desktop'} Layout
            </h3>
            <Badge
              count={`${elementCount} elements`}
              className="!bg-blue-100 !text-blue-800 !border-blue-200"
            />
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              {/* <span className="font-medium">Document:</span> {layoutData?.documentName || 'N/A'} */}
            </p>
            <p>
              {/* <span className="font-medium">Path:</span> {layoutData?.uid || 'N/A'} •{' '} */}
              <span className="font-medium">Elements:</span> {elementCount}
            </p>
          </div>
        </div>

        {elementCount === 0 ? (
          <Card className="text-center py-12 border-dashed border-2 border-gray-300">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Chưa có elements</h3>
            <p className="text-gray-500">
              Layout {selectedDevice} hiện tại chưa có elements nào để chỉnh sửa.
            </p>
          </Card>
        ) : (
          <div className="space-y-4 flex flex-col gap-4">
            {Object.entries(currentDeviceLayout)
              .filter(([elementId]) => elementId !== 'root')
              .map(([elementId, element]) => renderElementForm(elementId, element))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LayoutEdit
