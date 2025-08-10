# 📄 Advanced Resume Builder

A modern, full-stack resume builder with LaTeX compilation, user authentication, and cloud storage. Build professional resumes with drag-and-drop sections, real-time PDF preview, and seamless deployment.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **LaTeX distribution** installed on your system:
   - **Windows**: Install [MiKTeX](https://miktex.org/download) or [TeX Live](https://www.tug.org/texlive/)
   - **macOS**: Install [MacTeX](https://www.tug.org/mactex/) via `brew install --cask mactex`
   - **Linux**: Install TeX Live via `sudo apt-get install texlive-full` (Ubuntu/Debian) or equivalent

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Resume-Block-Builder
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Set up environment variables**
```bash
# Copy environment templates
cp server/env.example server/.env
cp client/env.example client/.env.local

# Edit the files with your Supabase credentials
```

4. **Start development servers**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001
   - Health Check: http://localhost:3001/health

### 🐳 Docker Development (Recommended)

```bash
# Start all services with Docker
docker-compose up --build

# Or use the deployment script
./scripts/deploy.sh dev
```

## 🌐 Production Deployment

This application uses a **hybrid deployment strategy**:
- **Frontend**: Vercel (static hosting)  
- **Backend**: Railway (containerized with LaTeX)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## ✨ Features

✅ **Modern Resume Builder** - Drag & drop sections with form-based editing
✅ **User Authentication** - Google OAuth via Supabase
✅ **Cloud Storage** - Save and manage multiple resumes
✅ **LaTeX Compilation** - Professional PDF generation with LaTeX
✅ **Real-time Preview** - See your resume as you build it
✅ **Responsive Design** - Works on desktop and mobile
✅ **Export Options** - Download PDF resumes
✅ **Section Management** - Reorderable sections with enable/disable
✅ **Professional Templates** - LaTeX-based formatting for ATS compatibility
✅ **Containerized Deployment** - Docker support for easy deployment

## 📁 Project Structure

```
Resume-Block-Builder/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts (Auth)
│   │   ├── services/         # API services (Supabase)
│   │   └── utils/           # Utility functions
│   ├── Dockerfile           # Production container
│   ├── Dockerfile.dev       # Development container
│   └── vercel.json          # Vercel deployment config
├── server/                   # Node.js backend (Express)
│   ├── temp/                # LaTeX compilation directory
│   ├── Dockerfile           # Backend container with LaTeX
│   ├── railway.json         # Railway deployment config
│   └── index.js             # Express server
├── scripts/
│   └── deploy.sh            # Deployment automation script
├── docker-compose.yml       # Local development setup
├── DEPLOYMENT.md            # Detailed deployment guide
└── supabase-schema.sql      # Database schema
```

## 🔧 How It Works

### Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Railway       │    │   Supabase      │
│   (Frontend)    │◄──►│   (Backend)     │    │   (Database)    │
│                 │    │   + LaTeX       │    │   + Auth        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### User Flow
1. **Authentication** - Sign in with Google via Supabase
2. **Resume Building** - Use form-based sections or drag & drop
3. **Real-time Preview** - LaTeX compilation to PDF preview
4. **Cloud Storage** - Automatic saving to Supabase
5. **Export** - Download professional PDF resumes

### Technical Flow
1. **Frontend** (React) collects resume data through forms
2. **Backend** (Express) compiles LaTeX to PDF using TeXLive
3. **Database** (Supabase) stores user data and resume sections
4. **Authentication** (Supabase Auth) handles Google OAuth

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