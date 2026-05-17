// Lexical структуры
export interface LexicalNode {
  type: string
  children?: LexicalNode[]
  format?: number
  text?: string
  tag?: string
  language?: string
  checked?: boolean
  value?: unknown
  fields?: {
    url?: string
    newTab?: boolean
    language?: string
    code?: string
    filename?: string
  }
  [key: string]: unknown
}

export interface LexicalRoot {
  root: {
    children: LexicalNode[]
  }
}

// Компонент пропсы
export interface PostContentProps {
  content: LexicalRoot | null
}

// Code блоки
export interface CodeBlock {
  id: string
  element: Element
  language: string
  code: string
}

// CodeBlockRenderer пропсы
export interface CodeBlockRendererProps {
  element: Element
  language: string
  code: string
}
