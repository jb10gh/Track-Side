# Deployment Procedures for Sideline Stats

## Platform Analysis

**Project Type:** Static React PWA (Progressive Web App)  
**Recommended Platform:** Vercel or Netlify  
**Deployment Method:** Git-based auto-deployment  

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] Linting clean (`npm run lint`)
- [ ] Production build successful (`npm run build`)
- [ ] No console errors in production build

### Environment Setup
- [ ] Environment variables documented
- [ ] PWA manifest configured
- [ ] Service worker optimized
- [ ] Build size optimized (< 1MB ideal)

### Safety Checks
- [ ] Current version backed up
- [ ] Rollback plan ready (revert to previous commit)
- [ ] Performance budgets set
- [ ] Error monitoring configured

## Deployment Workflow

### 1. Prepare Phase
```bash
# Run full test suite
npm run test:coverage

# Check linting
npm run lint

# Production build test
npm run build && npm run preview
```

### 2. Backup Phase
- Current production version tagged in Git
- Build artifacts saved
- Performance metrics recorded

### 3. Deploy Phase
```bash
# Commit changes
git add .
git commit -m "feat: improve UI and add tests"
git push origin main

# Platform handles auto-deployment
```

### 4. Verification Phase
- [ ] Site loads without errors
- [ ] PWA installs correctly
- [ ] Core functionality works (start game, record events)
- [ ] Performance metrics within budget
- [ ] Mobile responsive test passed

### 5. Monitor Phase
- First 15 minutes: Active monitoring
- First hour: Check analytics
- Next day: Review performance

## Platform-Specific Procedures

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Netlify Alternative
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod --dir=dist
```

## Rollback Procedures

### Vercel Rollback
1. Go to Vercel dashboard
2. Select project
3. Click "Deployments"
4. Find previous stable deployment
5. Click "..." → "Promote to Production"

### Git Rollback (Emergency)
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or hard reset (last resort)
git reset --hard HEAD~1
git push --force-with-lease origin main
```

## Performance Monitoring

### Key Metrics
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Build Size:** < 1MB total
- **PWA Install Rate:** Track monthly

### Monitoring Tools
- Vercel Analytics (built-in)
- Lighthouse CI
- Chrome DevTools

## Emergency Procedures

### Site Down
1. Check Vercel status page
2. Verify DNS propagation
3. Check recent deployments
4. Rollback if needed
5. Communicate status

### Performance Degradation
1. Check bundle size
2. Analyze Core Web Vitals
3. Review recent changes
4. Optimize assets if needed

## Best Practices

### Development
- Small, frequent deployments
- Feature branches for major changes
- Always test on mobile devices
- Monitor bundle size

### PWA Specific
- Test service worker updates
- Verify offline functionality
- Check install prompts
- Test push notifications (if added)

### Security
- Keep dependencies updated
- Use HTTPS everywhere
- Validate user inputs
- Monitor for vulnerabilities

## Deployment Schedule

### Recommended Timing
- **Best:** Tuesday-Thursday, 10 AM - 2 PM
- **Avoid:** Friday afternoons, weekends, holidays
- **Emergency:** Anytime, with team notification

### Frequency
- **Bug fixes:** As needed
- **Features:** Weekly
- **Major updates:** Bi-weekly

---

*This deployment guide follows industry best practices for React PWA applications.*
