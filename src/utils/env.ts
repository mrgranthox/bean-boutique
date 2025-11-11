/**
 * Environment Configuration
 * Centralizes all environment variables for the application
 */

// Helper to safely get environment variables
function getEnvVar(key: string, fallback?: string): string {
  // @ts-ignore - Vite env vars (import.meta.env only available in browser)
  const value = (typeof import.meta !== 'undefined' && import.meta?.env?.[key]) || fallback;
  
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} is not set`);
  }
  
  return value || '';
}

export const env = {
  // Supabase Configuration
  supabase: {
    projectId: getEnvVar('VITE_SUPABASE_PROJECT_ID', 'exufontwxqjrnpmyisso'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dWZvbnR3eHFqcm5wbXlpc3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDE2NjgsImV4cCI6MjA3MzIxNzY2OH0.adA28qo0-ZX1wiqlmxbrmG9FIimL-XPNoAYr5PvKNLM'),
    get url() {
      return getEnvVar('VITE_SUPABASE_URL', `https://${this.projectId}.supabase.co`);
    },
    get apiUrl() {
      return `${this.url}/functions/v1/make-server-4d0792a7`;
    }
  },

  // Application Environment
  isDevelopment: getEnvVar('VITE_ENV', 'development') === 'development',
  isProduction: getEnvVar('VITE_ENV', 'development') === 'production',

  // API Timeouts
  apiTimeout: 8000, // 8 seconds

  // Feature Flags
  features: {
    enableOAuthDebugTools: getEnvVar('VITE_ENV', 'development') === 'development',
    enableDataSourceIndicator: true,
    enableAdvancedCaching: true
  }
};

// Export individual values for backward compatibility
export const projectId = env.supabase.projectId;
export const publicAnonKey = env.supabase.anonKey;
export const supabaseUrl = env.supabase.url;
export const apiBaseUrl = env.supabase.apiUrl;