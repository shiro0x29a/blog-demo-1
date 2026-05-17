'use client'

import { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'

interface CodeBlockRendererProps {
  language: string
  code: string
}

export function CodeBlockRenderer({ language, code }: CodeBlockRendererProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    console.log('=== CodeBlockRenderer mounted ===')
    console.log('Language:', language)
    console.log('Code:', code)
  }, [language, code])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block-wrapper" style={{ border: '2px solid blue', padding: '10px' }}>
      <div className="code-block-header">
        <span className="code-block-language">{language}</span>
        <button
          onClick={handleCopy}
          className="copy-button"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-block-pre">
        <code className="code-block-code">{code}</code>
      </pre>
    </div>
  )
}
