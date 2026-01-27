#!/bin/bash

# 🚀 Sideline Stats - One-Click Free Deployment Script

echo "🎯 Sideline Stats - Free Deployment Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the app first
echo "📦 Building your app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors above and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel (free hosting)..."
echo "📍 Your app will be available at: https://sideline-stats-[random].vercel.app"
echo ""
echo "💡 First time? You'll need to:"
echo "   1. Sign up for a free Vercel account"
echo "   2. Link your Git repository (optional)"
echo "   3. Confirm deployment settings"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your Sideline Stats app is now live!"
    echo ""
    echo "📱 What you can do now:"
    echo "   • Share the URL with anyone"
    echo "   • Test on mobile devices"
    echo "   • Add a custom domain in Vercel dashboard"
    echo "   • View analytics in Vercel dashboard"
    echo ""
    echo "🔗 Your app is production-ready with:"
    echo "   • Global CDN"
    echo "   • Automatic HTTPS"
    echo "   • PWA support"
    echo "   • Mobile optimization"
    echo "   • Free hosting forever!"
else
    echo ""
    echo "❌ Deployment failed. Please check the error messages above."
    echo "💡 You can also try manual deployment:"
    echo "   1. Go to vercel.com"
    echo "   2. Connect your GitHub repository"
    echo "   3. Deploy from the dashboard"
fi
