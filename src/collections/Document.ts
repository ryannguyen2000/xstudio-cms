// collections/Documents.ts
import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    components: {
      views: {
        list: {
          Component: './views/DocumentsList',
        },
      },
    },
  },
  fields: [
    {
      name: 'externalId',
      type: 'text',
      admin: {
        description: 'ID from external API',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'projectId',
      type: 'text',
      required: true,
      admin: {
        description: 'Project ID from external API',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Requirements', value: 'requirements' },
        { label: 'Design', value: 'design' },
        { label: 'Development', value: 'development' },
        { label: 'Testing', value: 'testing' },
      ],
    },
    {
      name: 'layoutJson',
      type: 'json', // Định nghĩa trường layoutJson là kiểu JSON
      admin: {
        // Có thể ẩn trường này khỏi giao diện mặc định nếu bạn muốn chỉnh sửa hoàn toàn qua custom component
        hidden: true,
      },
    },
  ],
}
