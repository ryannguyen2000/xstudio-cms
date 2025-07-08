import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    components: {
      views: {
        list: {
          Component: './views/ProjectsList.tsx',
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Draft', value: 'draft' },
      ],
    },
  ],
}
