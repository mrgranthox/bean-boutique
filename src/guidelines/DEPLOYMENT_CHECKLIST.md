# Bean Boutique - Database Deployment Checklist

Use this checklist to ensure a smooth deployment of the new relational database.

## ✅ Pre-Deployment

### Review & Understand

- [ ] Read `/MIGRATION_SUMMARY.md` to understand what changed
- [ ] Review `/MIGRATION.sql` to understand the schema
- [ ] Check `/SEED_DATA.sql` to see what data will be created
- [ ] Read `/DATABASE_SETUP_GUIDE.md` for detailed instructions
- [ ] Understand the new table structure from `/DATABASE_QUICK_REFERENCE.md`

### Backup Current System

- [ ] Export existing KV store data (if any):
  ```sql
  COPY kv_store_4d0792a7 TO '/tmp/kv_backup.csv' CSV HEADER;
  ```
- [ ] Take note of current environment variables
- [ ] Document current admin users
- [ ] Screenshot current application state

### Prerequisites Check

- [ ] Supabase project is created
- [ ] Project URL and API keys are available
- [ ] Supabase CLI is installed (`npm install -g supabase`)
- [ ] You have admin access to Supabase Dashboard
- [ ] You're logged into Supabase CLI (`supabase login`)

## ✅ Database Setup

### Run Migration

- [ ] Open Supabase Dashboard
- [ ] Navigate to **SQL Editor**
- [ ] Click **New Query**
- [ ] Copy entire contents of `/MIGRATION.sql`
- [ ] Paste into editor
- [ ] Click **Run** (or Cmd/Ctrl + Enter)
- [ ] Wait for "Success" message
- [ ] Verify no errors in output

### Verify Tables Created

- [ ] Go to **Table Editor** in Supabase Dashboard
- [ ] Confirm these 13 tables exist:
  - [ ] users
  - [ ] profiles
  - [ ] products
  - [ ] reviews
  - [ ] orders
  - [ ] order_items
  - [ ] events
  - [ ] event_registrations
  - [ ] subscriptions
  - [ ] carts
  - [ ] promotions
  - [ ] offers
  - [ ] blog_posts
  - [ ] banners

### Check RLS Policies

- [ ] In Table Editor, click on a table (e.g., `products`)
- [ ] Click **Policies** tab
- [ ] Verify policies are listed
- [ ] Test a simple query to ensure RLS works

### Seed Initial Data

- [ ] In SQL Editor, click **New Query**
- [ ] Copy entire contents of `/SEED_DATA.sql`
- [ ] Paste into editor
- [ ] Click **Run**
- [ ] Wait for "Success" message
- [ ] Verify no errors

### Verify Seed Data

- [ ] Check products table: `SELECT COUNT(*) FROM products;` (should be 16)
- [ ] Check events table: `SELECT COUNT(*) FROM events;` (should be 6)
- [ ] Check blog posts: `SELECT COUNT(*) FROM blog_posts;` (should be 4)
- [ ] Check offers: `SELECT COUNT(*) FROM offers;` (should be 3)
- [ ] Check promotions: `SELECT COUNT(*) FROM promotions;` (should be 3)
- [ ] Check banners: `SELECT COUNT(*) FROM banners;` (should be 3)

## ✅ Backend Deployment

### Update Environment

