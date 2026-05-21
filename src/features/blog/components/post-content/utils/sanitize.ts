import DOMPurify from 'dompurify'
import { ALLOWED_HTML_TAGS, ALLOWED_HTML_ATTRIBUTES } from '../constants'

/**
 * Настройки DOMPurify для контента поста
 */
export const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ALLOWED_HTML_TAGS as unknown as string[],
  ALLOWED_ATTR: ALLOWED_HTML_ATTRIBUTES as unknown as string[],
}

/**
 * Санитизирует HTML контент
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG)
}

/**
 * Базовая санитизация (без строгих правил)
 */
export const basicSanitize = (html: string): string => {
  return DOMPurify.sanitize(html)
}
