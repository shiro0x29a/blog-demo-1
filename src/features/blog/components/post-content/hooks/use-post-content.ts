import { useState, useEffect } from 'react'
import { parseContentWithCodeBlocks, type ContentPart } from '../utils/parse-content'
import { sanitizeHtml } from '../utils/sanitize'
import type { LexicalRoot } from '../types'

/**
 * Хук для конвертации Lexical контента в части (HTML + блоки кода)
 */
export const usePostContent = (content: LexicalRoot | null): ContentPart[] => {
  const [contentParts, setContentParts] = useState<ContentPart[]>([])

  useEffect(() => {
    if (!content?.root) {
      setContentParts([])
      return
    }

    try {
      const parts = parseContentWithCodeBlocks(content)
      
      // Санитизируем только HTML части
      const sanitizedParts = parts.map(part => {
        if (part.type === 'html') {
          return {
            ...part,
            content: sanitizeHtml(part.content)
          }
        }
        return part
      })
      
      setContentParts(sanitizedParts)
    } catch (error) {
      console.error('Failed to parse content:', error)
      setContentParts([])
    }
  }, [content])

  return contentParts
}
