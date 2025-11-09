'use client'

import { useCallback, useState } from 'react'
import { parseXMLFile } from '@/lib/xmlParser'

interface XMLDropZoneProps {
  onFileParsed: (result: { fileName: string; content: string; schema: any }) => void
}

export default function XMLDropZone({ onFileParsed }: XMLDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    setIsProcessing(true)

    const files = Array.from(e.dataTransfer.files)
    const xmlFile = files.find(file =>
      file.name.endsWith('.xml') || file.type === 'text/xml' || file.type === 'application/xml'
    )

    if (!xmlFile) {
      setError('Please drop an XML file')
      setIsProcessing(false)
      return
    }

    try {
      const text = await xmlFile.text()
      const result = parseXMLFile(text, xmlFile.name)
      onFileParsed(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse XML')
    } finally {
      setIsProcessing(false)
    }
  }, [onFileParsed])

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsProcessing(true)

    try {
      const text = await file.text()
      const result = parseXMLFile(text, file.name)
      onFileParsed(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse XML')
    } finally {
      setIsProcessing(false)
    }
  }, [onFileParsed])

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }
          ${isProcessing ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept=".xml,text/xml,application/xml"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isProcessing}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {isProcessing ? (
            <div className="text-gray-600 dark:text-gray-400">
              Processing...
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Drag and drop your XML file here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                XML files only
              </p>
            </>
          )}
        </label>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
