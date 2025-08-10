import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Eye, FileText, Play, LogOut, User
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
\\addtolength{\\topmargin}{-.85in}
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

// Enhanced PDF Viewer with shadcn/ui components
function PDFViewer({ pdfUrl, isCompiling, error }) {
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription className="text-center">
            <div className="mb-3 text-2xl">❌</div>
            <p className="text-sm font-medium">Compilation Error</p>
            <p className="text-xs mt-2 text-muted-foreground">{error}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isCompiling) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <div className="animate-spin mb-3 text-2xl">⚙️</div>
            <p className="text-sm font-medium text-primary">Compiling LaTeX...</p>
            <p className="text-xs mt-2 text-muted-foreground">Please wait while we generate your PDF</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Click "Compile PDF" to generate your resume preview</p>
            <p className="text-xs mt-2 text-muted-foreground">Fill out the form sections first, then compile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/30">
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0 rounded-lg shadow-sm"
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [sections, setSections] = useState(null); // Initialize as null to detect first load
  
  // Load user's active resume when authenticated
  useEffect(() => {
    if (user && !loading && !activeResumeId) {
      loadUserResume();
    }
  }, [user, loading]);
  
  const loadUserResume = async () => {
    try {
      console.log('Loading user resumes...');
      const { resumeService } = await import('./services/resumeService');
      const resumes = await resumeService.getUserResumes();
      console.log('User resumes loaded:', resumes);
      
      if (resumes && resumes.length > 0) {
        // Find active resume or use the first one
        const activeResume = resumes.find(r => r.is_active) || resumes[0];
        console.log('Setting active resume:', activeResume.id);
        setActiveResumeId(activeResume.id);
      } else {
        console.log('No resumes found for user');
      }
    } catch (error) {
      console.error('Error loading user resume:', error);
    }
  };
  
  // Panel sizing state
  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    const saved = localStorage.getItem('resumeBuilder-leftPanelWidth');
    return saved ? parseInt(saved) : window.innerWidth * 0.65; // Default to 65% of screen width
  });
  
  // Constants for panel constraints
  const MIN_PANEL_WIDTH = 300;
  const MIN_PDF_WIDTH = 250;

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
              <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">
                Advanced Resume Builder
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
              )}

              <Separator orientation="vertical" className="h-6" />

              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={currentView === 'builder' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('builder')}
                  className="text-xs"
                >
                  Builder
                </Button>
                <Button
                  variant={currentView === 'code' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('code')}
                  className="text-xs"
                >
                  Code
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Button
                onClick={handleManualCompile}
                disabled={isCompiling || !latexCode?.trim()}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                {isCompiling ? 'Compiling...' : 'Compile PDF'}
              </Button>

              <Button
                onClick={downloadPDF}
                disabled={!pdfUrl}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
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
              initialSections={sections}
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
                <div className="absolute bottom-4 left-4 right-4">
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
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
            <div className="p-4 bg-background border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="text-green-500" />
                  Live Preview
                </h2>
                {isCompiling && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Compiling...</span>
                  </div>
                )}
              </div>
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