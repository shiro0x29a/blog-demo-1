'use client'

import { useEffect, useRef, useState } from 'react'

interface CodeBlockRendererProps {
  element: Element
  language: string
  code: string
}

export function CodeBlockRenderer({ element, language, code }: CodeBlockRendererProps) {
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  useEffect(() => {
    if (!containerRef.current || !element.parentNode) return

    // Создаем обертку для блока кода
    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'
    
    // Создаем хедер с языком и кнопкой копирования
    const header = document.createElement('div')
    header.className = 'code-block-header'
    
    const languageSpan = document.createElement('span')
    languageSpan.className = 'code-block-language'
    languageSpan.textContent = language
    
    const copyContainer = document.createElement('div')
    copyContainer.className = 'copy-button-container'
    
    const copyButton = document.createElement('button')
    copyButton.textContent = copied ? 'Copied!' : 'Copy'
    copyButton.onclick = handleCopy
    copyButton.style.cssText = `
      padding: 4px 8px;
      background: transparent;
      border: 1px solid rgba(0,0,0,0.2);
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `
    copyContainer.appendChild(copyButton)
    
    header.appendChild(languageSpan)
    header.appendChild(copyContainer)
    
    // Создаем pre блок
    const pre = document.createElement('pre')
    pre.className = 'code-block-pre'
    
    const codeBlock = document.createElement('code')
    codeBlock.className = 'code-block-code'
    codeBlock.textContent = code
    
    pre.appendChild(codeBlock)
    wrapper.appendChild(header)
    wrapper.appendChild(pre)
    
    // Заменяем маркер на блок кода
    element.parentNode.replaceChild(wrapper, element)
  }, [element, language, code, copied])

  return <div ref={containerRef} />
}
