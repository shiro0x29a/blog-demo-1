'use client'

import { usePostContent } from '../hooks/use-post-content'
import { CodeBlockRenderer } from './code-block'
import styles from '../styles/index.module.css'
import type { PostContentProps } from '../types'

export function PostContent({ content }: PostContentProps) {
  const contentParts = usePostContent(content)

  if (!contentParts.length) {
    return null
  }

  return (
    <div className={styles.postContent}>
      {contentParts.map((part, index) => {
        if (part.type === 'html') {
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: part.content }}
            />
          )
        }
        
        return (
          <CodeBlockRenderer
            key={index}
            language={part.language}
            code={part.code}
          />
        )
      })}
    </div>
  )
}
