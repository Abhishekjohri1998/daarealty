# DAA Realty - Deployment Guide

This guide outlines the steps to deploy the DAA Realty application to a production environment (e.g., AWS EC2, DigitalOcean, etc.).

## 1. Prerequisites
- **Node.js**: v18+ recommended.
- **MongoDB**: A running MongoDB instance (e.g., MongoDB Atlas).
- **AWS Account**: For S3 bucket storage.

## 2. Infrastructure Setup

### AWS S3 Storage
1. Create an S3 bucket (e.g., `daa-realty-assets`).
2. Create an IAM User with `AmazonS3FullAccess` (or restricted to your bucket).
3. Generate **Access Key ID** and **Secret Access Key**.
4. Set the bucket to allow public read access if you want direct image linking.

### MongoDB
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist the IP address of your production server.
3. Get the connection string.

## 3. Environment Variables
Create a `.env` file on your server with the following:

```env
# Server Configuration
PORT=3000
JWT_SECRET=your_secure_random_string_here
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/daa-realty

# AWS S3 (Optional - falls back to local storage if missing)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=daa-realty-assets

# AI Features
GEMINI_API_KEY=your_gemini_api_key
```

## 4. Build & Deployment Steps

### Step 1: Clone and Install
```bash
git clone <your-repo-url>
cd daa-realty
npm install
```

### Step 2: Build the Frontend
Crucial step to generate the production React bundle:
```bash
npm run build
```
This creates a `dist` folder which `server.ts` serves in production mode.

### Step 3: Start the Server
Use a process manager like **PM2** to keep the app running:
```bash
# Install PM2 globally
npm install -g pm2

# Start the server using tsx
pm2 start "npx tsx server.ts" --name "daa-realty"
```

## 5. Subdomain Routing (Nginx)
If you are using subdomains (e.g., `api.daarealty.com`), use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name daarealty.com www.daarealty.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 6. Verification
- Visit your domain and check if the frontend loads.
- Test image uploads via the Admin panel to verify S3 integration.
- Check server logs: `pm2 logs daa-realty`.
