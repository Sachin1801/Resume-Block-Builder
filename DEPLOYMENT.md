# 🚀 Deployment Guide

This guide covers deploying the Resume Builder application using a hybrid approach:
- **Frontend**: Deployed to Vercel (static hosting)
- **Backend**: Deployed to Railway (containerized with LaTeX support)

## 📋 Prerequisites

- GitHub account
- Railway account
- Vercel account  
- Supabase project configured

## 🔧 Environment Variables

### Frontend (Vercel)
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-railway-app.railway.app
```

### Backend (Railway)
```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## 🚂 Railway Backend Deployment

### Option 1: Deploy from GitHub (Recommended)

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your resume-builder repository
   - Choose the `server` folder as the root directory

2. **Configure Service**
   - Railway will auto-detect the Dockerfile
   - Set environment variables in Railway dashboard
   - The service will automatically build and deploy

3. **Get Backend URL**
   - Copy the generated Railway URL (e.g., `https://your-app.railway.app`)
   - This will be your `VITE_API_URL` for the frontend

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to server directory
cd server

# Initialize and deploy
railway create
railway up
```

## ⚡ Vercel Frontend Deployment

### Option 1: Deploy from GitHub (Recommended)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your resume-builder repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   - Add all frontend environment variables in Vercel dashboard
   - Make sure `VITE_API_URL` points to your Railway backend URL

4. **Deploy**
   - Vercel will automatically build and deploy
   - Get your frontend URL (e.g., `https://your-app.vercel.app`)

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Follow prompts to configure
```

## 🔄 Update Backend CORS

After getting your Vercel URL, update the Railway environment variables:
```bash
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## 🐳 Local Development with Docker

### Start all services
```bash
docker-compose up --build
```

### Start only backend
```bash
docker-compose up backend
```

### View logs
```bash
docker-compose logs -f backend
```

## 🔍 Testing Deployment

### Backend Health Check
```bash
curl https://your-railway-app.railway.app/health
```

### Frontend Access
Open `https://your-vercel-app.vercel.app` in browser

### LaTeX Compilation Test
```bash
curl -X POST https://your-railway-app.railway.app/test
```

## 🐛 Troubleshooting

### Backend Issues

**LaTeX not found:**
- Check Railway logs: `railway logs`
- Verify TeXLive installation in container

**CORS errors:**
- Ensure `FRONTEND_URL` matches your Vercel domain exactly
- Check Railway environment variables

**Container build fails:**
- Check Dockerfile syntax
- Verify all dependencies are available

### Frontend Issues

**API connection fails:**
- Verify `VITE_API_URL` points to Railway backend
- Check if backend is running and healthy

**Build fails on Vercel:**
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `client` is set as root directory

## 📊 Monitoring

### Railway
- View logs: Railway dashboard → Your service → Logs
- Monitor metrics: Railway dashboard → Your service → Metrics
- Health checks: Available at `/health` endpoint

### Vercel
- View deployments: Vercel dashboard → Your project → Deployments
- Monitor analytics: Vercel dashboard → Your project → Analytics
- Function logs: Available in deployment details

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use Vercel/Railway environment variable management
3. **CORS**: Keep frontend URL restrictions in place
4. **HTTPS**: Both platforms provide SSL certificates automatically

## 🔄 CI/CD

Both platforms automatically redeploy when you push to your connected GitHub repository:

- **Railway**: Redeploys backend on pushes to main/master
- **Vercel**: Redeploys frontend on pushes to main/master

You can also set up different branches for staging environments.

## 💡 Performance Tips

### Backend (Railway)
- Monitor container memory usage
- Use Railway's built-in metrics
- Consider upgrading plan for better performance

### Frontend (Vercel)
- Leverage Vercel's CDN for static assets
- Monitor Core Web Vitals in Vercel Analytics
- Use Vercel's Edge Functions if needed for API routes

## 📞 Support

- **Railway**: [Railway Documentation](https://docs.railway.app)
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Docker**: [Docker Documentation](https://docs.docker.com)
