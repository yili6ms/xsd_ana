'use client'

import { useState } from 'react'
import XMLDropZone from '@/components/XMLDropZone'
import XSDDisplay from '@/components/XSDDisplay'
import DiffViewer from '@/components/DiffViewer'

interface ParsedXML {
  fileName: string
  content: string
  schema: any
}

export default function Home() {
  const [leftXML, setLeftXML] = useState<ParsedXML | null>(null)
  const [rightXML, setRightXML] = useState<ParsedXML | null>(null)
  const [showDiff, setShowDiff] = useState(false)

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">XSD Analyzer</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Drag and drop XML files to analyze and compare their schemas
      </p>

      {leftXML && rightXML && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowDiff(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Compare Schemas
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">File 1</h2>
          <XMLDropZone onFileParsed={setLeftXML} />
          {leftXML && <XSDDisplay parsedXML={leftXML} />}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">File 2</h2>
          <XMLDropZone onFileParsed={setRightXML} />
          {rightXML && <XSDDisplay parsedXML={rightXML} />}
        </div>
      </div>

      {showDiff && leftXML && rightXML && (
        <DiffViewer
          leftXML={leftXML}
          rightXML={rightXML}
          onClose={() => setShowDiff(false)}
        />
      )}
    </main>
  )
}
