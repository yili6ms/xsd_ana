import { XMLParser } from 'fast-xml-parser'

interface SchemaElement {
  name: string
  type: string
  attributes?: Record<string, string>
  children?: SchemaElement[]
  isArray?: boolean
}

export function parseXMLFile(xmlContent: string, fileName: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: true,
    parseTagValue: true,
  })

  const parsed = parser.parse(xmlContent)
  const schema = inferSchema(parsed)

  return {
    fileName,
    content: xmlContent,
    schema,
  }
}

function inferSchema(obj: any, name: string = 'root'): SchemaElement {
  if (obj === null || obj === undefined) {
    return { name, type: 'null' }
  }

  if (typeof obj !== 'object') {
    return { name, type: typeof obj }
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return { name, type: 'array', isArray: true, children: [] }
    }
    const itemSchema = inferSchema(obj[0], 'item')
    return { name, type: 'array', isArray: true, children: [itemSchema] }
  }

  const attributes: Record<string, string> = {}
  const children: SchemaElement[] = []

  for (const key in obj) {
    if (key.startsWith('@_')) {
      const attrName = key.substring(2)
      attributes[attrName] = typeof obj[key]
    } else if (key === '#text') {
      children.push({ name: '#text', type: typeof obj[key] })
    } else {
      const childSchema = inferSchema(obj[key], key)
      children.push(childSchema)
    }
  }

  return {
    name,
    type: 'element',
    ...(Object.keys(attributes).length > 0 && { attributes }),
    ...(children.length > 0 && { children }),
  }
}

export function generateXSD(schema: SchemaElement): string {
  const lines: string[] = []
  lines.push('<?xml version="1.0" encoding="UTF-8"?>')
  lines.push('<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">')

  function generateElement(element: SchemaElement, indent: string = '  '): void {
    if (element.type === 'element') {
      lines.push(`${indent}<xs:element name="${element.name}">`)
      lines.push(`${indent}  <xs:complexType>`)

      if (element.children && element.children.length > 0) {
        lines.push(`${indent}    <xs:sequence>`)
        for (const child of element.children) {
          if (child.name !== '#text') {
            if (child.isArray) {
              lines.push(`${indent}      <xs:element name="${child.name}" minOccurs="0" maxOccurs="unbounded">`)
              if (child.children && child.children.length > 0) {
                lines.push(`${indent}        <xs:complexType>`)
                lines.push(`${indent}          <xs:sequence>`)
                for (const grandchild of child.children) {
                  if (grandchild.name !== '#text') {
                    const type = getXSDType(grandchild.type)
                    lines.push(`${indent}            <xs:element name="${grandchild.name}" type="${type}"/>`)
                  }
                }
                lines.push(`${indent}          </xs:sequence>`)
                lines.push(`${indent}        </xs:complexType>`)
              }
              lines.push(`${indent}      </xs:element>`)
            } else {
              const type = getXSDType(child.type)
              if (child.type === 'element') {
                generateElement(child, indent + '      ')
              } else {
                lines.push(`${indent}      <xs:element name="${child.name}" type="${type}"/>`)
              }
            }
          }
        }
        lines.push(`${indent}    </xs:sequence>`)
      }

      if (element.attributes) {
        for (const [attrName, attrType] of Object.entries(element.attributes)) {
          const type = getXSDType(attrType)
          lines.push(`${indent}    <xs:attribute name="${attrName}" type="${type}"/>`)
        }
      }

      lines.push(`${indent}  </xs:complexType>`)
      lines.push(`${indent}</xs:element>`)
    }
  }

  generateElement(schema)
  lines.push('</xs:schema>')

  return lines.join('\n')
}

function getXSDType(type: string): string {
  switch (type) {
    case 'string':
      return 'xs:string'
    case 'number':
      return 'xs:decimal'
    case 'boolean':
      return 'xs:boolean'
    default:
      return 'xs:string'
  }
}
