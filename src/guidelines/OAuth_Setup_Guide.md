# OAuth Setup Guide for Bean Boutique

## 🚨 URGENT: Fixing "accounts.google.com refused to connect" Error

The "accounts.google.com refused to connect" error is typically caused by:
1. **Missing or incorrect domain authorization in Google Cloud Console**
2. **Incorrect redirect URIs**
3. **OAuth provider not properly configured**

## ✅ What's Already Implemented

Your app already has:
- Complete OAuth UI components in `AuthModal.tsx`
- OAuth authentication methods in `utils/supabase/client.ts`
- Proper redirect URL detection in Supabase client configuration
- Error handling and loading states
- **UPDATED**: Enhanced OAuth configuration with proper scopes and parameters

## 🔧 Critical Steps to Fix Google OAuth

### 1. **Google Cloud Console Setup** (CRITICAL)

#### Step 1: Create/Configure Google OAuth App
1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing project
3. **Enable the Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Client ID**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"

#### Step 2: Configure Authorized Domains & Redirect URIs
**CRITICAL**: Add these exact URIs to your Google OAuth app:

**Authorized JavaScript origins:**
```
https://exufontwxqjrnpmyisso.supabase.co
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://exufontwxqjrnpmyisso.supabase.co/auth/v1/callback
http://localhost:3000
```

### 2. **Supabase Dashboard Configuration** (REQUIRED)

#### For Google OAuth:
1. **Go to your Supabase dashboard**: https://supabase.com/dashboard/project/exufontwxqjrnpmyisso
2. **Navigate to**: Authentication → Providers → Google
3. **Enable Google provider**
4. **Add your Google Client ID and Client Secret** from Step 1
5. **Site URL**: Set to your production domain or `http://localhost:3000` for development
6. **Redirect URLs**: Add:
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```

#### For GitHub OAuth:
1. **Go to GitHub Settings** → Developer settings → OAuth Apps
2. **Create a new OAuth App**:
   - Application name: "Bean Boutique"
   - Homepage URL: `https://exufontwxqjrnpmyisso.supabase.co` or your domain
   - Authorization callback URL: 
     ```
     https://exufontwxqjrnpmyisso.supabase.co/auth/v1/callback
     ```

3. **Configure in Supabase**:
   - Go to your Supabase dashboard → Authentication → Providers → GitHub
   - Enable GitHub provider
   - Add your GitHub Client ID and Client Secret

### 3. **Updated OAuth Implementation**

Your OAuth methods now include enhanced configuration:

```typescript
// Google OAuth with enhanced settings
signInWithGoogle: async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'openid email profile'
    }
  });
}

// GitHub OAuth with proper scopes
signInWithGitHub: async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin,
      scopes: 'user:email'
    }
  });
}
```

### 4. **Quick Fix for "accounts.google.com refused to connect"**

This specific error is usually caused by missing domain authorization. Follow these steps:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your OAuth project**
3. **Navigate to**: APIs & Services → Credentials → Your OAuth 2.0 Client ID
4. **Add these to "Authorized JavaScript origins"**:
   ```
   http://localhost:3000
   https://exufontwxqjrnpmyisso.supabase.co
   ```
5. **Add these to "Authorized redirect URIs"**:
   ```
   http://localhost:3000
   https://exufontwxqjrnpmyisso.supabase.co/auth/v1/callback
   ```
6. **Save the changes**
7. **Wait 5-10 minutes** for changes to propagate

### 5. **Test Your Implementation**

Once you've completed the setup:

1. **Test Google Login**:
   - Click the Google button in your AuthModal
   - Should redirect to Google OAuth consent screen
   - After consent, should redirect back to your app with user logged in

2. **Test GitHub Login**:
   - Click the GitHub button in your AuthModal
   - Should redirect to GitHub OAuth authorization screen
   - After authorization, should redirect back to your app with user logged in

3. **Use OAuth Troubleshooter**:
   - In development mode, use the OAuth Troubleshooter button (bottom right)
   - Run diagnostics to identify configuration issues

### 6. **Enhanced Error Handling**

Your app now includes:
- ✅ Detailed error messages for OAuth failures
- ✅ OAuth diagnostic tool for troubleshooting
- ✅ Enhanced OAuth configuration with proper scopes
- ✅ Better redirect URL handling

### 7. **Common Error Solutions**

| Error | Solution |
|-------|----------|
| "accounts.google.com refused to connect" | Add your domain to Google Cloud Console authorized origins |
| "Provider is not enabled" | Enable the provider in Supabase Authentication settings |
| "Invalid redirect URI" | Ensure redirect URLs match exactly in OAuth settings |
| "popup_closed" | User cancelled - this is normal behavior |

### 8. **NEW: Development Tools Added**

Your app now includes comprehensive OAuth debugging tools:

- **🧙 OAuth Setup Wizard** (top right): Step-by-step configuration guide
- **🐛 OAuth Debugger** (bottom left): Advanced debugging and testing
- **🔧 OAuth Troubleshooter** (bottom right): Real-time diagnostics

### 9. **Step-by-Step Resolution**

1. **Use the OAuth Setup Wizard** (appears in dev mode, top right)
2. **Follow each setup step** and mark them complete as you go
3. **Test each provider** using the built-in test buttons
4. **Use the OAuth Debugger** for detailed error analysis
5. **Check the exact URLs** needed for your OAuth apps

## 🎉 Ready to Use

Once you complete the configuration steps above, your OAuth integration will be fully functional! Your users will be able to:

- ✅ Sign in with Google (with comprehensive error handling)
- ✅ Sign in with GitHub (with improved diagnostics)
- ✅ Continue with email/password as before
- ✅ Get specific error messages for different failure scenarios
- ✅ Use multiple debugging tools during development

The AuthModal component now uses enhanced OAuth handlers with better error detection and user feedback.

## 🚨 IMMEDIATE ACTION REQUIRED

**To fix your current issue:**

1. **Click the "OAuth Setup" button** (top right in dev mode)
2. **Use the "Config" tab** to copy exact URLs
3. **Add these URLs to Google Cloud Console** authorized origins and redirect URIs
4. **Test using the "Test" tab** in the setup wizard
5. **Use OAuth Debugger** if issues persist

The tools will guide you through the exact configuration needed!