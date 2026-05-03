# HireAI - Vercel Deployment Pre-Push Checklist

## ✅ Final Deployment Readiness Checklist

### Before You Deploy to Vercel

**1. Verify Your Vercel Account & Repository**
- [ ] You have a Vercel account (vercel.com)
- [ ] Your GitHub repository is connected
- [ ] You have write access to the repository

**2. Environment Variables Setup in Vercel Dashboard**
- [ ] Go to Project Settings → Environment Variables
- [ ] Add all variables from `.env.local` (except NODE_ENV):

```
AUTH_SECRET=<your-secret>
AUTH_URL=https://hire-ai-blond.vercel.app
DATABASE_URL=postgresql://...
GITHUB_CLIENT_ID=<your-id>
GITHUB_CLIENT_SECRET=<your-secret>
GEMINI_API_KEY=<your-key>
UPLOADTHING_TOKEN=<your-token>
UPLOADTHING_SECRET=<your-secret>
UPLOADTHING_APP_ID=<your-app-id>
```

**3. GitHub OAuth Configuration**
- [ ] Update your GitHub OAuth app settings at https://github.com/settings/developers
- [ ] Change Authorization Callback URL from `http://localhost:3000/api/auth/callback/github` to:
  ```
  https://hire-ai-blond.vercel.app/api/auth/callback/github
  ```

**4. Database Configuration**
- [ ] Verify DATABASE_URL works in Vercel environment
- [ ] Ensure Neon database allows connections from Vercel IPs (usually automatic)
- [ ] DATABASE_URL should be the pooler URL from Neon dashboard

**5. Local Build Test (Recommended)**
```powershell
# Test build locally before deploying
npm run build

# Test production build
npm run start
```

**6. Final Git Push**
```powershell
# Ensure all files are staged and committed
git status

# Make a final commit with deployment updates
git add .
git commit -m "Deploy to Vercel: Add deployment configuration files"

# Push to main branch
git push origin main
```

### What Happens After You Push

1. **Vercel Automatic Deployment Triggered**
   - Vercel webhook detects push to main
   - Automatic build starts

2. **Build Process**
   - `npm ci` installs exact dependencies
   - `prisma generate` creates Prisma client (via postinstall)
   - `next build` compiles Next.js application
   - Deployment to Vercel edge network

3. **Live at**
   ```
   https://hire-ai-blond.vercel.app
   ```

### Testing After Deployment

1. **Visit your URL**
   ```
   https://hire-ai-blond.vercel.app
   ```

2. **Test Authentication**
   - Click "Sign in with GitHub"
   - Verify redirect works and returns you logged in
   - Check that session is maintained

3. **Test Company Features**
   - Visit `/company` to list your companies
   - Create a new company via `/company/new`
   - Post a job in the company dashboard

4. **Check Vercel Logs**
   - In Vercel dashboard, check deployment logs
   - Look for any error messages
   - Verify build completed successfully

### Troubleshooting

**Build fails with "Cannot find module"**
- Check that all dependencies in `package.json` are listed
- Verify `prisma generate` ran in postinstall

**Authentication fails**
- Verify AUTH_URL matches domain exactly
- Check GitHub OAuth app callback URL is correct
- Ensure AUTH_SECRET is set in Vercel environment

**Database connection fails**
- Verify DATABASE_URL is set correctly
- Check Neon database is accessible
- Ensure sslmode=require is in connection string

**TypeScript errors during build**
- These are non-blocking warnings and won't stop deployment
- Fix them locally and push again if desired

### Files Added/Modified for Deployment

- ✅ `.vercelignore` - Tells Vercel what to ignore
- ✅ `vercel.json` - Vercel-specific configuration
- ✅ `VERCEL_DEPLOYMENT_READY.md` - This deployment guide
- ✅ `.env.example` - Template for environment variables

### No Breaking Changes

All new features are backwards compatible:
- Company management uses existing Company model
- Job posting uses existing Job model
- Authentication remains unchanged
- Database structure unchanged

---

## 🚀 Ready to Deploy?

1. Run: `git push origin main`
2. Watch build status in Vercel dashboard
3. Visit: `https://hire-ai-blond.vercel.app` when green ✅

**Estimated deployment time: 3-5 minutes**

For more details, see `VERCEL_DEPLOYMENT_READY.md` or `DEPLOYMENT.md`
