'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/error-boundary'
import { $generateHtmlFromNodes } from '@lexical/html'
import { CLEAR_EDITOR_HISTORY_COMMAND } from 'lexical'
import { useEffect, useState } from 'react'

interface PostContentProps {
  content: any
}

export function PostContent({ content }: PostContentProps) {
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    if (content && content.root) {
      const processedContent = processContent(content)
      setHtmlContent(processedContent)
    }
  }, [content])

  if (!htmlContent) {
    return null
  }

  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6
        prose-h1:text-4xl prose-h1:mt-8
        prose-h2:text-3xl prose-h2:mt-8
        prose-h3:text-2xl prose-h3:mt-6
        prose-h4:text-xl
        prose-p:mb-4 prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:font-semibold
        prose-ul:my-4 prose-ol:my-4
        prose-li:my-2
        prose-img:rounded-lg prose-img:my-6
        prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4
        prose-hr:my-8"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

function processContent(content: any): string {
  if (typeof content === 'string') {
    return content
  }

  if (content && typeof content === 'object') {
    return convertLexicalToHTML(content)
  }

  return ''
}

function convertLexicalToHTML(lexical: any): string {
  if (!lexical || !lexical.root) {
    return ''
  }

  let html = '<div>'
  html += processNode(lexical.root)
  html += '</div>'

  return html
}

function processNode(node: any): string {
  if (!node) return ''

  let html = ''

  if (node.children) {
    for (const child of node.children) {
      html += processNode(child)
    }
  }

  if (node.type === 'paragraph') {
    html = `<p>${node.children ? node.children.map(processNode).join('') : ''}</p>`
  } else if (node.type === 'heading') {
    const tag = `h${node.tag || 2}`
    html = `<${tag}>${node.children ? node.children.map(processNode).join('') : ''}</${tag}>`
  } else if (node.type === 'list') {
    const listTag = node.listType === 'bullet' ? 'ul' : 'ol'
    html = `<${listTag}>${node.children ? node.children.map(processNode).join('') : ''}</${listTag}>`
  } else if (node.type === 'listitem') {
    html = `<li>${node.children ? node.children.map(processNode).join('') : ''}</li>`
  } else if (node.type === 'quote') {
    html = `<blockquote>${node.children ? node.children.map(processNode).join('') : ''}</blockquote>`
  } else if (node.type === 'text') {
    let text = node.text || ''

    if (node.format & 1) text = `<strong>${text}</strong>`
    if (node.format & 2) text = `<em>${text}</em>`
    if (node.format & 8) text = `<code>${text}</code>`
    if (node.format & 16) text = `<sub>${text}</sub>`
    if (node.format & 32) text = `<sup>${text}</sup>`

    if (node.mode === 'link' && node.url) {
      text = `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${text}</a>`
    }

    html = text
  } else if (node.type === 'linebreak') {
    html = '<br/>'
  }

  return html
}
