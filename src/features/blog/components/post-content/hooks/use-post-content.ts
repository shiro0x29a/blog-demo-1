import { useState, useEffect, useMemo } from 'react'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { createConverters } from '../utils/converters'
import { sanitizeHtml } from '../utils/sanitize'
import type { LexicalRoot } from '../types'

/**
 * Хук для конвертации Lexical контента в HTML
 */
export const usePostContent = (content: LexicalRoot | null) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('')
  const converters = useMemo(() => createConverters(), [])

  useEffect(() => {
    if (!content?.root) {
      setSanitizedHtml('')
      return
    }

    try {
      const rawHtml = convertLexicalToHTML({
        data: content as any,
        converters,
      })
      
      const cleanHtml = sanitizeHtml(rawHtml)
      setSanitizedHtml(cleanHtml)
    } catch (error) {
      console.error('Failed to convert lexical content:', error)
      setSanitizedHtml('')
    }
  }, [content, converters])

  return sanitizedHtml
}
