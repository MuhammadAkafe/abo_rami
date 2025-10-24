# DATABASE_URL Troubleshooting Guide

## 🚨 Current Issue
```
Invalid `prisma.users.findUnique()` invocation: error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`
```

This error means Prisma cannot access the `DATABASE_URL` environment variable in production.

## 🔧 Step-by-Step Fix

### Step 1: Check Your Deployment Platform

#### **If using Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Look for `DATABASE_URL`
5. If missing, click **Add New** and set:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://servie_app_owner:npg_yW3Lkbsrh6KF@ep-holy-rice-a9rfzwe9-pooler.gwc.azure.neon.tech/abo_rami?sslmode=require&channel_binding=require`
   - **Environment**: Select **Production** (and Preview if needed)

#### **If using Netlify:**
1. Go to your site dashboard
2. Go to **Site settings** → **Environment variables**
3. Add/update `DATABASE_URL`

#### **If using Railway:**
1. Go to your project dashboard
2. Go to **Variables** tab
3. Add/update `DATABASE_URL`

#### **If using Render:**
1. Go to your service dashboard
2. Go to **Environment** tab
3. Add/update `DATABASE_URL`

### Step 2: Common Issues

#### **Issue A: Environment Variable Not Set for Production**
- Make sure `DATABASE_URL` is set for **Production** environment
- Some platforms require setting it for each environment separately

#### **Issue B: Wrong Environment Scope**
- Check if the variable is set for the correct environment (Production vs Development)

#### **Issue C: Quotes in Environment Variable**
- Don't include quotes when setting the environment variable
- Set as: `postgresql://servie_app_owner:npg_yW3Lkbsrh6KF@ep-holy-rice-a9rfzwe9-pooler.gwc.azure.neon.tech/abo_rami?sslmode=require&channel_binding=require`
- **NOT**: `"postgresql://..."`

#### **Issue D: Special Characters**
- The URL contains special characters that might need escaping
- Try URL-encoding special characters if needed

### Step 3: Test the Fix

#### **Option A: Use Debug Endpoint (Development Only)**
Visit: `http://localhost:3000/api/debug/env` to check environment variables

#### **Option B: Check Production Logs**
After deploying, check your production logs for:
```
Environment check: { 
  NODE_ENV: 'production', 
  DATABASE_URL: 'Set', 
  CLERK_SECRET_KEY: 'Set', 
  CLERK_PUBLISHABLE_KEY: 'Set' 
}
```

#### **Option C: Test Database Connection**
Run the test script locally:
```bash
node test-db-connection.js
```

### Step 4: Verify the Fix

Once you've set the `DATABASE_URL` in your production environment:

1. **Redeploy your application**
2. **Try adding a supplier again**
3. **Check the logs** - you should see the detailed logging working
4. **The error should be resolved**

## 🚀 Quick Action Items

1. **Go to your deployment platform**
2. **Find Environment Variables section**
3. **Add/update `DATABASE_URL`** with your Neon URL
4. **Make sure it's set for Production environment**
5. **Redeploy your application**
6. **Test supplier addition again**

## 📋 Your DATABASE_URL Should Be:
```
postgresql://servie_app_owner:npg_yW3Lkbsrh6KF@ep-holy-rice-a9rfzwe9-pooler.gwc.azure.neon.tech/abo_rami?sslmode=require&channel_binding=require
```

## ✅ Success Indicators

After fixing, you should see in your logs:
- `DATABASE_URL: 'Set'` (not 'Not set')
- No more "URL must start with protocol" errors
- Successful supplier creation
