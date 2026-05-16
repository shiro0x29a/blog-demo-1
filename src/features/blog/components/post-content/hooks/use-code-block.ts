import { useState, useEffect } from 'react'
import type { CodeBlock } from '../types'

/**
 * Хук для извлечения блоков кода из HTML контента
 */
export const useCodeBlocks = (
  sanitizedHtml: string,
  containerRef: React.RefObject<HTMLDivElement | null>
): CodeBlock[] => {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([])

  useEffect(() => {
    if (!containerRef.current || !sanitizedHtml) {
      setCodeBlocks([])
      return
    }

    const markers = containerRef.current.querySelectorAll('[data-code-block]')
    const blocks = Array.from(markers).map((marker, index) => ({
      id: `code-block-${index}-${Date.now()}`,
      element: marker,
      language: marker.getAttribute('data-code-block') || 'text',
      code: marker.getAttribute('data-code-content') || '',
    }))
    
    setCodeBlocks(blocks)
  }, [sanitizedHtml, containerRef])

  return codeBlocks
}
