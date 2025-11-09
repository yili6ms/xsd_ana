'use client'

import { useState } from 'react'
import { generateXSD } from '@/lib/xmlParser'

interface XSDDisplayProps {
  parsedXML: {
    fileName: string
    content: string
    schema: any
  }
}

export default function XSDDisplay({ parsedXML }: XSDDisplayProps) {
  const [activeTab, setActiveTab] = useState<'schema' | 'xsd' | 'xml'>('schema')

  const xsdContent = generateXSD(parsedXML.schema)

  const renderSchema = (schema: any, level: number = 0): JSX.Element => {
    const indent = level * 20

    return (
      <div style={{ marginLeft: `${indent}px` }} className="my-1">
        <div className="font-mono text-sm">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {schema.name}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">
            ({schema.type}{schema.isArray ? '[]' : ''})
          </span>
        </div>

        {schema.attributes && Object.keys(schema.attributes).length > 0 && (
          <div className="ml-4 text-xs text-purple-600 dark:text-purple-400">
            Attributes: {Object.entries(schema.attributes).map(([key, type]) => (
              <span key={key} className="ml-2">
                @{key}: {type as string}
              </span>
            ))}
          </div>
        )}

        {schema.children && schema.children.length > 0 && (
          <div>
            {schema.children.map((child: any, index: number) => (
              <div key={index}>
                {renderSchema(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-300 dark:border-gray-700">
        <h3 className="font-semibold text-sm truncate">{parsedXML.fileName}</h3>
      </div>

      <div className="flex border-b border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'schema'
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Schema Tree
        </button>
        <button
          onClick={() => setActiveTab('xsd')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'xsd'
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          XSD
        </button>
        <button
          onClick={() => setActiveTab('xml')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'xml'
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Original XML
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 max-h-[600px] overflow-auto">
        {activeTab === 'schema' && (
          <div className="text-sm">
            {renderSchema(parsedXML.schema)}
          </div>
        )}

        {activeTab === 'xsd' && (
          <pre className="text-xs overflow-x-auto">
            <code className="language-xml">{xsdContent}</code>
          </pre>
        )}

        {activeTab === 'xml' && (
          <pre className="text-xs overflow-x-auto">
            <code className="language-xml">{parsedXML.content}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
