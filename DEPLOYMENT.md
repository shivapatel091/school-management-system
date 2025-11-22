# School Management System - Deployment Guide

This guide covers deploying your School Management System to production.

## 📋 Prerequisites

- Node.js 16+ installed
- MySQL database (local or cloud)
- Git repository
- Domain name (optional)

## 🚀 Deployment Options

### Option 1: Deploy to Render (Recommended - Free Tier Available)

#### Backend Deployment

1. **Prepare Backend for Production**
   ```bash
   cd server
   # Create production environment file
   cp .env.example .env.production
   ```

2. **Update `server/index.js` for Production**
   - Ensure CORS allows your frontend domain
   - Set `NODE_ENV=production`

3. **Create `render.yaml` in project root**
   ```yaml
   services:
     - type: web
       name: school-management-api
       env: node
       buildCommand: cd server && npm install
       startCommand: cd server && node index.js
       envVars:
         - key: NODE_ENV
           value: production
         - key: DB_HOST
           sync: false
         - key: DB_USER
           sync: false
         - key: DB_PASSWORD
           sync: false
         - key: DB_NAME
           sync: false
         - key: JWT_SECRET
           generateValue: true
   ```

4. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Create a new Web Service
   - Select your repository
   - Set environment variables in Render dashboard
   - Deploy!

#### Frontend Deployment

1. **Update API URL in Frontend**
   ```bash
   cd client
   # Create .env.production
   echo "VITE_API_URL=https://your-backend-url.onrender.com" > .env.production
   ```

2. **Update all API calls to use environment variable**
   - Replace `http://localhost:3000` with `import.meta.env.VITE_API_URL`

3. **Build Frontend**
   ```bash
   npm run build
   ```

4. **Deploy to Render**
   - Create a new Static Site on Render
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/dist`

---

### Option 2: Deploy to Vercel (Frontend) + Railway (Backend)

#### Backend on Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub repository

2. **Create New Project**
   - Select your repository
   - Add MySQL database from Railway
   - Set environment variables:
     ```
     DB_HOST=<railway-mysql-host>
     DB_USER=<railway-mysql-user>
     DB_PASSWORD=<railway-mysql-password>
     DB_NAME=school_management
     JWT_SECRET=<generate-random-secret>
     PORT=3000
     ```

3. **Configure Build**
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `node index.js`

#### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Update API URLs**
   - Create `client/.env.production`
   - Add: `VITE_API_URL=https://your-railway-backend.up.railway.app`

3. **Deploy**
   ```bash
   cd client
   vercel --prod
   ```

---

### Option 3: Deploy to VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Server Setup

```bash
# SSH into your server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### 2. Database Setup

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE school_management;
CREATE USER 'school_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON school_management.* TO 'school_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. Deploy Backend

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/school-project.git
cd school-project/server

# Install dependencies
sudo npm install

# Create .env file
sudo nano .env
```

Add:
```env
DB_HOST=localhost
DB_USER=school_user
DB_PASSWORD=strong_password
DB_NAME=school_management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
NODE_ENV=production
```

```bash
# Start with PM2
sudo pm2 start index.js --name school-api
sudo pm2 startup
sudo pm2 save
```

#### 4. Deploy Frontend

```bash
cd /var/www/school-project/client

# Update API URL
echo "VITE_API_URL=http://your-domain.com/api" > .env.production

# Build
npm install
npm run build

# Copy build to nginx
sudo cp -r dist/* /var/www/html/
```

#### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/school-management
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/school-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=school_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Server
PORT=3000
NODE_ENV=production

# CORS (if needed)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## 📝 Pre-Deployment Checklist

- [ ] Update all `http://localhost:3000` to use environment variables
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS for production domain
- [ ] Test database connection
- [ ] Run database migrations/sync
- [ ] Seed initial admin user
- [ ] Build frontend (`npm run build`)
- [ ] Test production build locally
- [ ] Set up database backups
- [ ] Configure SSL certificate
- [ ] Set up monitoring (optional)

---

## 🔐 Security Recommendations

1. **Use strong passwords** for database and JWT secret
2. **Enable HTTPS** with SSL certificate
3. **Set up firewall** rules (only allow ports 80, 443, 22)
4. **Regular backups** of database
5. **Keep dependencies updated** (`npm audit fix`)
6. **Use environment variables** for all secrets
7. **Implement rate limiting** on API endpoints
8. **Add logging** for security events

---

## 🐛 Troubleshooting

### Backend won't start
- Check database connection
- Verify environment variables
- Check PM2 logs: `pm2 logs school-api`

### Frontend can't connect to backend
- Verify CORS settings
- Check API URL in frontend .env
- Ensure backend is running

### Database errors
- Check credentials
- Verify database exists
- Run `sequelize.sync({ alter: true })`

---

## 📞 Support

For issues, check:
- Server logs: `pm2 logs`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Database logs: `sudo tail -f /var/log/mysql/error.log`

---

## 🎉 Post-Deployment

After successful deployment:

1. **Create admin user** via `/api/auth/seed`
2. **Test all features** thoroughly
3. **Set up monitoring** (UptimeRobot, etc.)
4. **Configure backups** (daily database dumps)
5. **Document API endpoints** for future reference

Your School Management System is now live! 🚀
