import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Eye, FileText, Play, LogOut, User
} from 'lucide-react';

import ResumeBuilder from './components/ResumeBuilder';
import ResizeHandle from './components/ResizeHandle';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { resumeService } from './services/resumeService';

// Simplified LaTeX template for testing
const SIMPLE_LATEX_TEMPLATE = `\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\begin{document}

{{CONTENT}}

\\end{document}`;

// Enhanced LaTeX template with better formatting
const ENHANCED_LATEX_TEMPLATE = `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{0pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\classesList}[4]{
    \\item\\small{
        {#1 #2 #3 #4 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

{{CONTENT}}

\\end{document}`;

// LaTeX template wrapper function - use enhanced template
const latexTemplate = (content) => ENHANCED_LATEX_TEMPLATE.replace('{{CONTENT}}', content);

// Manual compilation approach - no debouncing needed

// Simple PDF Viewer
function PDFViewer({ pdfUrl, isCompiling, error }) {
  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400">
        <div className="mb-3">❌</div>
        <p className="text-sm">Compilation Error</p>
        <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (isCompiling) {
    return (
      <div className="text-center py-8 text-blue-500 dark:text-blue-400">
        <div className="animate-spin mb-3">⚙️</div>
        <p className="text-sm">Compiling LaTeX...</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Click "Compile PDF" to generate your resume preview</p>
        <p className="text-sm mt-2">Fill out the form sections first, then compile</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
      />
    </div>
  );
}

// Main App Component
function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [latexCode, setLatexCode] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('builder'); // 'builder' or 'code'
  
  // Panel sizing state
  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    const saved = localStorage.getItem('resumeBuilder-leftPanelWidth');
    return saved ? parseInt(saved) : window.innerWidth * 0.65; // Default to 65% of screen width
  });
  
  // Constants for panel constraints
  const MIN_PANEL_WIDTH = 300;
  const MIN_PDF_WIDTH = 250;

  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [sections, setSections] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('resumeLatexCode');
    if (savedCode) setLatexCode(savedCode);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('resumeLatexCode', latexCode);
  }, [latexCode]);

  // Save panel width to localStorage
  useEffect(() => {
    localStorage.setItem('resumeBuilder-leftPanelWidth', leftPanelWidth.toString());
  }, [leftPanelWidth]);

  // Handle window resize
  useEffect(() => {
    const handleWindowResize = () => {
      const containerWidth = window.innerWidth;
      const maxLeftWidth = containerWidth - MIN_PDF_WIDTH - 20;
      
      if (leftPanelWidth > maxLeftWidth) {
        setLeftPanelWidth(Math.max(MIN_PANEL_WIDTH, maxLeftWidth));
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [leftPanelWidth]);

  // Panel resizing logic
  const handleResize = useCallback((newWidth) => {
    const containerWidth = window.innerWidth;
    const maxLeftWidth = containerWidth - MIN_PDF_WIDTH - 20; // 20px for resize handle and margins
    const constrainedWidth = Math.max(MIN_PANEL_WIDTH, Math.min(newWidth, maxLeftWidth));
    setLeftPanelWidth(constrainedWidth);
  }, []);

  // Get current width for the resize handle
  const getCurrentWidth = useCallback(() => {
    return leftPanelWidth;
  }, [leftPanelWidth]);

  // Calculate PDF panel width
  const pdfPanelWidth = window.innerWidth - leftPanelWidth - 4; // 4px for resize handle

  // Compile LaTeX
  const compileLatex = useCallback(async (code) => {
    if (!code || !code.trim() || code.trim().length < 10) {
      setPdfUrl(null);
      return;
    }
    
    // Prevent multiple simultaneous compilations
    if (isCompiling) {
      console.log('Compilation already in progress, skipping...');
      return;
    }
    
    console.log('Starting LaTeX compilation...');
    
    setIsCompiling(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: latexTemplate(code) })
      });
      
      if (!response.ok) {
        throw new Error('Compilation failed');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Clean up previous URL to prevent memory leaks
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      setPdfUrl(url);
    } catch (err) {
      setError(err.message || 'Compilation failed');
      console.error('Compilation error:', err);
    } finally {
      setIsCompiling(false);
    }
  }, [pdfUrl]);

  // Manual compile function
  const handleManualCompile = () => {
    if (latexCode && latexCode.trim()) {
      compileLatex(latexCode);
    }
  };

  // Handle LaTeX code changes from ResumeBuilder
  const handleLatexChange = useCallback((newLatexCode) => {
    console.log('LaTeX code changed, length:', newLatexCode ? newLatexCode.length : 0);
    setLatexCode(newLatexCode);
  }, []);

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'resume.pdf';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Advanced Resume Builder
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{user.email}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('builder')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'builder'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Builder
                </button>
                <button
                  onClick={() => setCurrentView('code')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'code'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Code
                </button>
              </div>

              <button
                onClick={handleManualCompile}
                disabled={isCompiling || !latexCode?.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Play className="w-4 h-4" />
                {isCompiling ? 'Compiling...' : 'Compile PDF'}
              </button>

              <button
                onClick={downloadPDF}
                disabled={!pdfUrl}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Left Panel - Resume Builder or Code Editor */}
        <div 
          className="flex flex-col lg:static"
          style={{ 
            width: window.innerWidth >= 1024 ? `${leftPanelWidth}px` : '100%',
            height: window.innerWidth >= 1024 ? '100%' : '50%'
          }}
        >
          {currentView === 'builder' ? (
            <ResumeBuilder 
              onLatexChange={handleLatexChange}
              user={user}
              activeResumeId={activeResumeId}
              onSectionsChange={setSections}
            />
          ) : (
            <div className="flex-1 relative">
              <textarea
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                className="w-full h-full p-6 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                placeholder="% LaTeX code will be generated from the Builder
% You can also edit it directly here...

% Example:
% \\section{Education}
% \\resumeSubHeadingListStart
%   \\resumeSubheading{University}{Date}{Degree}{Location}
% \\resumeSubHeadingListEnd"
                spellCheck={false}
              />
              
              {error && (
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resize Handle - Only show on desktop */}
        {window.innerWidth >= 1024 && (
          <ResizeHandle 
            onResize={handleResize}
            getCurrentWidth={getCurrentWidth}
          />
        )}

        {/* Right Panel - PDF Preview */}
        <div 
          className="bg-gray-100 dark:bg-gray-900 shadow-xl overflow-hidden border-l lg:border-l border-t lg:border-t-0 border-gray-200 dark:border-gray-700"
          style={{ 
            width: window.innerWidth >= 1024 ? `${pdfPanelWidth}px` : '100%',
            height: window.innerWidth >= 1024 ? '100%' : '50%'
          }}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="text-green-500" />
                Live Preview
                {isCompiling && (
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">Compiling...</span>
                  </div>
                )}
              </h2>
            </div>
            
            <div className="flex-1 overflow-auto">
              <PDFViewer pdfUrl={pdfUrl} isCompiling={isCompiling} error={error} />
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

// Wrap App with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}