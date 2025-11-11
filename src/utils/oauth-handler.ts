import { supabase } from "./supabase/client";
import { toast } from "sonner";

export interface OAuthCallbackResult {
  success: boolean;
  user?: any;
  error?: string;
  provider?: string;
}

/**
 * Handles OAuth callback processing
 * Call this on app initialization to process OAuth redirects
 */
export async function handleOAuthCallback(): Promise<OAuthCallbackResult> {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));

  // Check for OAuth error in URL params
  const error = urlParams.get("error");
  const errorDescription = urlParams.get("error_description");

  if (error) {
    console.error("OAuth error from URL:", error, errorDescription);
    return {
      success: false,
      error: `OAuth failed: ${error}${
        errorDescription ? " - " + errorDescription : ""
      }`,
    };
  }

  // Check if we have OAuth parameters (code from authorization flow)
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  if (code) {
    console.log(
      "Processing OAuth callback with code:",
      code.substring(0, 10) + "..."
    );

    try {
      // Let Supabase handle the OAuth callback
      const { data, error: authError } = await supabase.auth.getSession();

      if (authError) {
        console.error("OAuth session error:", authError);
        return {
          success: false,
          error: `OAuth session failed: ${authError.message}`,
        };
      }

      if (data.session && data.session.user) {
        console.log("OAuth success! User:", data.session.user.email);

        // Determine provider from user metadata
        const provider = data.session.user.app_metadata?.provider || "unknown";

        // Clean up URL params
        cleanupOAuthURL();

        return {
          success: true,
          user: data.session.user,
          provider,
        };
      } else {
        console.warn("OAuth code present but no session found");
        return {
          success: false,
          error: "OAuth callback processed but no session created",
        };
      }
    } catch (error) {
      console.error("OAuth callback processing error:", error);
      return {
        success: false,
        error: `OAuth processing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // Check for direct token in hash (implicit flow - not used by default but good to handle)
  const accessToken = hashParams.get("access_token");
  if (accessToken) {
    console.log("Found access token in URL hash, processing...");
    try {
      const { data, error: userError } = await supabase.auth.getUser(
        accessToken
      );

      if (userError) {
        return {
          success: false,
          error: `Token validation failed: ${userError.message}`,
        };
      }

      cleanupOAuthURL();

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: `Token processing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // No OAuth parameters found
  return {
    success: false,
    error: "No OAuth parameters found",
  };
}

/**
 * Cleans up OAuth parameters from the URL
 */
function cleanupOAuthURL() {
  const url = new URL(window.location.href);

  // Remove OAuth-related parameters
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");

  // Remove hash if it contains OAuth tokens
  if (url.hash.includes("access_token") || url.hash.includes("error")) {
    url.hash = "";
  }

  // Update URL without triggering a page reload
  window.history.replaceState({}, document.title, url.toString());
}

/**
 * Tests OAuth provider configuration
 */
export async function testOAuthProvider(
  provider: "google" | "github"
): Promise<{
  success: boolean;
  error?: string;
  configured: boolean;
}> {
  try {
    console.log(`Testing ${provider} OAuth configuration...`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
        skipBrowserRedirect: true, // Don't redirect, just test config
        ...(provider === "google"
          ? {
              queryParams: {
                access_type: "offline",
                prompt: "consent",
              },
              scopes: "openid email profile",
            }
          : {
              scopes: "user:email",
            }),
      },
    });

    if (error) {
      console.error(`${provider} OAuth test error:`, error);

      if (error.message.includes("not enabled")) {
        return {
          success: false,
          configured: false,
          error: `${provider} OAuth provider is not enabled in Supabase`,
        };
      }

      return {
        success: false,
        configured: true,
        error: error.message,
      };
    }

    console.log(`${provider} OAuth configuration test passed`);
    return {
      success: true,
      configured: true,
    };
  } catch (error) {
    console.error(`${provider} OAuth test exception:`, error);
    return {
      success: false,
      configured: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Initiates OAuth login with better error handling
 */
export async function initiateOAuthLogin(
  provider: "google" | "github"
): Promise<{
  success: boolean;
  error?: string;
  redirected?: boolean;
}> {
  try {
    console.log(`Initiating ${provider} OAuth login...`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
        ...(provider === "google"
          ? {
              queryParams: {
                access_type: "offline",
                prompt: "consent",
              },
              scopes: "openid email profile",
            }
          : {
              scopes: "user:email",
            }),
      },
    });

    if (error) {
      console.error(`${provider} OAuth initiation error:`, error);

      let userFriendlyError = `${provider} sign-in failed. Please try again.`;

      if (error.message.includes("not enabled")) {
        userFriendlyError = `${provider} sign-in is not available. Please contact support.`;
      } else if (error.message.includes("refused to connect")) {
        userFriendlyError = `${provider} connection was refused. This may be due to configuration issues.`;
      } else if (error.message.includes("popup_closed")) {
        userFriendlyError = "Sign-in was cancelled.";
      }

      return {
        success: false,
        error: userFriendlyError,
      };
    }

    console.log(`${provider} OAuth redirect initiated successfully`);
    return {
      success: true,
      redirected: true,
    };
  } catch (error) {
    console.error(`${provider} OAuth initiation exception:`, error);
    return {
      success: false,
      error: `Failed to start ${provider} sign-in. Please check your connection and try again.`,
    };
  }
}
