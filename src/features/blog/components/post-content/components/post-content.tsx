'use client'

import { useRef } from 'react'
import { usePostContent } from '../hooks/use-post-content'
import { useCodeBlocks } from '../hooks/use-code-block'
import { CodeBlockRenderer } from './code-block'
import styles from '../styles/index.module.css'
import type { PostContentProps } from '../types'

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const sanitizedHtml = usePostContent(content)
  const codeBlocks = useCodeBlocks(sanitizedHtml, contentRef)

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
      
      {codeBlocks.map(({ id, element, language, code }) => (
        <CodeBlockRenderer
          key={id}
          element={element}
          language={language}
          code={code}
        />
      ))}
    </>
  )
}
