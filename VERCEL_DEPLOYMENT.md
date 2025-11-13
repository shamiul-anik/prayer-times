# Vercel Deployment Guide

This project is configured for deployment on Vercel with serverless functions.

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Git Repository** - Push your code to GitHub, GitLab, or Bitbucket
3. **Node.js 18.x** - Specified in package.json

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Select your Git repository (prayer-times)
4. Vercel will automatically detect the settings
5. Click "Deploy"

The deployment will be complete in 1-2 minutes.

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# For production deployment
vercel --prod
```

## Project Structure

```
prayer-times/
├── api/                          # Serverless API functions
│   ├── prayer-times.js          # Main prayer times endpoint
│   ├── prayer-times-multi.js    # Multiple cities endpoint
│   └── next-prayer.js           # Next prayer endpoint
├── public/                       # Static files
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── audio/
├── vercel.json                  # Vercel configuration
├── .vercelignore               # Files to ignore during build
└── package.json
```

## API Endpoints

After deployment, your API endpoints will be available at:

- `https://your-vercel-domain.vercel.app/api/prayer-times`
- `https://your-vercel-domain.vercel.app/api/prayer-times-multi`
- `https://your-vercel-domain.vercel.app/api/next-prayer`

## Environment Variables

Currently, no environment variables are required. The application uses external APIs that don't need authentication.

## Custom Domain

To use a custom domain:

1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Update your domain's DNS records as instructed

## Troubleshooting

### Issue: API calls returning 500 error
- Check the Vercel deployment logs
- Verify the external API (aladhan.com) is accessible
- Check CORS settings in the API handlers

### Issue: Static files not loading
- Ensure all files are in the `public/` directory
- Check file paths in HTML are relative (e.g., `/index.html`, not `../index.html`)

### Issue: Build fails
- Clear Vercel cache: Project Settings → Git → Disconnect and reconnect
- Check Node.js version is 18.x in package.json

## Features Deployed

✅ Prayer times display for multiple cities  
✅ Greenish theme (light background)  
✅ XSS protection with HTML escaping  
✅ CORS enabled for API access  
✅ Responsive design for mobile and desktop  
✅ Automatic Adhan playback  
✅ Time remaining calculator  

## Next Steps

1. Push your code to GitHub
2. Import project into Vercel
3. Share your live URL with others
4. Monitor performance in Vercel Analytics

## Support

For Vercel-specific issues, see [Vercel Docs](https://vercel.com/docs)
For project issues, check the GitHub repository
