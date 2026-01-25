# VanigaTech Deployment Guide 🚀

## Prerequisites
- GitHub account
- Vercel account (free tier)
- Render account (free tier)
- MongoDB Atlas account (free tier)

---

## Part 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set role to "Atlas admin"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `vanigatech`

---

## Part 2: Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `vaniga-tech`
   - Select the repository

3. **Configure Web Service**
   ```
   Name: vanigatech-backend
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-random-32-character-string>
   CLIENT_URL=https://your-app.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://vanigatech-backend.onrender.com`

---

## Part 3: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import `vaniga-tech` repository
   - Select the repository

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   Click "Environment Variables"
   
   Add:
   ```
   Name: VITE_API_URL
   Value: https://vanigatech-backend.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at: `https://your-app.vercel.app`

---

## Part 4: Update Backend CORS

1. **Go back to Render**
   - Open your backend service
   - Go to "Environment"
   - Update `CLIENT_URL` to your Vercel URL
   - Example: `https://vanigatech.vercel.app`
   - Click "Save Changes"
   - Service will auto-redeploy

---

## Part 5: Test Your Deployment

1. **Visit your Vercel URL**
   - Example: `https://vanigatech.vercel.app`

2. **Register a new account**
   - Test the registration flow

3. **Create transactions**
   - Test all features

4. **Check if data persists**
   - Refresh page, data should remain

---

## Troubleshooting

### Frontend can't connect to backend
- Check VITE_API_URL in Vercel environment variables
- Make sure it ends with `/api`
- Redeploy frontend after changing env vars

### Backend errors
- Check Render logs: Dashboard → Logs
- Verify MongoDB connection string
- Check all environment variables are set

### CORS errors
- Verify CLIENT_URL in Render matches your Vercel URL
- Make sure there's no trailing slash

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render
1. Go to Settings → Custom Domain
2. Add your custom domain
3. Update DNS records

---

## Free Tier Limits

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

**Render:**
- 750 hours/month (enough for 1 service 24/7)
- Spins down after 15 min inactivity
- Spins up on first request (may take 30s)

**MongoDB Atlas:**
- 512 MB storage
- Shared RAM
- Perfect for development/small apps

---

## Post-Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas connected
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Test registration
- [ ] Test login
- [ ] Test transactions
- [ ] Test all features
- [ ] Update README with live URLs

---

## Live URLs

After deployment, update these:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://vanigatech-backend.onrender.com
- **GitHub:** https://github.com/Px-Jebaseelan/vaniga-tech

---

**Congratulations! 🎉 VanigaTech is now live!**
