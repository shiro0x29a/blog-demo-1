'use client'

import { useRef, useEffect } from 'react'
import { usePostContent } from '../hooks/use-post-content'
import styles from '../styles/index.module.css'
import type { PostContentProps } from '../types'

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const sanitizedHtml = usePostContent(content)

  // Заменяем маркеры на полные блоки кода
  useEffect(() => {
    if (!contentRef.current) return

    const markers = contentRef.current.querySelectorAll('[data-code-block]')
    
    markers.forEach((marker) => {
      const language = marker.getAttribute('data-code-block') || 'text'
      const code = marker.getAttribute('data-code-content') || ''
      
      // Экранируем HTML в коде
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      
      // Создаем полный HTML блока кода
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-wrapper'
      wrapper.innerHTML = `
        <div class="code-block-header">
          <span class="code-block-language">${language}</span>
          <button class="copy-button" aria-label="Copy code">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <pre class="code-block-pre"><code class="code-block-code">${escapedCode}</code></pre>
      `
      
      // Добавляем обработчик для кнопки Copy
      const copyButton = wrapper.querySelector('.copy-button')
      if (copyButton) {
        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(code)
            const span = copyButton.querySelector('span')
            if (span) {
              const originalText = span.textContent
              span.textContent = 'Copied!'
              setTimeout(() => {
                span.textContent = originalText
              }, 2000)
            }
          } catch (err) {
            console.error('Failed to copy code:', err)
          }
        })
      }
      
      // Заменяем маркер на блок кода
      marker.parentNode?.replaceChild(wrapper, marker)
    })
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
