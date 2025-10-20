# Railway Deployment Fix Guide

## 🚨 Issue: Swagger UI Not Working on Railway

### Problem
Swagger UI is trying to connect to `localhost:3000` instead of your Railway URL.

### Solution

## Step 1: Update Environment Variables in Railway

Go to your Railway project settings and update these variables:

### ✅ Required Changes:

1. **NODE_ENV** (CHANGE THIS!)
   ```
   NODE_ENV=production
   ```
   Currently set to: `development` ❌
   Should be: `production` ✅

2. **ALLOWED_ORIGINS** (UPDATE THIS!)
   ```
   ALLOWED_ORIGINS=https://stage-one-backend-production-348e.up.railway.app
   ```

3. **PORT** (Keep as is)
   ```
   PORT=3000
   ```

4. **LOG_LEVEL** (Keep as is)
   ```
   LOG_LEVEL=info
   ```

### Optional (Railway sets this automatically):
5. **RAILWAY_PUBLIC_DOMAIN** (Already set by Railway)
   ```
   RAILWAY_PUBLIC_DOMAIN=stage-one-backend-production-348e.up.railway.app
   ```

---

## Step 2: Redeploy

After updating the environment variables:

1. Save the changes in Railway
2. Railway will automatically redeploy
3. Wait for deployment to complete (~1-2 minutes)

---

## Step 3: Test Your Deployment

### Test 1: Health Check
```
https://stage-one-backend-production-348e.up.railway.app/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-10-20T...",
  "stats": {
    "total_strings": 0,
    "palindromes": 0
  }
}
```

### Test 2: Root Endpoint
```
https://stage-one-backend-production-348e.up.railway.app/
```

Expected response:
```json
{
  "message": "String Analysis API",
  "version": "1.0.0",
  "endpoints": { ... },
  "documentation": {
    "swagger_ui": "/api-docs",
    ...
  }
}
```

### Test 3: Swagger UI
```
https://stage-one-backend-production-348e.up.railway.app/api-docs
```

Should now show the correct server URL in the dropdown!

---

## Step 4: Create a Test String via Swagger

1. Go to: https://stage-one-backend-production-348e.up.railway.app/api-docs
2. Find **POST /strings**
3. Click **"Try it out"**
4. Use this test data:
   ```json
   {
     "value": "racecar"
   }
   ```
5. Click **"Execute"**
6. You should get a **201** response with the analyzed string!

---

## Why This Fixes It

### Before:
- `NODE_ENV=development` → Swagger uses `http://localhost:3000`
- CORS not configured for Railway domain
- Swagger can't connect to your deployment

### After:
- `NODE_ENV=production` → Swagger uses Railway URL
- CORS allows requests from Railway domain
- Everything works! ✅

---

## Testing with cURL (Alternative)

If Swagger UI still has issues, test directly with cURL:

### Create a String:
```bash
curl -X POST https://stage-one-backend-production-348e.up.railway.app/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"hello world"}'
```

### Get All Strings:
```bash
curl https://stage-one-backend-production-348e.up.railway.app/strings
```

### Get Health:
```bash
curl https://stage-one-backend-production-348e.up.railway.app/health
```

---

## Testing with PowerShell

```powershell
# Create a string
$body = @{ value = "racecar" } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri "https://stage-one-backend-production-348e.up.railway.app/strings" -ContentType "application/json" -Body $body

# Get all strings
Invoke-RestMethod -Method GET -Uri "https://stage-one-backend-production-348e.up.railway.app/strings"

# Health check
Invoke-RestMethod -Method GET -Uri "https://stage-one-backend-production-348e.up.railway.app/health"
```

---

## Quick Checklist

- [ ] Set `NODE_ENV=production` in Railway
- [ ] Set `ALLOWED_ORIGINS=https://stage-one-backend-production-348e.up.railway.app` in Railway
- [ ] Wait for Railway to redeploy
- [ ] Test `/health` endpoint
- [ ] Test Swagger UI at `/api-docs`
- [ ] Try creating a string via Swagger UI

---

## Common Issues & Solutions

### Issue 1: Still seeing localhost
**Solution**: Clear browser cache and refresh the page

### Issue 2: CORS errors
**Solution**: Make sure `ALLOWED_ORIGINS` includes your Railway domain

### Issue 3: 404 errors
**Solution**: Check that Railway deployment is running (green status)

### Issue 4: Swagger shows wrong URL
**Solution**: Verify `NODE_ENV=production` (not `development`)

---

## Railway Environment Variables (Final Configuration)

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://stage-one-backend-production-348e.up.railway.app
LOG_LEVEL=info
```

---

## After Fixing

Your Swagger UI should now:
- ✅ Show your Railway URL in the server dropdown
- ✅ Successfully execute requests
- ✅ Display response data
- ✅ Work for all endpoints

---

## Need Help?

If it's still not working after these changes:

1. Check Railway logs for errors
2. Verify all environment variables are set correctly
3. Ensure deployment is complete (green status)
4. Try the cURL commands to test API directly

---

**Remember**: Any time you change environment variables in Railway, it will automatically trigger a new deployment!

🚀 Your API should be fully functional after these changes!
