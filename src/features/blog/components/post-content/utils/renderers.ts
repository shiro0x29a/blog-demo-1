import escapeHtml from 'escape-html'
import type { LexicalNode } from '../types'
import { generateCheckboxId, hasSubLists, isCheckList, getSafeString, isNotImage } from './helpers'
import { TEXT_FORMAT_FLAGS } from '../constants'

/**
 * Рендерит элемент чеклиста
 */
export function renderChecklistItem(
  node: LexicalNode, 
  children: string, 
  hasNestedLists: boolean,
): string {
  const uuid = generateCheckboxId()
  const isChecked = node.checked ? ' checked' : ''
  const ariaChecked = node.checked ? 'true' : 'false'
  const checkedClass = node.checked 
    ? 'post-list-item-checkbox-checked' 
    : 'post-list-item-checkbox-unchecked'
  const nestedClass = hasNestedLists ? ' post-list-item-nested' : ''
  
  return `<li
    aria-checked="${ariaChecked}"
    class="post-list-item-checkbox ${checkedClass}${nestedClass}"
    role="checkbox"
    tabIndex="-1"
  >
    ${hasNestedLists 
      ? children 
      : `<input${isChecked} id="${uuid}" readOnly type="checkbox" class="post-checkbox" />
        <label for="${uuid}" class="post-checkbox-label">${children}</label>`
    }
  </li>`
}

/**
 * Рендерит обычный элемент списка
 */
export function renderRegularListItem(children: string, hasNestedLists: boolean): string {
  const nestedClass = hasNestedLists ? ' post-list-item-nested' : ''
  return `<li class="post-list-item${nestedClass}">${children}</li>`
}

/**
 * Создает HTML ссылку
 */
export function createLink(node: LexicalNode, nodesToHTML: any): string {
  const children = nodesToHTML({ nodes: node.children }).join('')
  const href = escapeHtml(node.fields?.url || '#')
  const newTab = node.fields?.newTab
  const targetAttr = newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
  
  return `<a href="${href}" class="post-link"${targetAttr}>${children}</a>`
}

/**
 * Форматирует текст с применением стилей (версия с map)
 */
export function formatText(node: LexicalNode): string {
  if (!node.text) return ''
  
  let text = escapeHtml(node.text)
  const format = node.format || 0
  
  // Конфигурация форматов текста
  const textFormats = [
    { flag: TEXT_FORMAT_FLAGS.BOLD, tag: 'strong', className: 'post-strong' },
    { flag: TEXT_FORMAT_FLAGS.ITALIC, tag: 'em', className: 'post-em' },
    { flag: TEXT_FORMAT_FLAGS.STRIKETHROUGH, tag: 'span', className: 'post-strikethrough' },
    { flag: TEXT_FORMAT_FLAGS.UNDERLINE, tag: 'span', className: 'post-underline' },
    { flag: TEXT_FORMAT_FLAGS.CODE, tag: 'code', className: 'post-inline-code' },
    { flag: TEXT_FORMAT_FLAGS.SUBSCRIPT, tag: 'sub', className: 'post-sub' },
    { flag: TEXT_FORMAT_FLAGS.SUPERSCRIPT, tag: 'sup', className: 'post-sup' },
    { flag: TEXT_FORMAT_FLAGS.HIGHLIGHT, tag: 'mark', className: 'post-highlight' },
  ]
  
  // Применяем все активные форматы
  textFormats.forEach(({ flag, tag, className }) => {
    if (format & flag) {
      text = `<${tag} class="${className}">${text}</${tag}>`
    }
  })
  
  return text
}

/**
 * Рендерит изображение или ссылку на файл
 */
export function renderUpload(node: LexicalNode): string {
  const uploadDoc = node.value
  if (!uploadDoc || typeof uploadDoc !== 'object') return ''
  
  const alt = escapeHtml(getSafeString((uploadDoc as any).alt))
  const url = getSafeString((uploadDoc as any).url)
  
  if (isNotImage((uploadDoc as any).mimeType)) {
    const filename = escapeHtml(getSafeString((uploadDoc as any).filename))
    return `<a href="${url}" class="post-link" rel="noopener noreferrer">${filename}</a>`
  }
  
  return `<div class="post-image-wrapper"><img src="${url}" alt="${alt}" class="post-image" loading="lazy" /></div>`
}
