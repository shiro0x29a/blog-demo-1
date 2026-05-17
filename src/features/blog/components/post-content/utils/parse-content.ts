import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { LexicalRoot, LexicalNode } from '../types'
import { createConverters } from './converters'

export type ContentPart = 
  | { type: 'html', content: string }
  | { type: 'code', language: string, code: string }

/**
 * Парсит Lexical контент и разделяет на HTML части и блоки кода
 */
export function parseContentWithCodeBlocks(content: LexicalRoot): ContentPart[] {
  if (!content?.root) {
    return []
  }

  // Собираем все блоки кода из Lexical JSON
  const codeBlocks: Array<{ language: string, code: string }> = []
  
  const extractCodeBlocks = (nodes: LexicalNode[]) => {
    nodes.forEach(node => {
      if (node.type === 'block' && node.fields?.blockType === 'code') {
        const language = node.fields?.language || 'text'
        const code = node.fields?.code || ''
        // Заменяем неразрывные пробелы
        const cleanCode = code.replace(/\u00a0/g, ' ')
        codeBlocks.push({ language, code: cleanCode })
      }
      
      if (node.children) {
        extractCodeBlocks(node.children)
      }
    })
  }
  
  extractCodeBlocks(content.root.children)

  // Конвертируем Lexical в HTML с маркерами для блоков кода
  const converters = createConverters()
  const html = convertLexicalToHTML({
    data: content,
    converters,
  })

  // Разбиваем HTML по маркерам блоков кода
  const parts: ContentPart[] = []
  const markerRegex = /<!--CODE_BLOCK_(\d+)-->/g
  
  let lastIndex = 0
  let match
  let codeBlockIndex = 0

  while ((match = markerRegex.exec(html)) !== null) {
    // Добавляем HTML часть перед маркером
    if (match.index > lastIndex) {
      const htmlPart = html.substring(lastIndex, match.index).trim()
      if (htmlPart) {
        parts.push({ type: 'html', content: htmlPart })
      }
    }

    // Добавляем блок кода
    if (codeBlockIndex < codeBlocks.length) {
      parts.push({
        type: 'code',
        ...codeBlocks[codeBlockIndex]
      })
      codeBlockIndex++
    }

    lastIndex = match.index + match[0].length
  }

  // Добавляем оставшуюся HTML часть
  if (lastIndex < html.length) {
    const htmlPart = html.substring(lastIndex).trim()
    if (htmlPart) {
      parts.push({ type: 'html', content: htmlPart })
    }
  }

  return parts
}
