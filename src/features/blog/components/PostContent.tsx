'use client'

import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { HTMLConverters } from '@payloadcms/richtext-lexical/html'
import { useEffect, useState } from 'react'

interface PostContentProps {
  content: any
}

export function PostContent({ content }: PostContentProps) {
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    if (content && content.root) {
      // Кастомные конвертеры для применения дизайн-требований
      const customConverters: HTMLConverters = {
        // Параграфы с отступами 21px по бокам
        paragraph: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          if (!children?.length) {
            return `<p${providedStyleTag} style="margin: 0 21px 12px; word-wrap: break-word; line-height: 1.6;"><br /></p>`
          }
          return `<p${providedStyleTag} style="margin: 0 21px 12px; word-wrap: break-word; line-height: 1.6;">${children}</p>`
        },

        // Заголовки с отступами
        heading: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          const tag = node.tag || 'h2'
          return `<${tag}${providedStyleTag} style="margin: 18px 21px 9px; word-wrap: break-word; line-height: 1.4;">${children}</${tag}>`
        },

        // Списки с отступами
        list: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          const tag = node.tag === 'ol' ? 'ol' : 'ul'
          const listType = node.listType || 'bullet'
          
          // Для чекбокс-списков не нужен padding-left, так как у них нет маркеров
          const paddingLeft = listType === 'check' ? '21px' : '40px'
          
          // Добавляем list-style-type для правильного отображения маркеров/номеров
          let listStyle = ''
          if (listType === 'number') {
            listStyle = 'list-style-type: decimal;'
          } else if (listType === 'bullet') {
            listStyle = 'list-style-type: disc;'
          }
          
          return `<${tag}${providedStyleTag} style="margin: 0 21px 12px; padding-left: ${paddingLeft}; ${listStyle}" class="list-${listType}">${children}</${tag}>`
        },

        // Элементы списка
        listitem: ({ node, nodesToHTML, parent, providedCSSString }) => {
          const hasSubLists = node.children.some((child: any) => child.type === 'list')
          const children = nodesToHTML({ nodes: node.children }).join('')
          
          // Для чекбоксов (если есть)
          if ('listType' in parent && parent?.listType === 'check') {
            const uuid = `checkbox-${Math.random().toString(36).substr(2, 9)}`
            return `<li
              aria-checked="${node.checked ? 'true' : 'false'}"
              class="list-item-checkbox${node.checked ? ' list-item-checkbox-checked' : ' list-item-checkbox-unchecked'}${hasSubLists ? ' nestedListItem' : ''}"
              role="checkbox"
              style="list-style-type: none; margin: 4px 0;${providedCSSString}"
              tabIndex="-1"
            >
              ${hasSubLists ? children : `<input${node.checked ? ' checked' : ''} id="${uuid}" readOnly type="checkbox" />
                <label for="${uuid}">${children}</label>`}
            </li>`
          }
          
          // Обычные элементы списка
          return `<li
            class="${hasSubLists ? 'nestedListItem' : ''}"
            style="margin: 4px 0; ${hasSubLists ? `list-style-type: none;${providedCSSString}` : providedCSSString}"
          >${children}</li>`
        },

        // Изображения - центрированные с ограничением размера
        upload: ({ node, providedStyleTag }) => {
          const uploadDoc = node.value
          if (!uploadDoc || typeof uploadDoc !== 'object') return ''
          
          const alt = uploadDoc.alt || ''
          const url = uploadDoc.url || ''
          
          if (!uploadDoc.mimeType?.startsWith('image')) {
            return `<a${providedStyleTag} href="${url}" rel="noopener noreferrer">${uploadDoc.filename || ''}</a>`
          }
          
          return `<div style="display: flex; justify-content: center; margin: 1.5rem 0;"><img${providedStyleTag} src="${url}" alt="${alt}" style="max-width: 736px; max-height: 736px; width: auto; height: auto;" /></div>`
        },

        // Цитаты (поддержка обоих типов: blockquote и quote)
        blockquote: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          return `<blockquote${providedStyleTag} class="quote-block">${children}</blockquote>`
        },
        
        quote: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          return `<blockquote${providedStyleTag} class="quote-block">${children}</blockquote>`
        },

        // Relationship (ссылки на пользователей/авторов)
        relationship: ({ node, providedStyleTag }) => {
          // Если есть данные о связанном пользователе/авторе
          if (node.value && typeof node.value === 'object') {
            const user = node.value
            const email = user.email || ''
            const name = user.name || email
            
            if (email) {
              return `<p${providedStyleTag} style="margin: 0 21px 12px; word-wrap: break-word; line-height: 1.6;"><a href="mailto:${email}" class="relationship-link" style="color: #0066cc; text-decoration: underline;">${name}</a></p>`
            }
            return `<p${providedStyleTag} style="margin: 0 21px 12px; word-wrap: break-word; line-height: 1.6;">${name}</p>`
          }
          return ''
        },

        // Ссылки
        link: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          const href = node.fields?.url || '#'
          const newTab = node.fields?.newTab
          return `<a${providedStyleTag} href="${href}" style="color: #0066cc; text-decoration: underline;"${newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${children}</a>`
        },

        // Автоссылки
        autolink: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          const href = node.fields?.url || '#'
          const newTab = node.fields?.newTab
          return `<a${providedStyleTag} href="${href}" style="color: #0066cc; text-decoration: underline;"${newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${children}</a>`
        },

        // Горизонтальные линии
        horizontalrule: ({ providedStyleTag }) => {
          return `<hr${providedStyleTag} style="margin: 24px 21px; border: none; border-top: 2px solid currentColor; opacity: 0.2;" />`
        },

        // Inline code с стилями
        text: ({ node }) => {
          let text = node.text || ''
          
          // Экранируем HTML
          text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          
          // Форматирование текста (битовые флаги из Lexical NodeFormat)
          if (node.format & 1) text = `<strong>${text}</strong>` // IS_BOLD = 1
          if (node.format & 2) text = `<em>${text}</em>` // IS_ITALIC = 2
          if (node.format & 4) text = `<span style="text-decoration: line-through;">${text}</span>` // IS_STRIKETHROUGH = 4
          if (node.format & 8) text = `<span style="text-decoration: underline;">${text}</span>` // IS_UNDERLINE = 8
          if (node.format & 16) text = `<code style="background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">${text}</code>` // IS_CODE = 16
          if (node.format & 32) text = `<sub>${text}</sub>` // IS_SUBSCRIPT = 32
          if (node.format & 64) text = `<sup>${text}</sup>` // IS_SUPERSCRIPT = 64
          if (node.format & 128) text = `<mark style="background: yellow; padding: 2px 4px;">${text}</mark>` // IS_HIGHLIGHT = 128
          
          return text
        },
      }

      const html = convertLexicalToHTML({
        data: content,
        converters: customConverters,
      })
      
      setHtmlContent(html)
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
        prose-ul:my-4 prose-ol:my-4 prose-ul:pl-6 prose-ol:pl-6
        prose-li:my-2
        prose-img:rounded-lg prose-img:my-6 prose-img:max-w-full
        prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
        prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
        prose-hr:my-8 prose-hr:border-muted
        [&_.quote-block]:mt-[18px] [&_.quote-block]:mr-[21px] [&_.quote-block]:mb-[16px] [&_.quote-block]:ml-0
        [&_.quote-block]:pl-[15px]
        [&_.quote-block]:border-l-4 [&_.quote-block]:border-foreground 
        [&_.quote-block]:bg-muted/30 [&_.quote-block]:italic [&_.quote-block]:rounded
        dark:[&_.quote-block]:border-muted-foreground
        [&_.horizontal-rule]:border-none [&_.horizontal-rule]:border-t-2 [&_.horizontal-rule]:border-foreground/20
        dark:[&_.horizontal-rule]:border-muted-foreground/30"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
