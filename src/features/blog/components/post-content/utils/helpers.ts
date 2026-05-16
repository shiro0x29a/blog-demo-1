import type { LexicalNode } from '../types'

/**
 * Генерирует уникальный ID для чекбокса
 */
export const generateCheckboxId = (): string => 
  `checkbox-${Math.random().toString(36).substr(2, 9)}`

/**
 * Безопасно получает строковое значение
 */
export const getSafeString = (value: unknown, defaultValue = ''): string => 
  typeof value === 'string' ? value : defaultValue

/**
 * Проверяет, есть ли вложенные списки у узла
 */
export const hasSubLists = (node: LexicalNode): boolean => 
  node.children?.some(child => child.type === 'list') ?? false

/**
 * Проверяет, является ли родитель чеклистом
 */
export const isCheckList = (parent: unknown): boolean => 
  parent && typeof parent === 'object' && 'listType' in parent && parent.listType === 'check'

/**
 * Проверяет, не является ли файл изображением
 */
export const isNotImage = (mimeType: unknown): boolean => 
  typeof mimeType === 'string' && !mimeType.startsWith('image')

/**
 * Извлекает чистый текст из HTML
 */
export const extractPlainText = (html: string): string => 
  html.replace(/<\/?[^>]+(>|$)/g, '')

/**
 * Экранирует HTML специальные символы
 */
export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
