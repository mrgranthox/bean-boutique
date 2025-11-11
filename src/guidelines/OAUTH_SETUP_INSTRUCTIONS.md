# OAuth Setup Instructions for Bean Boutique

This document provides step-by-step instructions for setting up Google and GitHub OAuth authentication in your Bean Boutique application.

## Prerequisites

Before setting up OAuth, ensure you have:
1. A Supabase project (you already have one: `exufontwxqjrnpmyisso`)
2. Access to Supabase Dashboard
3. Admin access to configure authentication providers

## Current OAuth Implementation

The application already has OAuth integration code in `/utils/supabase/client.ts`:
- `auth.signInWithGoogle()` - Google OAuth
- `auth.signInWithGitHub()` - GitHub OAuth

## Setup Instructions

### 1. Google OAuth Setup

#### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add the following Authorized JavaScript origins:
   ```
   http://localhost:3000
   https://exufontwxqjrnpmyisso.supabase.co
   https://your-custom-domain.com (if applicable)
   ```
8. Add the following Authorized redirect URIs:
   ```
   https://exufontwxqjrnpmyisso.supabase.co/auth/v1/callback
   ```
9. Click **Create** and save your **Client ID** and **Client Secret**

#### Step 2: Configure Google OAuth in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `exufontwxqjrnpmyisso`
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and toggle it ON
5. Enter your Google OAuth credentials:
   - **Client ID**: (from Step 1)
   - **Client Secret**: (from Step 1)
6. Click **Save**

#### Step 3: Test Google OAuth

1. Visit your application
2. Click on "Sign In with Google" button
3. You should be redirected to Google's sign-in page
4. After signing in, you should be redirected back to your app

### 2. GitHub OAuth Setup

#### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the application details:
   - **Application name**: Bean Boutique
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://exufontwxqjrnpmyisso.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Generate a new client secret and save both **Client ID** and **Client Secret**

#### Step 2: Configure GitHub OAuth in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `exufontwxqjrnpmyisso`
3. Navigate to **Authentication** > **Providers**
4. Find **GitHub** in the list and toggle it ON
5. Enter your GitHub OAuth credentials:
   - **Client ID**: (from Step 1)
   - **Client Secret**: (from Step 1)
6. Click **Save**

#### Step 3: Test GitHub OAuth

1. Visit your application
2. Click on "Sign In with GitHub" button
3. You should be redirected to GitHub's authorization page
4. After authorizing, you should be redirected back to your app

## Current OAuth Status

### ✅ What's Already Implemented:
- OAuth client code in `/utils/supabase/client.ts`
- OAuth callback handling in `/utils/oauth-handler.ts`
- Session management and user profile creation
- Redirect handling after successful OAuth
- Error handling for OAuth failures

### ⚠️ What Needs Configuration:
1. **Google OAuth**: You need to configure Google OAuth credentials in Supabase Dashboard
2. **GitHub OAuth**: You need to configure GitHub OAuth credentials in Supabase Dashboard
3. **Redirect URLs**: Ensure all redirect URLs are whitelisted in both OAuth providers and Supabase

## Troubleshooting

### OAuth Debug Tools

The application includes OAuth debug tools (visible in development mode):
- **OAuthSetupWizard**: Step-by-step setup guide
- **OAuthDebugger**: Real-time OAuth flow debugging
- **OAuthTroubleshooter**: Common issues and solutions

These tools are automatically available when `VITE_ENV=development` in your `.env` file.

### Common Issues

#### 1. "Provider is not enabled" Error
**Solution**: Make sure the OAuth provider (Google/GitHub) is enabled in Supabase Dashboard under Authentication > Providers.

#### 2. "Redirect URI mismatch" Error
**Solution**: Ensure the redirect URI in your OAuth provider settings matches exactly:
```
https://exufontwxqjrnpmyisso.supabase.co/auth/v1/callback
```

#### 3. OAuth Returns to Homepage Instead of Continuing Flow
**Solution**: Check that `detectSessionInUrl: true` is set in Supabase client configuration (already done in our code).

#### 4. User Profile Not Created After OAuth
**Solution**: The app automatically creates profiles for OAuth users. Check the `users` table in Supabase to verify.

## Security Best Practices

1. **Never commit OAuth secrets**: Keep your Client IDs and Client Secrets secure
2. **Use HTTPS in production**: OAuth requires HTTPS for security
3. **Restrict redirect URIs**: Only whitelist necessary redirect URIs
4. **Regularly rotate secrets**: Update OAuth secrets periodically
5. **Monitor OAuth usage**: Check Supabase logs for suspicious activity

## Additional Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Use the built-in OAuth debug tools
3. Verify your OAuth credentials in Supabase Dashboard
4. Ensure all redirect URLs are correctly configured

## Next Steps

After completing OAuth setup:
1. ✅ Test both Google and GitHub OAuth flows
2. ✅ Verify user profiles are created in the `users` table
3. ✅ Test the complete user journey from sign-in to using the app
4. ✅ Disable OAuth debug tools in production (`VITE_ENV=production`)