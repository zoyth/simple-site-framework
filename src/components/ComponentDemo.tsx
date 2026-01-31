// ABOUTME: Component demonstration wrapper with live preview and code
// ABOUTME: Shows component example alongside its code for documentation

'use client'

import { ReactNode, useState } from 'react'
import { CodeBlock } from './CodeBlock'

export interface ComponentDemoProps {
  /** Component title */
  title: string
  /** Component description */
  description?: string
  /** Live component preview */
  children: ReactNode
  /** Code example */
  code: string
  /** Props documentation */
  props?: Array<{
    name: string
    type: string
    default?: string
    description: string
  }>
  /** Show code by default @default false */
  defaultShowCode?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * ComponentDemo - Show component with live preview and code
 *
 * Displays a component example with its code and optional props documentation.
 * Used in StyleGuide and documentation.
 *
 * @example
 * <ComponentDemo
 *   title="Button"
 *   description="Primary action button"
 *   code={`<Button variant="filled">Click me</Button>`}
 *   props={[
 *     { name: 'variant', type: 'string', default: 'outlined', description: 'Visual style' }
 *   ]}
 * >
 *   <Button variant="filled">Click me</Button>
 * </ComponentDemo>
 */
export function ComponentDemo({
  title,
  description,
  children,
  code,
  props,
  defaultShowCode = false,
  className = ''
}: ComponentDemoProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'props'>(
    defaultShowCode ? 'code' : 'preview'
  )

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h3 className="text-lg font-semibold text-gray-900 font-heading">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1 font-body">{description}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-gray-50 border-b border-gray-200 px-4">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'code'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Code
          </button>
          {props && props.length > 0 && (
            <button
              onClick={() => setActiveTab('props')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'props'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Props
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white">
        {activeTab === 'preview' && (
          <div className="p-8 flex items-center justify-center min-h-[200px]">
            {children}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="p-4">
            <CodeBlock code={code} />
          </div>
        )}

        {activeTab === 'props' && props && (
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Prop</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Default</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((prop, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-3 font-mono text-primary">{prop.name}</td>
                    <td className="py-2 px-3 font-mono text-gray-600">{prop.type}</td>
                    <td className="py-2 px-3 font-mono text-gray-500">
                      {prop.default || '—'}
                    </td>
                    <td className="py-2 px-3 text-gray-700">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
