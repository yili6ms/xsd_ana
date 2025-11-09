# XSD Analyzer

A Next.js application for analyzing and comparing XML Schema Definitions (XSD). Drag and drop XML files to visualize their structure and generate XSD schemas.

## Features

- Drag and drop XML file upload
- Dual-panel comparison view
- Automatic XSD schema generation from XML
- Interactive schema tree visualization
- View original XML and generated XSD side-by-side
- **Side-by-side diff comparison** with color-coded highlighting
- Compare both schema structures and XSD definitions

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Drag and drop an XML file into either the left or right panel
2. The app will automatically parse the XML and display:
   - Schema Tree: Visual representation of the XML structure
   - XSD: Auto-generated XML Schema Definition
   - Original XML: The uploaded XML file content

3. Upload a second XML file to the other panel to compare schemas side-by-side

4. Click the **"Compare Schemas"** button to view a detailed diff comparison:
   - **Schema Structure Diff**: Shows differences in the JSON schema representation
   - **XSD Diff**: Shows differences in the generated XSD files
   - Color coding: Red for removed lines, Green for added lines, White for unchanged

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- fast-xml-parser
- diff (for text comparison)

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page with dual comparison view
│   └── globals.css     # Global styles
├── components/
│   ├── XMLDropZone.tsx # Drag and drop component
│   ├── XSDDisplay.tsx  # Schema display component
│   └── DiffViewer.tsx  # Side-by-side diff comparison modal
├── lib/
│   └── xmlParser.ts    # XML parsing and XSD generation logic
└── package.json
```
