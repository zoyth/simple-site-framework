// ABOUTME: Code block component with syntax highlighting and copy button
// ABOUTME: Used in StyleGuide and documentation for showing code examples

'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export interface CodeBlockProps {
  /** Code to display */
  code: string
  /** Language for syntax highlighting @default 'tsx' */
  language?: string
  /** Show line numbers @default false */
  showLineNumbers?: boolean
  /** Show copy button @default true */
  showCopy?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * CodeBlock - Display code with syntax highlighting
 *
 * Shows formatted code with syntax highlighting and optional copy button.
 * Perfect for documentation, examples, and style guides.
 *
 * @example
 * <CodeBlock
 *   code={`<Button variant="filled">Click me</Button>`}
 *   language="tsx"
 * />
 */
export function CodeBlock({
  code,
  language = 'tsx',
  showLineNumbers = false,
  showCopy = true,
  className = ''
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`relative group ${className}`}>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Copy code"
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </span>
          )}
        </button>
      )}

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  )
}

/**
 * InlineCode - Inline code snippet
 *
 * @example
 * <InlineCode>npm install</InlineCode>
 */
export function InlineCode({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 text-sm font-mono bg-gray-100 text-gray-800 rounded border border-gray-200">
      {children}
    </code>
  )
}
