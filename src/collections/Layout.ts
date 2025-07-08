// collections/Layouts.ts
import type { CollectionConfig } from 'payload'

export const Layouts: CollectionConfig = {
  slug: 'layouts',
  admin: {
    useAsTitle: 'documentName',
    group: 'Content',
    components: {
      views: {
        list: {
          Component: './views/LayoutsList',
        },
        edit: {
          default: {
            Component: './views/layoutEdit/index',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'projectId',
      type: 'text',
      required: true,
      admin: {
        description: 'Project ID from external API (e.g., prj_GEZopIYIWudzcPlJwMUOx2HBsdWx)',
      },
    },
    {
      name: 'uid',
      type: 'text',
      required: true,
      admin: {
        description: 'Unique identifier path (e.g., /)',
      },
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
      admin: {
        description: 'Reference to document ID',
      },
    },
    {
      name: 'typeLayout',
      type: 'select',
      required: true,
      options: [
        { label: 'Body', value: 'body' },
        { label: 'Header', value: 'header' },
        { label: 'Footer', value: 'footer' },
        { label: 'Sidebar', value: 'sidebar' },
      ],
      admin: {
        description: 'Type of layout component',
      },
    },
    {
      name: 'layoutId',
      type: 'text',
      required: true,
      admin: {
        description: 'Layout identifier',
      },
    },
    {
      name: 'documentName',
      type: 'text',
      admin: {
        description: 'Optional document name',
      },
    },
    {
      name: 'layoutJson',
      type: 'json',
      required: true,
      admin: {
        description: 'Layout configuration JSON containing mobile and desktop layouts',
        // Có thể ẩn trường này khỏi giao diện mặc định nếu bạn muốn chỉnh sửa hoàn toàn qua custom component
        // hidden: true,
      },
      validate: (value) => {
        if (!value) return 'Layout JSON is required'

        // Validate structure có mobile và desktop
        if (typeof value !== 'object') return 'Layout JSON must be an object'

        const requiredKeys = ['mobile', 'desktop']
        for (const key of requiredKeys) {
          if (!value[key]) {
            return `Layout JSON must contain ${key} configuration`
          }
          // if (!value[key].root) {
          //   return `Layout JSON ${key} must contain root element`
          // }
        }

        return true
      },
    },
  ],
  timestamps: true, // Tự động thêm createdAt và updatedAt
}
