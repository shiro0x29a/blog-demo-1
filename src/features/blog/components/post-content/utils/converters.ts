import type { HTMLConverters } from '@payloadcms/richtext-lexical/html'
import escapeHtml from 'escape-html'
import { hasSubLists, isCheckList, getSafeString, extractPlainText } from './helpers'
import { 
  renderChecklistItem, 
  renderRegularListItem, 
  createLink, 
  formatText,
  renderUpload 
} from './renderers'

export const createConverters = (): HTMLConverters => ({
  paragraph: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({ nodes: node.children }).join('')
    const content = children || '<br />'
    return `<p${providedStyleTag} class="post-paragraph">${content}</p>`
  },

  heading: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({ nodes: node.children }).join('')
    const tag = node.tag || 'h2'
    return `<${tag}${providedStyleTag} class="post-heading post-heading-${tag}">${children}</${tag}>`
  },

  list: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({ nodes: node.children }).join('')
    const tag = node.tag === 'ol' ? 'ol' : 'ul'
    const listType = node.listType || 'bullet'
    return `<${tag}${providedStyleTag} class="post-list post-list-${listType}">${children}</${tag}>`
  },

  listitem: ({ node, nodesToHTML, parent }) => {
    const children = nodesToHTML({ nodes: node.children }).join('')
    const hasNestedLists = hasSubLists(node as any)
    
    if (isCheckList(parent)) {
      return renderChecklistItem(node as any, children, hasNestedLists)
    }
    
    return renderRegularListItem(children, hasNestedLists)
  },

  upload: ({ node }) => renderUpload(node as any),

  blockquote: ({ node, nodesToHTML }) => {
    const children = nodesToHTML({ nodes: node.children }).join('')
    return `<blockquote class="post-quote">${children}</blockquote>`
  },
  
  quote: ({ node, nodesToHTML }) => {
    const children = nodesToHTML({ nodes: node.children }).join('')
    return `<blockquote class="post-quote">${children}</blockquote>`
  },

  relationship: ({ node }) => {
    const user = node.value
    if (!user || typeof user !== 'object') return ''
    
    const email = escapeHtml(getSafeString((user as any).email))
    const name = escapeHtml(getSafeString((user as any).name, email))
    
    if (email) {
      return `<p class="post-relationship"><a href="mailto:${email}" class="post-link">${name}</a></p>`
    }
    return `<p class="post-relationship">${name}</p>`
  },

  link: ({ node, nodesToHTML }) => createLink(node as any, nodesToHTML),
  autolink: ({ node, nodesToHTML }) => createLink(node as any, nodesToHTML),

  horizontalrule: () => `<hr class="post-horizontal-rule" />`,

  code: ({ node, nodesToHTML }) => {
    const children = nodesToHTML({ nodes: node.children }).join('')
    const language = escapeHtml(getSafeString(node.language, 'text'))
    const code = extractPlainText(children)
    
    return `<div data-code-block="${language}" data-code-content="${escapeHtml(code)}"></div>`
  },

  text: ({ node }) => formatText(node),

  // Блоки (blocks) - для кастомных блоков кода
  blocks: {
    code: ({ node }) => {
      const language = (node.fields as any)?.language || 'text'
      const filename = (node.fields as any)?.filename || ''
      let code = (node.fields as any)?.code || ''
      
      // Заменяем неразрывные пробелы на обычные
      code = code.replace(/\u00a0/g, ' ')
      
      // Создаем маркер с данными в атрибутах
      const filenameAttr = filename ? ` data-code-filename="${escapeHtml(filename)}"` : ''
      return `<div data-code-block="${escapeHtml(language)}" data-code-content="${escapeHtml(code)}"${filenameAttr}></div>`
    },
  },
})
