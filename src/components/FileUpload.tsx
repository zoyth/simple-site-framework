// ABOUTME: File upload component with drag & drop support
// ABOUTME: Multiple file selection, preview, and validation

'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { cn } from '../lib/utils/cn'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'

export interface FileUploadProps {
  /** Current locale */
  locale?: 'en' | 'fr'
  /** Label text (bilingual) */
  label?: LocalizedString | string
  /** Description text (bilingual) */
  description?: LocalizedString | string
  /** Allow multiple files @default false */
  multiple?: boolean
  /** Accepted file types (e.g., 'image/*', '.pdf,.doc') */
  accept?: string
  /** Max file size in bytes @default 10MB */
  maxSize?: number
  /** Max number of files @default Infinity */
  maxFiles?: number
  /** Current files */
  value?: File[]
  /** Callback when files change */
  onChange?: (files: File[]) => void
  /** Error message */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** Show file previews @default true */
  showPreviews?: boolean
  /** Additional CSS classes */
  className?: string
}

const labels = {
  dropZone: {
    en: 'Drag & drop files here, or click to select',
    fr: 'Glissez-déposez des fichiers ici, ou cliquez pour sélectionner'
  },
  dropActive: {
    en: 'Drop files here',
    fr: 'Déposez les fichiers ici'
  },
  browse: {
    en: 'Browse files',
    fr: 'Parcourir les fichiers'
  },
  remove: {
    en: 'Remove',
    fr: 'Retirer'
  },
  fileTooLarge: {
    en: 'File is too large',
    fr: 'Fichier trop volumineux'
  },
  tooManyFiles: {
    en: 'Too many files',
    fr: 'Trop de fichiers'
  },
  invalidType: {
    en: 'Invalid file type',
    fr: 'Type de fichier invalide'
  }
}

/**
 * FileUpload - Drag & drop file upload component
 *
 * Supports multiple files, file type restrictions, size limits, and previews.
 * Integrates with React Hook Form for validation.
 *
 * @example
 * // Basic usage
 * const [files, setFiles] = useState<File[]>([])
 *
 * <FileUpload
 *   label={{ en: "Upload Documents", fr: "Téléverser des documents" }}
 *   locale="en"
 *   value={files}
 *   onChange={setFiles}
 * />
 *
 * @example
 * // With restrictions and React Hook Form
 * const { setValue, formState: { errors } } = useForm()
 *
 * <FileUpload
 *   label="Profile Photo"
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   maxFiles={1}
 *   onChange={(files) => setValue('photo', files[0])}
 *   error={errors.photo?.message}
 * />
 *
 * @example
 * // Multiple files
 * <FileUpload
 *   label="Upload Attachments"
 *   multiple
 *   accept=".pdf,.doc,.docx"
 *   maxFiles={5}
 *   maxSize={10 * 1024 * 1024}
 *   value={attachments}
 *   onChange={setAttachments}
 * />
 */
export function FileUpload({
  locale = 'en',
  label,
  description,
  multiple = false,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = Infinity,
  value = [],
  onChange,
  error,
  disabled = false,
  showPreviews = true,
  className = ''
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: File[]): { valid: File[]; error: string } => {
    let valid: File[] = []
    let error = ''

    // Check number of files
    const totalFiles = value.length + files.length
    if (totalFiles > maxFiles) {
      error = getLocalizedString(labels.tooManyFiles, locale)
      return { valid, error }
    }

    // Validate each file
    for (const file of files) {
      // Check file size
      if (file.size > maxSize) {
        error = `${file.name}: ${getLocalizedString(labels.fileTooLarge, locale)}`
        break
      }

      // Check file type
      if (accept) {
        const acceptedTypes = accept.split(',').map((t) => t.trim())
        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase())
          }
          if (type.endsWith('/*')) {
            const category = type.split('/')[0]
            return file.type.startsWith(category)
          }
          return file.type === type
        })

        if (!isAccepted) {
          error = `${file.name}: ${getLocalizedString(labels.invalidType, locale)}`
          break
        }
      }

      valid.push(file)
    }

    return { valid, error }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || !onChange) return

    const fileArray = Array.from(files)
    const { valid, error } = validateFiles(fileArray)

    if (error) {
      setValidationError(error)
      return
    }

    setValidationError('')
    onChange([...value, ...valid])
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleRemove = (index: number) => {
    if (!onChange) return
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  const isImage = (file: File): boolean => {
    return file.type.startsWith('image/')
  }

  const displayError = error || validationError

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {typeof label === 'string' ? label : getLocalizedString(label, locale)}
        </label>
      )}

      {description && (
        <p className="text-sm text-gray-600 mb-3">
          {typeof description === 'string'
            ? description
            : getLocalizedString(description, locale)}
        </p>
      )}

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : displayError
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <svg
            className={cn(
              'w-12 h-12',
              isDragging ? 'text-primary' : 'text-gray-400'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {getLocalizedString(
                isDragging ? labels.dropActive : labels.dropZone,
                locale
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getLocalizedString(labels.browse, locale)}
            </p>
          </div>

          {(accept || maxSize) && (
            <div className="text-xs text-gray-500">
              {accept && <div>Accepted: {accept}</div>}
              {maxSize && <div>Max size: {formatFileSize(maxSize)}</div>}
              {maxFiles !== Infinity && <div>Max files: {maxFiles}</div>}
            </div>
          )}
        </div>
      </div>

      {displayError && (
        <p className="text-sm text-red-600 mt-2">{displayError}</p>
      )}

      {showPreviews && value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {isImage(file) ? (
                <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 rounded bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
                disabled={disabled}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              >
                {getLocalizedString(labels.remove, locale)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
