export const ALLOWED_HTML_TAGS = [
  'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'img', 'strong', 'em', 'mark', 'sub', 'sup',
  'code', 'pre', 'blockquote', 'hr', 'br', 'label', 'input'
] as const

export const ALLOWED_HTML_ATTRIBUTES = [
  'class', 'id', 'href', 'src', 'alt', 'title', 'target',
  'rel', 'aria-checked', 'role', 'tabindex', 'for', 'type', 'checked',
  'data-code-block', 'data-code-content', 'data-code-component', 'data-code-container', 'data-code-filename'
] as const

export const TEXT_FORMAT_FLAGS = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
  SUBSCRIPT: 32,
  SUPERSCRIPT: 64,
  HIGHLIGHT: 128
} as const

