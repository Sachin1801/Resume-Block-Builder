# Fly.io Backend Deployment Guide

## Prerequisites
- Fly.io account (sign up at https://fly.io)
- Fly CLI installed on your machine
- Frontend already deployed to Vercel

## Step 1: Install Fly CLI

```bash
# On macOS
brew install flyctl

# On Linux
curl -L https://fly.io/install.sh | sh

# On Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

## Step 2: Login to Fly.io

```bash
fly auth login
```

## Step 3: Deploy Backend to Fly.io

Navigate to the server directory:
```bash
cd server
```

Launch the app (first time only):
```bash
fly launch
```

When prompted:
- **App name**: Choose a unique name (e.g., `resume-builder-backend-yourname`)
- **Region**: Select closest to you (e.g., `ord` for Chicago, `sea` for Seattle)
- **PostgreSQL database**: Select **No** (we're using Supabase)
- **Redis**: Select **No**
- **Deploy now**: Select **No** (we need to set secrets first)

## Step 4: Set Environment Variables (Secrets)

```bash
# Set the frontend URL (replace with your actual Vercel URL)
fly secrets set FRONTEND_URL="https://your-app.vercel.app"

# Set Node environment
fly secrets set NODE_ENV="production"

# Set port (optional, as it's in fly.toml)
fly secrets set PORT="8080"
```

## Step 5: Deploy the Application

```bash
fly deploy
```

This will:
- Build your Docker container
- Push it to Fly.io registry
- Deploy and start your application

## Step 6: Get Your Backend URL

After deployment, get your app URL:
```bash
fly status
```

Your backend URL will be: `https://[your-app-name].fly.dev`

## Step 7: Update Vercel Environment Variables

Go to your Vercel dashboard:
1. Navigate to your project → Settings → Environment Variables
2. Update or add:
   ```
   VITE_API_URL=https://[your-app-name].fly.dev
   ```
3. Redeploy your Vercel frontend for changes to take effect

## Step 8: Verify Deployment

Test your backend health endpoint:
```bash
curl https://[your-app-name].fly.dev/health
```

You should see:
```json
{"status":"OK","message":"LaTeX compiler server is running"}
```

## Useful Fly.io Commands

```bash
# View logs
fly logs

# Check app status
fly status

# Open app in browser
fly open

# SSH into container (for debugging)
fly ssh console

# Scale app (if needed later)
fly scale vm shared-cpu-1x --memory 512

# Restart app
fly apps restart

# View secrets (names only, not values)
fly secrets list

# Update a secret
fly secrets set KEY="value"

# Destroy app (if needed)
fly apps destroy [app-name]
```

## Monitoring and Logs

View real-time logs:
```bash
fly logs --tail
```

View dashboard:
```bash
fly dashboard
```

## Troubleshooting

### If deployment fails:
1. Check logs: `fly logs`
2. Verify Dockerfile builds locally: `docker build -t test .`
3. Check if LaTeX packages are installing correctly

### If PDF generation fails:
1. SSH into container: `fly ssh console`
2. Check if pdflatex is installed: `which pdflatex`
3. Test LaTeX compilation: `curl http://localhost:8080/test`

### If CORS errors occur:
1. Verify FRONTEND_URL is set correctly: `fly secrets list`
2. Update the secret if needed: `fly secrets set FRONTEND_URL="https://correct-url.vercel.app"`
3. Restart the app: `fly apps restart`

## Cost Management

Fly.io Free Tier includes:
- 3 shared-cpu-1x VMs (256MB RAM each)
- 3GB persistent storage
- 160GB outbound data transfer

To stay within free tier:
- Use `shared-cpu-1x` with 256MB RAM
- Monitor usage in dashboard
- Scale down when not in use

## Production Checklist

- [ ] Backend deployed successfully
- [ ] Health endpoint responding
- [ ] Environment variables set in Fly.io
- [ ] Vercel frontend updated with backend URL
- [ ] CORS working (test from frontend)
- [ ] PDF generation working
- [ ] Monitoring set up (optional)