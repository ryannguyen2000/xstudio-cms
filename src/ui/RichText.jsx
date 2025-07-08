// // components/RichText.jsx - Alternative approach
// import React, { useRef, useEffect } from 'react'
// import { Editor } from '@tinymce/tinymce-react'
// import { apiService } from '@/services/apiService'

// import './CustomRichTextField.css'

// const RichTextEditor = ({
//   value,
//   onChangeRichText,
//   placeholder = 'Nhập nội dung...',
//   height = 300,
// }) => {
//   const editorRef = useRef(null)
//   const valueRef = useRef(value)
//   const isExternalUpdateRef = useRef(false)

//   // Update internal value reference when prop changes
//   useEffect(() => {
//     valueRef.current = value
//   }, [value])

//   // Only update editor when value changes externally (not from user input)
//   useEffect(() => {
//     if (editorRef.current && value !== undefined) {
//       const currentContent = editorRef.current.getContent()

//       // Only update if there's a real difference and it's not from user input
//       if (value !== currentContent) {
//         isExternalUpdateRef.current = true
//         editorRef.current.setContent(value || '')

//         // Reset flag after update
//         setTimeout(() => {
//           isExternalUpdateRef.current = false
//         }, 100)
//       }
//     }
//   }, [value])

//   const handleImageUpload = (blobInfo, progress) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const result = await apiService.uploadMediaToServer(blobInfo.blob())
//         if (result) {
//           resolve(result)
//         } else {
//           reject('Upload failed')
//         }
//       } catch (error) {
//         reject(error.message || 'Upload failed')
//       }
//     })
//   }

//   const editorConfig = {
//     height: height,
//     menubar: false,
//     plugins: [
//       'advlist',
//       'autolink',
//       'lists',
//       'link',
//       'image',
//       'charmap',
//       'preview',
//       'anchor',
//       'searchreplace',
//       'visualblocks',
//       'code',
//       'fullscreen',
//       'insertdatetime',
//       'media',
//       'table',
//       'help',
//       'wordcount',
//       'autoresize',
//     ],
//     toolbar:
//       'undo redo | fontfamily fontsize | blocks | bold italic forecolor backcolor | alignleft aligncenter ' +
//       'alignright alignjustify | bullist numlist outdent indent | ' +
//       'removeformat | image media table | code fullscreen | help',
//     content_style: `
//       body {
//         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         font-size: 14px;
//         line-height: 1.6;
//         margin: 8px;
//       }
//       img { max-width: 100%; height: auto; }
//     `,
//     placeholder: placeholder,
//     automatic_uploads: true,
//     images_upload_handler: handleImageUpload,
//     images_reuse_filename: true,
//     image_advtab: true,
//     image_title: true,
//     image_description: false,
//     object_resizing: true,
//     resize_img_proportional: true,
//     media_live_embeds: true,
//     table_responsive_width: true,
//     table_default_attributes: { class: 'table table-bordered' },
//     paste_data_images: true,
//     paste_as_text: false,
//     smart_paste: true,
//     browser_spellcheck: true,
//     contextmenu: 'link image table',

//     setup: (editor) => {
//       let changeTimeout = null

//       // Handle content changes with debouncing
//       const handleContentChange = () => {
//         // Skip if this is an external update
//         if (isExternalUpdateRef.current) {
//           return
//         }

//         // Clear previous timeout
//         if (changeTimeout) {
//           clearTimeout(changeTimeout)
//         }

//         // Debounce the change event
//         changeTimeout = setTimeout(() => {
//           const content = editor.getContent()
//           if (content !== valueRef.current && onChangeRichText) {
//             valueRef.current = content
//             onChangeRichText(content)
//           }
//         }, 500) // 500ms debounce - adjust as needed
//       }

//       // Use only the input event for typing
//       editor.on('input', handleContentChange)

//       // Handle other events that should trigger immediate updates
//       editor.on('paste undo redo', () => {
//         setTimeout(() => {
//           if (!isExternalUpdateRef.current) {
//             const content = editor.getContent()
//             if (content !== valueRef.current && onChangeRichText) {
//               valueRef.current = content
//               onChangeRichText(content)
//             }
//           }
//         }, 100)
//       })

