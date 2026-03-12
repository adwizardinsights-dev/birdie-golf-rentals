#!/bin/bash

# Birdie Golf Rentals - Quick Deploy Script for Vercel
# Usage: ./deploy.sh

echo "🚀 Birdie Golf Rentals - Vercel Deployment Script"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in
echo "🔑 Checking Vercel login status..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Please login to Vercel:${NC}"
    vercel login
fi

echo ""
echo -e "${GREEN}✅ Vercel CLI ready!${NC}"
echo ""

# Deploy
echo "📦 Starting deployment..."
echo ""
vercel --prod

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in Vercel Dashboard"
echo "2. Configure your database"
echo "3. Set up Stripe webhooks"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions."
echo "=================================================="
