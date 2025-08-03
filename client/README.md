# LaTeX Resume Builder - Quick Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **LaTeX distribution** installed on your system:
   - **Windows**: Install [MiKTeX](https://miktex.org/download) or [TeX Live](https://www.tug.org/texlive/)
   - **macOS**: Install [MacTeX](https://www.tug.org/mactex/) via `brew install --cask mactex`
   - **Linux**: Install TeX Live via `sudo apt-get install texlive-full` (Ubuntu/Debian) or equivalent

## Quick Start (Hackathon Style!)

### 1. Clone and Setup

```bash
# Create project directory
mkdir latex-resume-builder
cd latex-resume-builder

# Create client and server directories
mkdir client server
```

### 2. Setup Frontend

```bash
cd client

# Initialize Vite React project
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Copy the package.json dependencies from the artifact above
# Then run:
npm install

# Create necessary files:
# - Copy App.jsx from the artifact
# - Copy tailwind.config.js from the artifact
# - Add Tailwind directives to src/index.css:
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Setup Backend

```bash
cd ../server

# Copy package.json from the artifact
npm install

# Copy index.js from the artifact
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Access the App

Open http://localhost:5173 in your browser

## Features Implemented

✅ **Drag & Drop Components** - Pre-built LaTeX components for resume sections
✅ **Custom Component Creator** - Create your own draggable LaTeX snippets
✅ **Live LaTeX Editor** - Syntax highlighted code editor
✅ **Real-time PDF Preview** - See changes as you type (1.5s debounce)
✅ **Local Storage** - Auto-saves your work
✅ **Download PDF** - Export your resume as PDF
✅ **Beautiful UI** - Gradient effects, animations, dark mode ready

## Project Structure

```
latex-resume-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main application
│   │   └── index.css      # Tailwind styles
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Express server with LaTeX compiler
│   ├── temp/             # Temporary files (auto-created)
│   └── package.json
```

## How It Works

1. **Component Library** (Left Panel)
   - Drag pre-built components to editor
   - Create custom components with "Create Custom Component" button
   - Components saved to localStorage

2. **Code Editor** (Center)
   - Drop components anywhere in the code
   - Edit LaTeX directly
   - Syntax highlighting with CodeMirror

3. **PDF Preview** (Right Panel)
   - Compiles LaTeX to PDF on backend
   - Updates after 1.5 seconds of no typing
   - Shows compilation errors if any

## Troubleshooting

### "pdflatex not found" error
- Make sure LaTeX is installed and `pdflatex` is in your system PATH
- Test with: `pdflatex --version`

### CORS errors
- Ensure backend is running on port 3001
- Frontend dev server should be on port 5173

### PDF not generating
- Check server console for LaTeX compilation errors
- Verify LaTeX syntax in the editor

## Next Steps for Scaling

1. **Add more templates** - Multiple resume styles
2. **User accounts** - Save multiple resumes
3. **Cloud storage** - Replace localStorage
4. **Template marketplace** - Share components
5. **Export options** - .tex file download
6. **Collaborative editing** - Real-time collaboration
7. **AI suggestions** - Content recommendations

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, CodeMirror, react-pdf
- **Backend**: Node.js, Express, node-latex
- **UI Libraries**: shadcn principles, animations inspired by Magic UI/Aceternity UI
- **Icons**: React Icons (Feather icons)

## Quick Customization Tips

- Change colors: Edit `tailwind.config.js`
- Add new default components: Update `defaultComponents` in App.jsx
- Modify LaTeX template: Edit `latexTemplate` function
- Add new icons: Import from `react-icons`