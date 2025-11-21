# Railway Deployment Fix Guide

## Current Issue
Backend returning 502 errors on Railway because:
1. MongoDB connection might be timing out
2. RabbitMQ is not available (optional service)
3. Server wasn't starting due to service initialization failures

## Changes Made

### 1. Server Resilience (`backend/src/server.js`)
- ✅ Server now starts **immediately** without waiting for MongoDB
- ✅ MongoDB connection happens **asynchronously in background**
- ✅ RabbitMQ/PDF Worker only starts if `RABBITMQ_URL` is configured
- ✅ Health check endpoints return server status even if services are unavailable
- ✅ Better error handling and logging

### 2. Database Connection (`backend/src/config/database.js`)
- ✅ Graceful handling if `MONGODB_URI` is missing
- ✅ Increased timeout to 8 seconds
- ✅ Better error messages for debugging
- ✅ Server continues even if DB connection fails

### 3. RabbitMQ Connection (`backend/src/config/rabbitmq.js`)
- ✅ 10-second connection timeout
- ✅ Validates RABBITMQ_URL is configured before attempting connection
- ✅ Clear error messages

## Deployment Steps for Railway

### Step 1: Verify Environment Variables
Make sure these are set in Railway dashboard:

**Required:**
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ekyc_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://your-frontend.railway.app
```

**Optional (for AI features):**
```
OPENROUTER_API_KEY=your-key-here
```

**Optional (for PDF queue - not needed for basic operation):**
```
RABBITMQ_URL=amqp://username:password@host:5672
```

### Step 2: Verify MongoDB Connection
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to Network Access
3. **Add IP Address: `0.0.0.0/0`** (allows Railway to connect)
4. Verify your cluster is running
5. Test connection string is correct

### Step 3: Deploy to Railway

Option A: Let Railway auto-deploy (if connected to GitHub)
```bash
git add .
git commit -m "Fix: Make server resilient to service failures"
git push origin master
```

Option B: Manual deploy via Railway CLI
```bash
railway up
```

### Step 4: Check Deployment Logs

In Railway dashboard, check:
1. **Build Logs** - Should show `npm install` succeeding
2. **Deploy Logs** - Should show:
   ```
   ✅ EKYC API Server successfully started
   🌐 Listening on 0.0.0.0:5000
   🚀 Server is ready to accept requests!
   ```
3. **HTTP Logs** - Should show health check returning 200

### Step 5: Test Endpoints

Test these URLs (replace with your Railway URL):

```bash
# Health check
curl https://your-app.railway.app/

# API health check  
curl https://your-app.railway.app/api/health

# Should return JSON with status: "ok" or "success"
```

## Troubleshooting

### Issue: Still getting 502 errors

**Check 1: Is server starting?**
```
Look in Deploy Logs for:
✅ "EKYC API Server successfully started"
```

**Check 2: MongoDB connection**
```
Look for:
✅ "MongoDB Connected: ..."
OR
⚠️  "MONGODB_URI not configured"
```

**Check 3: Port binding**
```
Server should listen on 0.0.0.0:5000
Railway automatically sets PORT environment variable
```

### Issue: Database not connecting

1. **Verify MONGODB_URI format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

2. **Check MongoDB Atlas IP Whitelist:**
   - Must include `0.0.0.0/0` for Railway access

3. **Test connection locally:**
   ```bash
   cd backend
   $env:MONGODB_URI="your-connection-string"
   npm start
   ```

### Issue: API endpoints returning errors

1. **Check if MongoDB is connected:**
   - Visit `/api/health` - check `services.database` field
   - If false, API endpoints won't work properly

2. **Check CORS settings:**
   - Verify `FRONTEND_URL` in Railway matches your frontend domain

3. **Check JWT_SECRET:**
   - Must be set for admin authentication to work

## Expected Logs After Fix

### Successful Startup:
```
============================================================
✅ EKYC API Server successfully started
🌐 Listening on 0.0.0.0:5000
📦 Environment: production
🔗 Frontend URL: https://your-frontend.railway.app
📊 MongoDB: Configured
📄 PDF Worker: Disabled
============================================================
🚀 Server is ready to accept requests!
✅ MongoDB connected successfully
```

### If MongoDB fails (server still works):
```
============================================================
✅ EKYC API Server successfully started
🌐 Listening on 0.0.0.0:5000
...
============================================================
🚀 Server is ready to accept requests!
❌ Failed to connect to MongoDB
⚠️  Server will continue without database. API endpoints may not work.
```

## Quick Fix Commands

### Force redeploy on Railway:
```bash
# Trigger redeploy
git commit --allow-empty -m "Trigger Railway redeploy"
git push origin master
```

### Check Railway logs:
```bash
railway logs
```

### Test locally first:
```bash
cd backend
npm install
$env:MONGODB_URI="your-mongodb-uri"
$env:JWT_SECRET="test-secret"
$env:PORT="5000"
npm start
```

## Health Check Response

### Healthy Server:
```json
{
  "status": "ok",
  "service": "EKYC Backend API",
  "version": "1.0.0",
  "uptime": 45.123,
  "services": {
    "server": true,
    "database": true,
    "pdfWorker": false
  }
}
```

### Server running but DB disconnected:
```json
{
  "status": "ok",
  "service": "EKYC Backend API",
  "version": "1.0.0",
  "uptime": 12.456,
  "services": {
    "server": true,
    "database": false,
    "pdfWorker": false
  }
}
```

## Next Steps After Deployment

1. **Verify health endpoint** returns 200 status
2. **Test admin login** endpoint
3. **Test KYC form submission** endpoint
4. **Check MongoDB data** is being saved
5. **Update frontend** `REACT_APP_API_URL` to point to Railway backend URL

## Support

If issues persist after following this guide:
1. Check Railway Dashboard > Logs
2. Verify all environment variables
3. Test MongoDB connection separately
4. Check Railway service status
