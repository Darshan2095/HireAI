# HireAI Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ Environment Variables (Set in Vercel Dashboard)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `GITHUB_CLIENT_ID` - GitHub OAuth app ID
- [ ] `GITHUB_CLIENT_SECRET` - GitHub OAuth app secret
- [ ] `NEXTAUTH_SECRET` - Generated secret for NextAuth (use: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Set to your production domain (e.g., https://yourdomain.com)
- [ ] `GEMINI_API_KEY` - Google Generative AI API key
- [ ] `GEMINI_MODEL` - Model name (default: gemini-2.0-flash)
- [ ] `UPLOADTHING_TOKEN` - UploadThing API token
- [ ] `NODE_ENV` - Set to "production"

### ✅ Database Setup
1. Create a PostgreSQL database (recommended: Vercel Postgres or Railway)
2. Update `DATABASE_URL` in Vercel environment variables
3. Ensure the database is accessible from Vercel's servers

### ✅ GitHub OAuth Setup
1. Create GitHub OAuth App at: https://github.com/settings/developers
2. Set Authorization callback URL to: `https://yourdomain.com/api/auth/callback/github`
3. Copy Client ID and Client Secret to Vercel environment variables

### ✅ Code Quality
- [x] No `localhost` references
- [x] No hardcoded URLs
- [x] TypeScript compilation successful
- [x] All environment variables using `process.env`
- [x] Prisma schema properly configured for PostgreSQL

### ✅ Build Configuration
- [x] `next.config.ts` properly configured
- [x] `tsconfig.json` includes all necessary paths
- [x] Build scripts in `package.json` are correct
- [x] Prisma client generation enabled

## Deployment Steps

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git status
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select Next.js as the framework
4. Skip "Create Vercel Storage" (you'll use external PostgreSQL)

### Step 3: Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:
- DATABASE_URL
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- NEXTAUTH_SECRET
- NEXTAUTH_URL (production domain)
- GEMINI_API_KEY
- GEMINI_MODEL
- UPLOADTHING_TOKEN
- NODE_ENV=production

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will:
   - Run `npm ci` to install dependencies
   - Run `next build` to compile your Next.js app
   - Run Prisma generate automatically
   - Deploy to production

### Step 5: Verify Deployment
- [ ] Check deployment logs in Vercel dashboard
- [ ] Visit your production URL
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Verify database connectivity

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL is correctly copied to Vercel environment variables
- Check PostgreSQL firewall/security rules allow Vercel IPs
- Verify Prisma adapter configuration in `src/database/prisma.ts`

### GitHub OAuth Issues
- Verify NEXTAUTH_URL matches your production domain
- Ensure GitHub OAuth app callback URL is correct
- Check NEXTAUTH_SECRET is set

### Build Failures
- Check Vercel build logs for detailed error messages
- Ensure all TypeScript errors are resolved locally first
- Verify all dependencies are listed in `package.json`

## Post-Deployment

### Monitor Performance
- Check Vercel Analytics dashboard
- Monitor edge function execution times
- Review API response times

### Update Custom Domain
1. In Vercel project settings, add your custom domain
2. Update DNS records as instructed by Vercel
3. Enable SSL/TLS certificate

## Technologies Used
- **Framework**: Next.js 16.2.2
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth v5 (Beta)
- **AI**: Google Generative AI (Gemini)
- **File Upload**: UploadThing
- **UI**: React 19 with Radix UI & TailwindCSS
- **PDF Generation**: pdf-lib

## Key Configuration Files
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `prisma/schema.prisma` - Database schema
- `src/lib/auth.ts` - NextAuth configuration
- `.env.example` - Environment variables template

---

For questions or issues, refer to the official documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
