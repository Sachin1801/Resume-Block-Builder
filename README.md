# Python-Web-IDE
-----------
> A simple online Python IDE    
> Built with Vue3 + Python3.10 + Tornado6.1    
> Separated frontend and backend architecture

## Features
- Support for creating, reading, updating, and deleting projects, files, and folders
- Basic Python code completion support
- Python code execution management and output (GUI not supported)
- Markdown file editing and preview support
  
## Updates
- Brand new implementation based on Vue3 + Python3.10
- Integrated markdown editor
- Added vscode-icons
- Updated editor theme

## Build and Run
### Environment
- Node: 16.13.2
- Npm: 8.1.2
- Python: 3.10
- Tornado: 6.1

### Frontend
```bash
# Install dependencies
npm install or yarn install

# Development mode (default port is 8080)
npm run serve

# Build for production (default output directory is dist, backend is configured to load resources from this directory)
npm run build
```

### Backend
```bash
# Assuming Python environment is already installed (recommend using virtual Python environment and activating it)

# Navigate to backend directory
cd server

# Install dependencies
pip install -r requirements.txt

# Run (default port is 10086) specify port using parameter --port=10010
# If frontend is running independently, do not specify backend port (unless modifying frontend code)
python server.py

# Access (projects are saved in projects/ide directory)
# Development mode frontend: localhost:8080
# Production build frontend: localhost:10086
```