- [ ] Environment variables are set in project (should be automatic):
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SUPABASE_DB_URL`

### Deploy Edge Function

- [ ] Open terminal in project directory
- [ ] Run: `supabase link --project-ref YOUR_PROJECT_REF`
- [ ] Verify link successful
- [ ] Run: `supabase functions deploy make-server-4d0792a7`
- [ ] Wait for deployment to complete
- [ ] Note the function URL

### Test Edge Function

- [ ] Test health endpoint:
  ```bash
  curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-4d0792a7/health
  ```
- [ ] Should return: `{"status":"ok","timestamp":"..."}`
- [ ] Check **Edge Functions** logs in Supabase Dashboard
- [ ] Verify no errors in logs

## ✅ Application Configuration

### Update Frontend

- [ ] Verify `/utils/supabase/info.tsx` has correct project ID
- [ ] Verify `publicAnonKey` is set correctly
- [ ] No changes needed to API client code
- [ ] No changes needed to component code

### Create Admin User

- [ ] Open your application
- [ ] Click **Sign Up**
- [ ] Create account with your email
- [ ] Verify sign up successful
- [ ] Go to Supabase Dashboard > SQL Editor
- [ ] Run:
  ```sql
  UPDATE public.users 
  SET role = 'admin' 
  WHERE email = 'your-email@example.com';
  ```
- [ ] Verify: `SELECT role FROM users WHERE email = 'your-email@example.com';`
- [ ] Should return `'admin'`
- [ ] Sign out and sign back in
- [ ] Verify **Admin Dashboard** option appears in menu

## ✅ Testing

### Basic Functionality

- [ ] Homepage loads without errors
- [ ] Coffee products page shows 8 coffee items
- [ ] Equipment page shows 8 equipment items
- [ ] Events page shows 6 upcoming events
- [ ] Blog page shows 4 articles
- [ ] Offers page shows active promotions

### Shopping Flow

- [ ] Can add product to cart
- [ ] Cart shows correct items
- [ ] Cart persists after refresh (when logged in)
- [ ] Can update quantities in cart
- [ ] Can remove items from cart
- [ ] Can proceed to checkout
- [ ] Can place order (test with fake data)
- [ ] Order appears in profile > order history

### User Features

- [ ] Can sign up with new account
- [ ] Can sign in with existing account
- [ ] Can view user profile
- [ ] Can update profile information
- [ ] Can view order history
- [ ] Can register for an event
- [ ] Can leave a product review
- [ ] Can create a subscription

### Admin Features

- [ ] Admin dashboard loads
- [ ] Can view analytics
- [ ] Can view all orders
- [ ] Can update order status
- [ ] Can view all users
- [ ] Can create new product
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Can create new event
- [ ] Can edit event
- [ ] Can view event registrations

### Error Handling

- [ ] Invalid login shows error
- [ ] Adding invalid product shows error
- [ ] Checkout without items shows validation
- [ ] Admin pages blocked for non-admin users
- [ ] Backend errors are logged in console

## ✅ Performance Check

### Page Load Times

- [ ] Homepage loads in < 2 seconds
- [ ] Product pages load in < 1 second
- [ ] Admin dashboard loads in < 3 seconds
- [ ] Cart operations complete in < 500ms

### Database Performance

- [ ] Check slow queries in Supabase Dashboard > Logs
- [ ] Verify indexes are being used (check query plans)
- [ ] No timeout errors in logs
- [ ] Reasonable response times for all queries

## ✅ Security Verification

### RLS Testing

- [ ] Non-admin users can't access admin endpoints
- [ ] Users can't see other users' orders
- [ ] Users can't edit other users' reviews
- [ ] Users can only manage their own cart
- [ ] Public endpoints work without authentication

### API Security

- [ ] Admin endpoints require authentication
- [ ] Admin endpoints verify admin role
- [ ] User endpoints verify user ownership
- [ ] Access tokens are properly validated
- [ ] No service role key exposed to frontend

## ✅ Monitoring

### Set Up Monitoring

- [ ] Enable real-time logs in Supabase Dashboard
- [ ] Monitor Edge Function invocations
- [ ] Monitor database query performance
- [ ] Set up error alerts (optional)

### Check Metrics

- [ ] View Edge Function metrics
- [ ] Check database connection pool
- [ ] Monitor API latency
- [ ] Review error rates

## ✅ Documentation

### Update Internal Docs

- [ ] Document new database schema for team
- [ ] Update deployment procedures
- [ ] Share admin credentials securely
- [ ] Document common maintenance tasks

### User Communication

- [ ] Notify users of any changes (if applicable)
- [ ] Update help documentation
- [ ] Prepare support team for new features

## ✅ Post-Deployment

### Immediate Tasks (First Hour)

- [ ] Monitor error logs actively
- [ ] Test critical user flows
- [ ] Verify all features working
- [ ] Check database performance
- [ ] Respond to any issues quickly

### First Day Tasks

- [ ] Review all error logs
- [ ] Check user feedback
- [ ] Monitor performance metrics
- [ ] Verify data integrity
- [ ] Document any issues found

### First Week Tasks

- [ ] Analyze usage patterns
- [ ] Optimize slow queries if found
- [ ] Review RLS policies for gaps
- [ ] Collect user feedback
- [ ] Plan improvements

## ✅ Rollback Plan (If Needed)

### Emergency Rollback

If critical issues arise:

- [ ] Document the issue thoroughly
- [ ] Notify stakeholders
- [ ] Restore KV store backup (if you made one)
- [ ] Redeploy previous Edge Function version
- [ ] Test rollback successful
- [ ] Communicate to users

### Investigation

- [ ] Review error logs to identify issue
- [ ] Check RLS policies
- [ ] Verify data integrity
- [ ] Test in staging environment
- [ ] Fix issues before re-deploying

## 📊 Success Metrics

After deployment, verify these metrics:

- [ ] **Availability**: Application is accessible 99.9%+ of time
- [ ] **Performance**: All pages load in < 3 seconds
- [ ] **Error Rate**: < 1% of requests fail
- [ ] **Database**: All queries complete in < 500ms
- [ ] **User Experience**: No complaints about broken features

## 🎉 Completion

Once all items are checked:

- [ ] **Deployment is complete!**
- [ ] Application is running on production database
- [ ] All features are working correctly
- [ ] Monitoring is in place
- [ ] Team is informed
- [ ] Documentation is updated

## 📚 Reference Documents

Keep these handy:

- [ ] `/MIGRATION.sql` - Full schema
- [ ] `/SEED_DATA.sql` - Initial data
- [ ] `/DATABASE_SETUP_GUIDE.md` - Setup instructions
- [ ] `/DATABASE_QUICK_REFERENCE.md` - Common queries
- [ ] `/MIGRATION_SUMMARY.md` - What changed
- [ ] `/README.md` - Full documentation

## 🆘 Emergency Contacts

Document these:

- **Supabase Project URL**: ___________________________
- **Project Admin**: ___________________________
- **Backup Admin**: ___________________________
- **Support Email**: ___________________________

## 💡 Tips

1. **Deploy during low-traffic hours** to minimize user impact
2. **Have a rollback plan ready** before starting
3. **Monitor actively** during and after deployment
4. **Test thoroughly** before marking deployment complete
5. **Document issues** as they arise for future reference
6. **Communicate clearly** with stakeholders
7. **Don't rush** - take time to verify each step

---

## ✅ Final Checklist

Before marking deployment complete:

- [ ] All tests pass
- [ ] All features work
- [ ] No critical errors in logs
- [ ] Performance is acceptable
- [ ] Security verified
- [ ] Admin access confirmed
- [ ] Monitoring in place
- [ ] Documentation updated
- [ ] Team informed
- [ ] Users notified (if needed)

**Deployment Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

**Deployed By**: ___________________________

**Date**: ___________________________

**Time**: ___________________________

**Notes**: ___________________________

---

**🎊 Congratulations on deploying your production database!** 🎊