'use client'

import { useRef, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { usePostContent } from '../hooks/use-post-content'
import { CodeBlockRenderer } from './code-block'
import styles from '../styles/index.module.css'
import type { PostContentProps } from '../types'

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const sanitizedHtml = usePostContent(content)

  // Заменяем маркеры на React компоненты
  useEffect(() => {
    if (!contentRef.current) return

    const markers = contentRef.current.querySelectorAll('[data-code-block]')
    const roots: any[] = []
    
    markers.forEach((marker) => {
      const language = marker.getAttribute('data-code-block') || 'text'
      const code = marker.getAttribute('data-code-content') || ''
      
      // Создаем контейнер для React компонента
      const container = document.createElement('div')
      marker.parentNode?.replaceChild(container, marker)
      
      // Рендерим React компонент
      const root = createRoot(container)
      root.render(<CodeBlockRenderer language={language} code={code} />)
      roots.push(root)
    })

    // Cleanup при размонтировании
    return () => {
      roots.forEach(root => root.unmount())
    }
  }, [sanitizedHtml])

  if (!sanitizedHtml) {
    return null
  }

  return (
    <div
      ref={contentRef}
      className={styles.postContent}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