//       // Clean up timeout on destroy
//       editor.on('remove', () => {
//         if (changeTimeout) {
//           clearTimeout(changeTimeout)
//         }
//       })
//     },
//   }

//   return (
//     <div className="tinymce-wrapper">
//       <Editor
//         apiKey="ph5m1gyz6f527lvr3clk7jjqktju37rkzpeyoc2ucemrxyj7"
//         onInit={(evt, editor) => {
//           editorRef.current = editor
//         }}
//         initialValue={value || ''}
//         init={editorConfig}
//       />
//     </div>
//   )
// }

// export default RichTextEditor
// components/RichText.jsx - Basic Example Style
// components/RichText.jsx - Basic Example Style
import React, { useRef, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { apiService } from '@/services/apiService'

import './CustomRichTextField.css'

const RichTextEditor = ({
  value,
  onChangeRichText,
  placeholder = 'Nhập nội dung...',
  height = 500, // Đổi thành 500 như basic example
}) => {
  const editorRef = useRef(null)
  const valueRef = useRef(value)
  const isExternalUpdateRef = useRef(false)

  // Update internal value reference when prop changes
  useEffect(() => {
    valueRef.current = value
  }, [value])

  // Only update editor when value changes externally (not from user input)
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentContent = editorRef.current.getContent()

      // Only update if there's a real difference and it's not from user input
      if (value !== currentContent) {
        isExternalUpdateRef.current = true
        editorRef.current.setContent(value || '')

        // Reset flag after update
        setTimeout(() => {
          isExternalUpdateRef.current = false
        }, 100)
      }
    }
  }, [value])

  const handleImageUpload = (blobInfo, progress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await apiService.uploadMediaToServer(blobInfo.blob())
        if (result) {
          resolve(result)
        } else {
          reject('Upload failed')
        }
      } catch (error) {
        reject(error.message || 'Upload failed')
      }
    })
  }

  const editorConfig = {
    height: height,
    menubar: true, // Bật menubar để hiển thị File, Edit, Insert, View, Format, Tools, Table, Help

    // Plugins giống basic example
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'help',
      'wordcount',
    ],

    // Toolbar giống basic example
    toolbar:
      'undo redo | blocks | ' +
      'bold italic backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',

    // Content style giống basic example
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',

    placeholder: placeholder,
    automatic_uploads: true,
    images_upload_handler: handleImageUpload,
    images_reuse_filename: true,
    image_advtab: true,
    image_title: true,
    image_description: false,
    object_resizing: true,
    resize_img_proportional: true,
    media_live_embeds: true,
    table_responsive_width: true,
    table_default_attributes: { class: 'table table-bordered' },
    paste_data_images: true,
    paste_as_text: false,
    smart_paste: true,
    browser_spellcheck: true,
    contextmenu: 'link image table',

    setup: (editor) => {
      let changeTimeout = null

      // Handle content changes with debouncing
      const handleContentChange = () => {
        // Skip if this is an external update
        if (isExternalUpdateRef.current) {
          return
        }

        // Clear previous timeout
        if (changeTimeout) {
          clearTimeout(changeTimeout)
        }

        // Debounce the change event
        changeTimeout = setTimeout(() => {
          const content = editor.getContent()
          if (content !== valueRef.current && onChangeRichText) {
            valueRef.current = content
            onChangeRichText(content)
          }
        }, 500) // 500ms debounce - adjust as needed
      }

      // Use only the input event for typing
      editor.on('input', handleContentChange)

      // Handle other events that should trigger immediate updates
      editor.on('paste undo redo', () => {
        setTimeout(() => {
          if (!isExternalUpdateRef.current) {
            const content = editor.getContent()
            if (content !== valueRef.current && onChangeRichText) {
              valueRef.current = content
              onChangeRichText(content)
            }
          }
        }, 100)
      })

      // Clean up timeout on destroy
      editor.on('remove', () => {
        if (changeTimeout) {
          clearTimeout(changeTimeout)
        }
      })
    },
  }

  return (
    <div className="tinymce-wrapper">
      <Editor
        apiKey="ph5m1gyz6f527lvr3clk7jjqktju37rkzpeyoc2ucemrxyj7"
        onInit={(evt, editor) => {
          editorRef.current = editor
        }}
        initialValue={value || ''}
        init={editorConfig}
      />
    </div>
  )
}

export default RichTextEditor
