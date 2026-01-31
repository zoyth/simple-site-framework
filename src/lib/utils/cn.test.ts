// ABOUTME: Tests for cn (className utility) function
// ABOUTME: Validates class merging and Tailwind conflict resolution

import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
  it('should merge multiple class names', () => {
    const result = cn('px-4', 'py-2', 'bg-blue-500')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).toContain('bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
  })

  it('should filter out false conditional classes', () => {
    const isActive = false
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toContain('base-class')
    expect(result).not.toContain('active-class')
  })

  it('should handle undefined and null', () => {
    const result = cn('base-class', undefined, null, 'another-class')
    expect(result).toContain('base-class')
    expect(result).toContain('another-class')
  })

  it('should resolve Tailwind conflicts (last one wins)', () => {
    // tailwind-merge should keep only the last padding value
    const result = cn('px-2', 'px-4')
    expect(result).not.toContain('px-2')
    expect(result).toContain('px-4')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle array of classes', () => {
    const result = cn(['class1', 'class2'])
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })
})
