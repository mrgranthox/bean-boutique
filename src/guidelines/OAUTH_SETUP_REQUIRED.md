# OAuth Setup Guide - Google & GitHub

## ⚠️ Important: OAuth Requires Manual Setup

OAuth (Google and GitHub login) **will not work** until you complete the setup steps below. This is a security requirement and cannot be automated.

**Good News:** Email/password authentication works immediately without any setup!

---

## Why OAuth Needs Setup

When you click "Sign in with Google" or "Sign in with GitHub", you're asking those services to verify your users. For security reasons, Google and GitHub need to know:

1. **Who is asking for authentication** (your app)
2. **Where to send users after login** (callback URL)
3. **What permissions you need** (scopes)

This requires creating OAuth apps in their developer consoles.

---

## Option 1: Skip OAuth (Recommended for Quick Start)

**You don't need OAuth to use the application!**

✅ Email/password login works perfectly
✅ All features are available
✅ No setup required

**Just use the email/password login and skip this guide.**

---

## Option 2: Set Up Google OAuth

### Step 1: Enable in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Click to expand Google settings
6. Toggle **"Enable Sign in with Google"**
7. **Don't click Save yet** - you need Client ID and Secret first

### Step 2: Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: **Bean Boutique** (or your app name)
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Keep defaults, click **Save and Continue**
   - Test users: Add your email, click **Save and Continue**

6. Back to Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Bean Boutique Web**
   - Authorized JavaScript origins: `https://YOUR-PROJECT-ID.supabase.co`
   - Authorized redirect URIs: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
   - Click **Create**

7. **Copy the Client ID and Client Secret** that appear

### Step 3: Add Credentials to Supabase

1. Back in Supabase Dashboard → Authentication → Providers → Google
2. Paste **Client ID** from Google Console
3. Paste **Client Secret** from Google Console  
4. Click **Save**

### Step 4: Test Google Login

1. Go to your application
2. Click **Sign In**
3. Click **Sign in with Google** button
4. Should redirect to Google login
5. Select your Google account
6. Should redirect back to your app, now signed in

**If you see an error:** Check that your redirect URI exactly matches:
```
https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
```

### Troubleshooting Google OAuth

| Error | Solution |
|-------|----------|
| "redirect_uri_mismatch" | Update Authorized redirect URIs in Google Console |
| "invalid_client" | Check Client ID and Secret are correct in Supabase |
| "access_denied" | User cancelled - this is normal |
| "Provider not enabled" | Toggle "Enable" in Supabase and click Save |

**Full Google OAuth Guide:** https://supabase.com/docs/guides/auth/social-login/auth-google

---

## Option 3: Set Up GitHub OAuth

### Step 1: Enable in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **GitHub** in the list
5. Click to expand GitHub settings
6. Toggle **"Enable Sign in with GitHub"**
7. **Don't click Save yet** - you need Client ID and Secret first

### Step 2: Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/profile)
2. Click **Developer settings** (bottom of left sidebar)
3. Click **OAuth Apps**
4. Click **New OAuth App** (or **Register a new application**)
5. Fill in the form:
   - **Application name:** Bean Boutique
   - **Homepage URL:** `https://your-app-url.com` (your actual app URL)
   - **Application description:** Coffee shop e-commerce platform (optional)
   - **Authorization callback URL:** `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
6. Click **Register application**
7. On the next screen:
   - Copy the **Client ID**
   - Click **Generate a new client secret**
   - Copy the **Client Secret** (you won't see it again!)

### Step 3: Add Credentials to Supabase

1. Back in Supabase Dashboard → Authentication → Providers → GitHub
2. Paste **Client ID** from GitHub
3. Paste **Client Secret** from GitHub
4. Click **Save**

### Step 4: Test GitHub Login

1. Go to your application
2. Click **Sign In**
3. Click **Sign in with GitHub** button
4. Should redirect to GitHub authorization page
5. Click **Authorize [your app name]**
6. Should redirect back to your app, now signed in

**If you see an error:** Check that your callback URL exactly matches:
```
https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
```

### Troubleshooting GitHub OAuth

| Error | Solution |
|-------|----------|
| "redirect_uri_mismatch" | Update callback URL in GitHub OAuth App settings |
| "invalid_client_id" | Check Client ID is correct in Supabase |
| "access_denied" | User declined authorization - this is normal |
| "Provider not enabled" | Toggle "Enable" in Supabase and click Save |

**Full GitHub OAuth Guide:** https://supabase.com/docs/guides/auth/social-login/auth-github

---

## Finding Your Project ID

Your Supabase project ID is in the project URL:

```
https://app.supabase.com/project/YOUR-PROJECT-ID
                                  ^^^^^^^^^^^^^^^^
