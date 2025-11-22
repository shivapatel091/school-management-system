# Railway Backend Deployment Guide

## Quick Setup for Railway

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `server` directory as the root

### 2. Add MySQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add MySQL"
3. Railway will automatically create a MySQL instance
4. Note the connection details

### 3. Configure Environment Variables

In Railway dashboard, go to your service → Variables tab and add:

```
DB_HOST=<from Railway MySQL>
DB_USER=<from Railway MySQL>
DB_PASSWORD=<from Railway MySQL>
DB_NAME=railway
JWT_SECRET=<generate-a-strong-random-secret-key>
PORT=3000
NODE_ENV=production
```

**To get MySQL credentials:**
- Click on your MySQL database in Railway
- Go to "Variables" tab
- Copy: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`

### 4. Set Root Directory

1. Go to Settings
2. Under "Build & Deploy"
3. Set **Root Directory** to: `server`
4. Set **Start Command** to: `node index.js`

### 5. Deploy

Railway will automatically deploy when you push to GitHub!

## Alternative: Manual Configuration

If Railway doesn't auto-detect, add these settings:

**Build Command:** (leave empty, Railway will run `npm install` automatically)

**Start Command:** `node index.js`

**Root Directory:** `server`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | MySQL host from Railway | `containers-us-west-123.railway.app` |
| DB_USER | MySQL user from Railway | `root` |
| DB_PASSWORD | MySQL password from Railway | `abc123xyz` |
| DB_NAME | Database name | `railway` |
| JWT_SECRET | Secret for JWT tokens | `your-super-secret-key-min-32-chars` |
| PORT | Server port | `3000` |
| NODE_ENV | Environment | `production` |

## Troubleshooting

### Build fails
- Check that `package.json` has a `start` script
- Verify root directory is set to `server`
- Check build logs for specific errors

### Database connection fails
- Verify all DB environment variables are set correctly
- Check that MySQL database is running
- Ensure database name matches (usually `railway`)

### App crashes on start
- Check deployment logs in Railway dashboard
- Verify `JWT_SECRET` is set
- Ensure all required environment variables are present

## Testing Your Deployment

Once deployed, Railway will give you a URL like:
```
https://your-app-name.up.railway.app
```

Test the API:
```bash
# Health check
curl https://your-app-name.up.railway.app/

# Seed admin user
curl -X POST https://your-app-name.up.railway.app/api/auth/seed
```

## Next Steps

1. ✅ Deploy backend on Railway
2. Update frontend `VITE_API_URL` to your Railway URL
3. Deploy frontend on Vercel/Netlify
4. Test the full application

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Verify environment variables
3. Check database connection
4. Review build logs for errors
