import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export interface LayoutElement {
  id: string
  value: string
  type: string
  childs: string[]
  data?: {
    valueInput?: string
    cms?: {
      type?: 'text' | 'richText' | 'media'
      [key: string]: unknown
    }
  }
  media?: {
    url?: string
    option?: string
  }
  style_pc?: { backgroundImage?: string }
  style_mobile?: { backgroundImage?: string }
  style_tablet?: { backgroundImage?: string }
  style_laptop?: { backgroundImage?: string }
}

export interface LayoutDataTypes {
  [key: string]: unknown
  layoutJson: {
    mobile: {
      [key: string]: LayoutElement
    }
    desktop: {
      [key: string]: LayoutElement
    }
  }
  // Thêm field riêng cho RichText content
  richTextContent?: {
    mobile?: SerializedEditorState
    desktop?: SerializedEditorState
  }
}
