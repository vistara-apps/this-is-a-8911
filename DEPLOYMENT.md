# Shield Rights - Deployment Guide

This guide covers the complete deployment process for the Shield Rights application, including all required services and configurations.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Vercel)      │◄──►│   (Vercel)      │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN Assets    │    │   External APIs │    │   File Storage  │
│   (Vercel)      │    │   (OpenAI, etc) │    │   (IPFS/Pinata) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

Before deploying, ensure you have accounts and API keys for:

1. **Vercel** - Frontend and API hosting
2. **Supabase** - Database and authentication
3. **OpenAI** - Content generation
4. **Stripe** - Payment processing
5. **Pinata** - IPFS storage
6. **GitHub** - Source code repository

## 🚀 Step-by-Step Deployment

### 1. Database Setup (Supabase)

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Set Up Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Run the SQL to create tables and policies

#### Configure Authentication (Optional)
1. Go to Authentication > Settings
2. Configure providers if needed
3. Set up email templates

### 2. External API Setup

#### OpenAI API
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Set usage limits and billing

#### Stripe Setup
1. Go to [stripe.com](https://stripe.com)
2. Create account and get API keys
3. Create products and prices:
   ```bash
   # Premium subscription product
   Price ID: price_premium_monthly
   Amount: $3.99/month
   ```
4. Set up webhooks endpoint: `https://your-domain.com/api/webhook`

#### Pinata IPFS Setup
1. Go to [pinata.cloud](https://pinata.cloud)
2. Create account and get API keys
3. Create a dedicated gateway (optional)

### 3. Frontend Deployment (Vercel)

#### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the root directory

#### Configure Environment Variables
In Vercel dashboard, add these environment variables:

```env
# OpenAI
VITE_OPENAI_API_KEY=sk-...

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Pinata
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App Config
VITE_APP_ENV=production
VITE_API_BASE_URL=https://your-domain.com/api
```

#### Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test the deployment

### 4. Backend API Deployment (Vercel Functions)

The API is automatically deployed with the frontend using Vercel Functions.

#### Configure API Environment Variables
Add these additional environment variables for the API:

```env
# Server Config
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Stripe (Server-side)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase (Service Role)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (Server-side)
OPENAI_API_KEY=sk-...

# Pinata (Server-side)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

### 5. Domain Configuration

#### Custom Domain (Optional)
1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Configure DNS records
4. Enable HTTPS (automatic)

#### Update CORS Settings
Update your API CORS configuration to include your production domain.

### 6. Stripe Webhook Configuration

#### Set Up Webhook Endpoint
1. In Stripe dashboard, go to Webhooks
2. Add endpoint: `https://your-domain.com/api/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
4. Copy webhook secret to environment variables

### 7. Testing Production Deployment

#### Functional Testing
- [ ] User registration/login
- [ ] State selection
- [ ] Rights card display
- [ ] Audio recording
- [ ] IPFS upload
- [ ] AI content generation
- [ ] Social sharing
- [ ] Payment processing
- [ ] Subscription management

#### Performance Testing
- [ ] Page load times < 3s
- [ ] Mobile responsiveness
- [ ] Audio recording quality
- [ ] API response times

## 🔧 Production Optimizations

### Frontend Optimizations
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
}
```

### API Optimizations
- Enable compression
- Implement rate limiting
- Add request logging
- Set up monitoring

### Database Optimizations
- Enable connection pooling
- Add database indexes
- Set up read replicas (if needed)

## 📊 Monitoring & Analytics

### Error Tracking
1. Set up Sentry or similar service
2. Add error boundaries in React
3. Log API errors

### Performance Monitoring
1. Use Vercel Analytics
2. Set up Core Web Vitals tracking
3. Monitor API response times

### User Analytics
1. Add privacy-compliant analytics
2. Track user engagement
3. Monitor conversion rates

## 🔒 Security Checklist

### Frontend Security
- [ ] Environment variables properly configured
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced
- [ ] Content Security Policy headers

### Backend Security
- [ ] API rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Proper error handling (no sensitive info leaked)
- [ ] CORS properly configured

### Database Security
- [ ] Row Level Security (RLS) enabled
- [ ] Proper user permissions
- [ ] Regular backups configured
- [ ] SSL connections enforced

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
vercel --prod --force

# Check build logs
vercel logs your-deployment-url
```

#### API Errors
```bash
# Check function logs
vercel logs --follow

# Test API endpoints
curl https://your-domain.com/api/health
```

#### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure service role key has proper permissions

### Environment Variable Issues
- Ensure all required variables are set
- Check for typos in variable names
- Verify API keys are valid and have proper permissions

## 📈 Scaling Considerations

### Traffic Growth
- Monitor Vercel function usage
- Consider upgrading Supabase plan
- Implement caching strategies

### Feature Expansion
- Plan for additional states/countries
- Consider microservices architecture
- Implement feature flags

## 🔄 CI/CD Pipeline

### Automated Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Quality Gates
- Run tests before deployment
- Check code coverage
- Validate environment variables
- Test API endpoints

## 📞 Support & Maintenance

### Regular Maintenance
- Update dependencies monthly
- Monitor security advisories
- Review and rotate API keys
- Backup database regularly

### Support Channels
- Set up status page
- Create support documentation
- Monitor user feedback
- Plan for incident response

---

## 🎉 Deployment Complete!

Your Shield Rights application should now be live and fully functional. Monitor the deployment closely for the first few days and be prepared to address any issues that arise.

For ongoing support and updates, refer to the main README.md and keep this deployment guide updated as your infrastructure evolves.
