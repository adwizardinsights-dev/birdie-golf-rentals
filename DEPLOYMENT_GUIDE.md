# Birdie Golf Rentals - Vercel Deployment Guide

## 📋 Prerequisites

- Vercel account (you already have one ✅)
- GitHub account (for easier deployment)
- PostgreSQL database (Vercel Postgres, Supabase, or Railway)
- Stripe account (for payments)

---

## 🚀 Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```
This will open a browser window to authenticate.

### Step 3: Navigate to Project

```bash
cd /path/to/birdie-golf-rentals
```

### Step 4: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Link to existing project? **N** (first time)
- Project name: **birdie-golf-rentals**
- Directory: **./** (current directory)

### Step 5: Set Environment Variables

After deployment, add your environment variables:

```bash
vercel env add DATABASE_URL
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_APP_URL
```

Or use the Vercel Dashboard (see Method 2).

---

## 🌐 Method 2: Deploy via Vercel Dashboard

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
cd birdie-golf-rentals
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/birdie-golf-rentals.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **"Import"**

### Step 3: Configure Project

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | ./ |
| Build Command | `next build` |
| Output Directory | `dist` |

Click **"Deploy"**

### Step 4: Add Environment Variables

1. Go to Project Settings → Environment Variables
2. Add each variable:

```
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
RESEND_API_KEY=re_...
FROM_EMAIL=bookings@birdiegolfrentals.com
```

3. Click **"Save"**

### Step 5: Redeploy

1. Go to Deployments tab
2. Click the three dots on latest deployment
3. Click **"Redeploy"**

---

## 🗄️ Database Setup

### Option A: Vercel Postgres (Easiest)

1. In Vercel Dashboard, go to **"Storage"**
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose region closest to your users
5. Click **"Create"**
6. Copy the connection string
7. Add to Environment Variables as `DATABASE_URL`

### Option B: Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Add to Vercel Environment Variables

### Run Migrations

```bash
# Install Vercel CLI if not already
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

---

## 💳 Stripe Setup

### 1. Get API Keys

1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Copy **Publishable key** (starts with `pk_`)
3. Copy **Secret key** (starts with `sk_`)

### 2. Add to Vercel

Add both keys to Environment Variables:
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (same as publishable key)

### 3. Configure Webhook

1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **"Add endpoint"**
6. Copy **Signing secret** (starts with `whsec_`)
7. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## 📱 Twilio Setup (Optional - for SMS)

1. Go to [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token
3. Buy a phone number
4. Add to Vercel Environment Variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

---

## 📧 Email Setup (Optional)

### Resend (Recommended - Free tier)

1. Go to [resend.com](https://resend.com)
2. Create API key
3. Verify your domain
4. Add to Vercel:
   - `RESEND_API_KEY`
   - `FROM_EMAIL`

---

## ✅ Post-Deployment Checklist

- [ ] Website loads without errors
- [ ] Homepage search widget works
- [ ] Booking flow completes
- [ ] Stripe payment works (use test card: `4242 4242 4242 4242`)
- [ ] Admin dashboard accessible
- [ ] Database connected
- [ ] Environment variables set

---

## 🔧 Common Issues & Fixes

### Issue: Build fails

**Fix:** Check build logs in Vercel Dashboard
```bash
# Test build locally
npm run build
```

### Issue: Database connection error

**Fix:** 
1. Verify `DATABASE_URL` is correct
2. Ensure database allows connections from Vercel IPs
3. Check if migrations were run

### Issue: Stripe payments not working

**Fix:**
1. Verify Stripe keys are correct
2. Check webhook endpoint URL
3. Verify webhook secret is set

### Issue: Images not loading

**Fix:** Add image domains to `next.config.js`:
```javascript
images: {
  domains: ['your-image-domain.com'],
}
```

---

## 🔄 Continuous Deployment

With GitHub integration, every push to `main` branch automatically deploys:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically build and deploy!

---

## 🌐 Custom Domain (Optional)

1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel Dashboard, go to **Domains**
3. Click **"Add"**
4. Enter your domain
5. Follow DNS configuration instructions

---

## 📊 Monitoring

### Vercel Analytics

1. Go to Project → Analytics
2. Enable Web Analytics
3. View performance metrics

### Error Tracking

Add Sentry for error tracking:
```bash
npx @sentry/wizard@latest -i nextjs
```

---

## 🎉 You're Live!

Your Birdie Golf Rentals platform is now deployed! 

**Next Steps:**
1. Test the full booking flow
2. Set up real Stripe account (switch from test mode)
3. Configure Twilio for SMS
4. Add Google Maps API key
5. Start accepting real bookings!

---

## 📞 Need Help?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Prisma Docs: [prisma.io/docs](https://prisma.io/docs)
- Stripe Docs: [stripe.com/docs](https://stripe.com/docs)
