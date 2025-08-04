# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - Project name: "latex-resume-builder" (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to you
4. Click "Create new project" and wait for setup to complete

## 2. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Configure consent screen if needed
   - Application type: "Web application"
   - Add authorized redirect URIs:
     - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth/callback` (for local development)
5. Copy the Client ID and Client Secret

## 3. Configure Supabase Auth

1. In your Supabase dashboard, go to "Authentication" > "Providers"
2. Enable "Google" provider
3. Enter your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)
4. Save the configuration

## 4. Run Database Schema

1. Go to "SQL Editor" in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the query to create all tables and policies

## 5. Get Your API Keys

1. Go to "Settings" > "API" in your Supabase dashboard
2. Copy:
   - Project URL (looks like: https://[project-ref].supabase.co)
   - Anon/Public key

## 6. Configure Your Application

1. Copy `.env.example` to `.env` in the client directory:
   ```bash
   cd client
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 7. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Click "Sign In" and test Google authentication
3. Check your Supabase dashboard "Authentication" > "Users" to see if the user was created

## Troubleshooting

- **OAuth redirect error**: Make sure your redirect URLs in Google Console match exactly
- **CORS errors**: Check that your site URL is configured in Supabase (Settings > Authentication > URL Configuration)
- **User not created**: Check the auth trigger in SQL editor - it should create a profile automatically

## Security Notes

- Never commit your `.env` file to git
- The anon key is safe to use in frontend as it's restricted by Row Level Security
- Always use environment variables for sensitive data