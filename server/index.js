import express from 'express';
import cors from 'cors';
import latex from 'node-latex';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080; // Fly.io uses port 8080 by default

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        /\.vercel\.app$/,
        /^https:\/\/.*\.vercel\.app$/,
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Detect pdflatex path once at startup
const detectPdflatexPath = () => {
  const possiblePaths = process.env.NODE_ENV === 'production'
    ? [
        '/usr/bin/pdflatex',              // Ubuntu/Debian standard path
        '/usr/local/bin/pdflatex',        // Alternative Linux path
        'pdflatex'                        // System PATH
      ]
    : [
        '/Library/TeX/texbin/pdflatex',                           // MacTeX default
        '/usr/local/texlive/2024/bin/universal-darwin/pdflatex',  // MacTeX 2024
        '/usr/local/texlive/2025/bin/universal-darwin/pdflatex',  // MacTeX 2025
        '/usr/local/texlive/2023/bin/universal-darwin/pdflatex',  // MacTeX 2023
        '/usr/local/bin/pdflatex',                                // Homebrew
        '/opt/homebrew/bin/pdflatex',                             // Apple Silicon Homebrew
        '/usr/bin/pdflatex',                                      // Linux development
        'pdflatex'                                                // System PATH
      ];
  
  let pdflatexPath = process.env.NODE_ENV === 'production' 
    ? '/usr/bin/pdflatex'  // Default for Ubuntu container
    : '/Library/TeX/texbin/pdflatex'; // Default for macOS development
    
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      pdflatexPath = path;
      console.log(`Using pdflatex at: ${pdflatexPath}`);
      break;
    }
  }
  
  return pdflatexPath;
};

const pdflatexPath = detectPdflatexPath();

// LaTeX compilation endpoint
app.post('/compile', async (req, res) => {
  const { latex: latexCode } = req.body;

  if (!latexCode) {
    return res.status(400).json({ error: 'No LaTeX code provided' });
  }

  try {
    // Save LaTeX code to temp file for debugging
    const debugFile = path.join(tempDir, 'debug_latex.tex');
    fs.writeFileSync(debugFile, latexCode);
    console.log(`LaTeX code saved to: ${debugFile}`);
    
    // Configure LaTeX options with proper temp directory handling
    const options = {
      inputs: tempDir,
      cmd: pdflatexPath,
      passes: 1,
      timeout: 30000 // 30 second timeout
    };

    console.log('Compiling LaTeX with MacTeX...');
    console.log('LaTeX code length:', latexCode.length);
    console.log('First 200 chars:', latexCode.substring(0, 200));
    
    // Log the full LaTeX for debugging
    console.log('\n=== FULL LATEX CONTENT ===');
    console.log(latexCode);
    console.log('=== END LATEX CONTENT ===\n');
    
    // Don't use timeout promise for now, let the stream handle it
    
    // Create PDF stream from string
    const pdfStream = latex(latexCode, options);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=resume.pdf');
    
    // Pipe the PDF stream to response
    pdfStream.pipe(res);
    
    // Handle errors
    pdfStream.on('error', (err) => {
      console.error('LaTeX compilation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'LaTeX compilation failed', 
          details: err.message,
          suggestion: 'Check LaTeX syntax - some packages may need to be in preamble'
        });
      }
    });
    
    pdfStream.on('end', () => {
      console.log('PDF stream ended');
    });
    
    pdfStream.on('finish', () => {
      console.log('PDF generated successfully with MacTeX');
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
});

// Test endpoint with minimal LaTeX
app.get('/test', async (req, res) => {
  const testLatex = `\\documentclass{article}
\\begin{document}
\\title{Test Document}
\\author{Test Author}
\\maketitle
Hello World! This is a test.
\\end{document}`;

  try {
    console.log('Testing with minimal LaTeX...');
    
    // Find pdflatex path for test
    const possiblePaths = [
      '/usr/bin/pdflatex',
      '/usr/local/bin/pdflatex',
      '/bin/pdflatex',
      '/Library/TeX/texbin/pdflatex'
    ];
    
    let pdflatexPath = '/usr/bin/pdflatex';
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        pdflatexPath = path;
        break;
      }
    }
    
    const options = {
      inputs: tempDir,
      cmd: pdflatexPath,
      timeout: 10000
    };

    const pdfStream = latex(testLatex, options);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=test.pdf');
    
    pdfStream.pipe(res);
    
    pdfStream.on('error', (err) => {
      console.error('Test compilation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Test compilation failed', details: err.message });
      }
    });
    
    pdfStream.on('finish', () => {
      console.log('Test PDF generated successfully');
    });
    
  } catch (error) {
    console.error('Test server error:', error);
    res.status(500).json({ error: 'Test server error', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LaTeX compiler server is running' });
});

// Start server - Listen on all interfaces for Fly.io
app.listen(PORT, '0.0.0.0', () => {
  console.log(`LaTeX compiler server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Make sure you have pdflatex installed on your system!');
});