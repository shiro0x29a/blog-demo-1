'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CodeBlockRendererProps {
  language: string
  code: string
  filename?: string
}

export function CodeBlockRenderer({ language, code, filename }: CodeBlockRendererProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        {filename && <span className="code-block-filename">{filename}</span>}
        <div className="code-block-actions">
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
      </div>
      <pre className="code-block-pre">
        <code className="code-block-code">{code}</code>
      </pre>
    </div>
  )
}
