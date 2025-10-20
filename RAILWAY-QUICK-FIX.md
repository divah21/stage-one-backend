# Railway Deployment - Quick Fix

## 🚨 Your Issue:
Swagger UI trying to connect to `localhost:3000` instead of Railway URL.

## ⚡ Quick Fix (2 Steps):

### Step 1: Update Railway Environment Variables

In your Railway dashboard, change these variables:

**CHANGE THIS:**
```
NODE_ENV=production  ← Change from "development" to "production"
```

**UPDATE THIS:**
```
ALLOWED_ORIGINS=https://stage-one-backend-production-348e.up.railway.app
```

### Step 2: Push Updated Code

```bash
git add .
git commit -m "fix: Update Swagger config for Railway deployment"
git push
```

Railway will auto-deploy and Swagger will work!

---

## Test After Deploy:

**Swagger UI:**
https://stage-one-backend-production-348e.up.railway.app/api-docs

**Health Check:**
https://stage-one-backend-production-348e.up.railway.app/health

---

## What Changed:

The Swagger config now automatically uses your Railway URL when `NODE_ENV=production` is set.

**Before:** Always used localhost
**After:** Uses Railway URL in production ✅

---

See `RAILWAY-FIX.md` for detailed troubleshooting.
