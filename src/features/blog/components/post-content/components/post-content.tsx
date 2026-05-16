'use client'

import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePostContent } from '../hooks/use-post-content'
import { CodeBlockRenderer } from './code-block'
import styles from '../styles/index.module.css'
import type { PostContentProps } from '../types'

interface CodeBlockMarker {
  id: string
  language: string
  code: string
  element: Element
}

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const sanitizedHtml = usePostContent(content)
  const [codeBlocks, setCodeBlocks] = useState<CodeBlockMarker[]>([])

  // Извлекаем маркеры кода и заменяем их на порталы
  useEffect(() => {
    if (!contentRef.current || !sanitizedHtml) {
      setCodeBlocks([])
      return
    }

    const markers = contentRef.current.querySelectorAll('[data-code-component]')
    const blocks: CodeBlockMarker[] = []

    markers.forEach((marker, index) => {
      try {
        const data = JSON.parse(marker.getAttribute('data-code-component') || '{}')
        const id = `code-block-${index}`
        
        // Создаем контейнер для портала
        const container = document.createElement('div')
        container.setAttribute('data-code-container', id)
        marker.parentNode?.replaceChild(container, marker)
        
        blocks.push({
          id,
          language: data.language || 'text',
          code: data.code || '',
          element: container,
        })
      } catch (error) {
        console.error('Failed to parse code block data:', error)
      }
    })

    setCodeBlocks(blocks)
  }, [sanitizedHtml])

  if (!sanitizedHtml) {
    return null
  }

  return (
    <>
      <div
        ref={contentRef}
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      
      {/* Рендерим компоненты кода через порталы */}
      {codeBlocks.map(({ id, language, code, element }) => 
        createPortal(
          <CodeBlockRenderer key={id} language={language} code={code} />,
          element
        )
      )}
    </>
  )
}