```

Or in **Settings** → **General** → **Reference ID**

Your callback URL will be:
```
https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
```

---

## After OAuth Setup

Once configured, users can:

1. **Sign up** using Google or GitHub (auto-creates account)
2. **Sign in** using Google or GitHub (links to existing account if email matches)
3. **Link accounts** - users who signed up with email can later link Google/GitHub

**User Profile Setup:**

When a user signs up via OAuth:
- ✅ Auth user is created automatically
- ✅ `public.users` record is created (via trigger)
- ✅ `public.profiles` record is created
- ✅ User's name and email are populated

---

## Security Notes

### Keep Client Secrets Safe

- ❌ Never commit Client Secrets to Git
- ❌ Never share Client Secrets publicly
- ✅ Store in Supabase Dashboard only
- ✅ Regenerate if compromised

### Production vs Development

For production apps:
- Use separate OAuth apps for dev/staging/production
- Different redirect URLs for each environment
- Monitor OAuth app usage in Google/GitHub consoles

### Revoking Access

Users can revoke app access:
- **Google:** https://myaccount.google.com/permissions
- **GitHub:** Settings → Applications → Authorized OAuth Apps

---

## Testing Checklist

After setup:

- [ ] Google OAuth enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Callback URL correct in Google Console
- [ ] Test: Click "Sign in with Google" → Successful redirect
- [ ] Test: Can sign in with Google account
- [ ] Test: User profile created after Google sign in

- [ ] GitHub OAuth enabled in Supabase
- [ ] Client ID and Secret added to Supabase  
- [ ] Callback URL correct in GitHub OAuth App
- [ ] Test: Click "Sign in with GitHub" → Successful redirect
- [ ] Test: Can sign in with GitHub account
- [ ] Test: User profile created after GitHub sign in

---

## Common Questions

### Q: Do I need both Google AND GitHub?

**A:** No! You can set up just one, or neither. Email/password works fine on its own.

### Q: Can users sign up with both email and OAuth?

**A:** Yes! If a user signs up with email `user@example.com` and later tries to sign in with Google using the same email, Supabase will link the accounts automatically.

### Q: What if I don't want to set up OAuth now?

**A:** That's totally fine! Just use email/password authentication. You can add OAuth later without breaking anything.

### Q: Does OAuth work in development/localhost?

**A:** OAuth redirect URLs must match exactly. For localhost development, you may need to:
- Set up separate OAuth apps with localhost URLs
- Or test OAuth only in deployed environments

### Q: Can I customize what data OAuth providers share?

**A:** Yes, via scopes. The default scopes request:
- **Google:** email, profile
- **GitHub:** user:email

You can request additional scopes in `/utils/supabase/client.ts`

---

## Summary

**OAuth is OPTIONAL:**
- ✅ Email/password works without setup
- ✅ All features available without OAuth
- ✅ Add OAuth later if desired

**If you want OAuth:**
1. Create OAuth apps in Google/GitHub developer consoles
2. Add Client ID and Secret to Supabase
3. Test sign in buttons
4. Done!

**Need help?**
- Google guide: https://supabase.com/docs/guides/auth/social-login/auth-google
- GitHub guide: https://supabase.com/docs/guides/auth/social-login/auth-github
- Supabase Discord: https://discord.supabase.com

---

**Remember:** OAuth setup is completely optional. Your app works great with just email/password authentication! 🎉
