// hooks/useRichText.ts
import { useState, useCallback } from 'react'
import { RichText as RichTextComponent } from '@payloadcms/richtext-lexical/react'

interface UseRichTextProps {
  initialValue?: any
  onChange?: (value: any) => void
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
  }
}

interface UseRichTextReturn {
  value: any
  setValue: (value: any) => void
  htmlContent: string
  textContent: string
  isEmpty: boolean
  error: string | null
  isValid: boolean
  reset: () => void
  getWordCount: () => number
  getCharacterCount: () => number
}

export const useRichText = ({
  initialValue = null,
  onChange,
  validation = {},
}: UseRichTextProps): UseRichTextReturn => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)

  // Validate content
  const validateContent = useCallback(
    (content: any) => {
      const { required, minLength, maxLength } = validation

      if (required && (!content || !content.root || !content.root.children?.length)) {
        return 'This field is required'
      }

      if (content && (minLength || maxLength)) {
        const textContent = getTextFromLexical(content)

        if (minLength && textContent.length < minLength) {
          return `Content must be at least ${minLength} characters`
        }

        if (maxLength && textContent.length > maxLength) {
          return `Content must not exceed ${maxLength} characters`
        }
      }

      return null
    },
    [validation],
  )

  // Update value with validation
  const updateValue = useCallback(
    (newValue: any) => {
      setValue(newValue)

      const validationError = validateContent(newValue)
      setError(validationError)

      if (onChange) {
        onChange(newValue)
      }
    },
    [validateContent, onChange],
  )

  // Get HTML content (simplified for now)
  const htmlContent = value ? JSON.stringify(value) : ''

  // Get plain text content
  const textContent = getTextFromLexical(value)

  // Check if content is empty
  const isEmpty = !value || !value.root || !value.root.children?.length

  // Check if content is valid
  const isValid = error === null

  // Reset content
  const reset = useCallback(() => {
    setValue(initialValue)
    setError(null)
  }, [initialValue])

  // Get word count
  const getWordCount = useCallback(() => {
    return textContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }, [textContent])

  // Get character count
  const getCharacterCount = useCallback(() => {
    return textContent.length
  }, [textContent])

  return {
    value,
    setValue: updateValue,
    htmlContent,
    textContent,
    isEmpty,
    error,
    isValid,
    reset,
    getWordCount,
    getCharacterCount,
  }
}

// Helper function to extract text from Lexical content
function getTextFromLexical(content: any): string {
  if (!content || !content.root) return ''

  function extractText(node: any): string {
    if (!node) return ''

    if (node.type === 'text') {
      return node.text || ''
    }

    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractText).join('')
    }

    return ''
  }

  return extractText(content.root)
}
