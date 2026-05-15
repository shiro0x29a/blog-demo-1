'use client'

import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { HTMLConverters } from '@payloadcms/richtext-lexical/html'
import { useEffect, useState, useRef } from 'react'
import { Copy, Check } from 'lucide-react'

interface PostContentProps {
  content: any
}

export function PostContent({ content }: PostContentProps) {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)

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
          return `<blockquote${providedStyleTag} class="quote-block" style="background-color: light-dark(rgb(245, 245, 245), rgb(41, 41, 41));">${children}</blockquote>`
        },
        
        quote: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          return `<blockquote${providedStyleTag} class="quote-block" style="background-color: light-dark(rgb(245, 245, 245), rgb(41, 41, 41));">${children}</blockquote>`
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

        // Блоки кода (code blocks)
        code: ({ node, nodesToHTML, providedStyleTag }) => {
          const children = nodesToHTML({ nodes: node.children }).join('')
          const language = node.language || 'text'
          
          return `<div${providedStyleTag} style="margin: 16px 21px; border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1);">
            <div style="padding: 8px 16px; background: rgba(0,0,0,0.03); border-bottom: 1px solid rgba(0,0,0,0.1); font-size: 12px; color: rgba(0,0,0,0.6); font-family: monospace;">${language}</div>
            <pre style="margin: 0; padding: 16px; overflow-x: auto;"><code style="font-family: 'Courier New', Courier, monospace; font-size: 14px; line-height: 1.5; color: inherit;">${children}</code></pre>
          </div>`
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
          if (node.format & 16) text = `<code class="inline-code" style="background-color: light-dark(rgb(245, 245, 245), rgb(41, 41, 41));">${text}</code>` // IS_CODE = 16
          if (node.format & 32) text = `<sub>${text}</sub>` // IS_SUBSCRIPT = 32
          if (node.format & 64) text = `<sup>${text}</sup>` // IS_SUPERSCRIPT = 64
          if (node.format & 128) text = `<mark style="background: yellow; padding: 2px 4px;">${text}</mark>` // IS_HIGHLIGHT = 128
          
          return text
        },

        // Блоки (blocks) - для кастомных блоков
        blocks: {
          code: ({ node }) => {
            const language = node.fields?.language || 'text'
            const code = node.fields?.code || ''
            // Экранируем HTML в коде
            const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            
            return `<div class="code-block-wrapper" style="margin: 16px 21px;">
              <div class="code-block-header" style="background-color: color-mix(in oklab, var(--muted) 100%, transparent);">${language}</div>
              <pre class="code-block-pre" style="background-color: color-mix(in oklab, var(--muted) 50%, transparent);"><code class="code-block-code">${escapedCode}</code></pre>
            </div>`
          },
        },
      }

      const html = convertLexicalToHTML({
        data: content,
        converters: customConverters,
      })
      
      setHtmlContent(html)
    }
  }, [content])

  // Добавляем кнопки копирования к блокам кода после рендеринга
  useEffect(() => {
    if (!contentRef.current) return

    const codeBlocks = contentRef.current.querySelectorAll('.code-block-wrapper')
    
    codeBlocks.forEach((block) => {
      const header = block.querySelector('.code-block-header')
      const codeElement = block.querySelector('.code-block-code')
      
      if (!header || !codeElement) return
      
      // Проверяем, не добавлена ли уже кнопка
      if (header.querySelector('.copy-button')) return
      
      const code = codeElement.textContent || ''
      
      // Создаем кнопку копирования
      const button = document.createElement('button')
      button.className = 'copy-button flex items-center gap-1 px-2 py-1 rounded hover:bg-muted transition-colors text-xs ml-auto'
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span>Copy</span>
      `
      
      button.onclick = async () => {
        await navigator.clipboard.writeText(code)
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Copied!</span>
        `
        setTimeout(() => {
          button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            <span>Copy</span>
          `
        }, 2000)
      }
      
      // Делаем header flex контейнером
      if (header instanceof HTMLElement) {
        header.style.display = 'flex'
        header.style.alignItems = 'center'
        header.style.justifyContent = 'space-between'
      }
      
      header.appendChild(button)
    })
  }, [htmlContent])

  if (!htmlContent) {
    return null
  }

  return (
    <div
      ref={contentRef}
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
        [&_.quote-block]:italic [&_.quote-block]:rounded
        [&_.quote-block]:bg-[rgb(229,229,229)] dark:[&_.quote-block]:bg-[rgb(41,41,41)]
        dark:[&_.quote-block]:border-muted-foreground
        [&_.horizontal-rule]:border-none [&_.horizontal-rule]:border-t-2 [&_.horizontal-rule]:border-foreground/20
        dark:[&_.horizontal-rule]:border-muted-foreground/30
        [&_.inline-code]:px-1.5 [&_.inline-code]:py-0.5 
        [&_.inline-code]:rounded [&_.inline-code]:border [&_.inline-code]:border-border
        [&_.inline-code]:font-mono [&_.inline-code]:text-sm
        [&_.inline-code]:bg-[rgb(229,229,229)] dark:[&_.inline-code]:bg-[rgb(41,41,41)]
        [&_.code-block-wrapper]:rounded-lg [&_.code-block-wrapper]:overflow-hidden 
        [&_.code-block-wrapper]:border [&_.code-block-wrapper]:border-border
        [&_.code-block-header]:px-4 [&_.code-block-header]:py-2
        [&_.code-block-header]:border-b-2 [&_.code-block-header]:border-border
        [&_.code-block-header]:text-xs [&_.code-block-header]:text-muted-foreground [&_.code-block-header]:font-mono
        [&_.code-block-pre]:m-0 [&_.code-block-pre]:p-4 [&_.code-block-pre]:overflow-x-auto
        [&_.code-block-code]:font-mono [&_.code-block-code]:text-sm [&_.code-block-code]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
