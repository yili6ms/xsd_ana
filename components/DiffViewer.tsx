'use client'

import { useState } from 'react'
import * as Diff from 'diff'
import { generateXSD } from '@/lib/xmlParser'

interface DiffViewerProps {
  leftXML: {
    fileName: string
    content: string
    schema: any
  }
  rightXML: {
    fileName: string
    content: string
    schema: any
  }
  onClose: () => void
}

export default function DiffViewer({ leftXML, rightXML, onClose }: DiffViewerProps) {
  const [activeTab, setActiveTab] = useState<'schema' | 'xsd'>('schema')

  const leftXSD = generateXSD(leftXML.schema)
  const rightXSD = generateXSD(rightXML.schema)

  const schemaLeftStr = JSON.stringify(leftXML.schema, null, 2)
  const schemaRightStr = JSON.stringify(rightXML.schema, null, 2)

  const renderDiff = (leftContent: string, rightContent: string) => {
    const diff = Diff.diffLines(leftContent, rightContent)

    return (
      <div className="font-mono text-xs">
        {diff.map((part, index) => {
          const color = part.added
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : part.removed
            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            : 'bg-white dark:bg-gray-900'

          const prefix = part.added ? '+ ' : part.removed ? '- ' : '  '

          return (
            <div key={index} className={`${color} ${part.added || part.removed ? 'font-semibold' : ''}`}>
              {part.value.split('\n').map((line, lineIndex) => {
                if (lineIndex === part.value.split('\n').length - 1 && line === '') {
                  return null
                }
                return (
                  <div key={lineIndex} className="px-2 py-0.5">
                    <span className="select-none text-gray-500 dark:text-gray-600 mr-2">
                      {prefix}
                    </span>
                    {line}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const renderSideBySideDiff = (leftContent: string, rightContent: string) => {
    const diff = Diff.diffLines(leftContent, rightContent)

    const leftLines: { text: string; type: 'added' | 'removed' | 'unchanged' }[] = []
    const rightLines: { text: string; type: 'added' | 'removed' | 'unchanged' }[] = []

    diff.forEach((part) => {
      const lines = part.value.split('\n').filter((line, idx, arr) => {
        // Remove last empty line from split
        return idx !== arr.length - 1 || line !== ''
      })

      if (part.removed) {
        lines.forEach((line) => {
          leftLines.push({ text: line, type: 'removed' })
        })
      } else if (part.added) {
        lines.forEach((line) => {
          rightLines.push({ text: line, type: 'added' })
        })
      } else {
        lines.forEach((line) => {
          leftLines.push({ text: line, type: 'unchanged' })
          rightLines.push({ text: line, type: 'unchanged' })
        })
      }
    })

    // Balance the arrays
    while (leftLines.length < rightLines.length) {
      leftLines.push({ text: '', type: 'unchanged' })
    }
    while (rightLines.length < leftLines.length) {
      rightLines.push({ text: '', type: 'unchanged' })
    }

    return (
      <div className="grid grid-cols-2 gap-px bg-gray-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 font-semibold text-sm border-b border-gray-300 dark:border-gray-700">
          {leftXML.fileName}
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-2 font-semibold text-sm border-b border-gray-300 dark:border-gray-700">
          {rightXML.fileName}
        </div>

        <div className="bg-white dark:bg-gray-900 p-2 font-mono text-xs overflow-auto max-h-[600px]">
          {leftLines.map((line, index) => {
            const bgColor =
              line.type === 'removed'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                : line.type === 'unchanged'
                ? ''
                : 'bg-gray-50 dark:bg-gray-800/50'

            return (
              <div key={index} className={`${bgColor} px-2 py-0.5 ${line.type === 'removed' ? 'font-semibold' : ''}`}>
                {line.type === 'removed' && <span className="text-red-600 dark:text-red-400 mr-2">-</span>}
                {line.text || '\u00A0'}
              </div>
            )
          })}
        </div>

        <div className="bg-white dark:bg-gray-900 p-2 font-mono text-xs overflow-auto max-h-[600px]">
          {rightLines.map((line, index) => {
            const bgColor =
              line.type === 'added'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                : line.type === 'unchanged'
                ? ''
                : 'bg-gray-50 dark:bg-gray-800/50'

            return (
              <div key={index} className={`${bgColor} px-2 py-0.5 ${line.type === 'added' ? 'font-semibold' : ''}`}>
                {line.type === 'added' && <span className="text-green-600 dark:text-green-400 mr-2">+</span>}
                {line.text || '\u00A0'}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Schema Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'schema'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Schema Structure Diff
          </button>
          <button
            onClick={() => setActiveTab('xsd')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'xsd'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            XSD Diff
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'schema' && renderSideBySideDiff(schemaLeftStr, schemaRightStr)}
          {activeTab === 'xsd' && renderSideBySideDiff(leftXSD, rightXSD)}
        </div>

        <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"></div>
              <span className="text-gray-600 dark:text-gray-400">Removed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"></div>
              <span className="text-gray-600 dark:text-gray-400">Added</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"></div>
              <span className="text-gray-600 dark:text-gray-400">Unchanged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
