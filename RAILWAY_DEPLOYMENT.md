# Railway Deployment Guide

## Step 1: Setup Railway Project

1. **Create account at [railway.app](https://railway.app)**

2. **Install Railway CLI** (optional)
```bash
npm i -g @railway/cli
railway login
```

## Step 2: Add MySQL Database

1. In Railway dashboard, click "New Project"
2. Select "Provision MySQL"
3. Railway will automatically create MySQL service with credentials

## Step 3: Deploy Your App

### Option A: Via GitHub (Recommended)

1. Push your code to GitHub
2. In Railway, click "New" → "GitHub Repo"
3. Select your repository
4. Railway will auto-deploy

### Option B: Via Railway CLI

```bash
railway link
railway up
```

## Step 4: Configure Environment Variables

Railway automatically sets these for MySQL:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`

**Map them to your app's variables:**

In Railway dashboard → Variables, add:
```
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
DB_NAME=${{MYSQLDATABASE}}
NODE_ENV=production
```

## Step 5: Database Setup

The database will be automatically set up on first deploy via:
```bash
npm run railway:deploy
```

This runs:
1. `npm run db:migrate` - Creates tables
2. `npm run db:seed` - Inserts sample data
3. `npm start` - Starts the server

### Manual Database Setup (Alternative)

If you prefer manual setup:

```bash
# Connect to Railway MySQL
railway run npx sequelize-cli db:migrate
railway run npx sequelize-cli db:seed:all
```

## Step 6: Verify Deployment

1. Railway will provide a public URL (e.g., `https://your-app.up.railway.app`)
2. Test endpoints:
   - `GET https://your-app.up.railway.app/api/health-check`
   - `GET https://your-app.up.railway.app/api/blogs`

## Environment Variables Reference

```env
# Railway provides these automatically for MySQL:
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=6543
MYSQLUSER=root
MYSQLPASSWORD=xxxxx
MYSQLDATABASE=railway

# Your app needs these (map from Railway vars):
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
DB_NAME=${{MYSQLDATABASE}}
NODE_ENV=production
PORT=3000
```

## Troubleshooting

### Connection Issues
- Verify environment variables are correctly mapped
- Check MySQL service is running in Railway dashboard

### Migration Failed
```bash
# Run manually via Railway CLI
railway run npx sequelize-cli db:migrate
```

### Check Logs
```bash
railway logs
```

## Useful Commands

```bash
# Run migrations only
npm run db:migrate

# Run seeds only
npm run db:seed

# Full setup (migrate + seed)
npm run db:setup

# Connect to Railway MySQL
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE
```
