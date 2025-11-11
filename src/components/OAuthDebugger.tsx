import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Bug,
} from "lucide-react";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { toast } from "sonner";
import { errorMonitor } from "events";

interface OAuthConfig {
  provider: string;
  enabled: boolean;
  configured: boolean;
  error?: string;
}

interface URLAnalysis {
  isLocalhost: boolean;
  isHTTPS: boolean;
  hasAuthParams: boolean;
  authError?: string;
  authCode?: string;
  redirectUrl: string;
}

export function OAuthDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthConfigs, setOauthConfigs] = useState<OAuthConfig[]>([]);
  const [urlAnalysis, setUrlAnalysis] = useState<URLAnalysis | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    analyzeCurrentURL();
    checkForAuthErrors();
  }, []);

  const analyzeCurrentURL = () => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    const analysis: URLAnalysis = {
      isLocalhost: currentUrl.includes("localhost"),
      isHTTPS: currentUrl.startsWith("https://"),
      hasAuthParams: urlParams.has("code") || hash.includes("access_token"),
      redirectUrl: window.location.origin,
      authError: urlParams.get("error") || undefined,
      authCode: urlParams.get("code") || undefined,
    };

    setUrlAnalysis(analysis);
  };

  const checkForAuthErrors = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    if (error) {
      toast.error(
        `OAuth Error: ${error}${
          errorDescription ? " - " + errorDescription : ""
        }`
      );
    }
  };

  const testOAuthProvider = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      const testResult = {
        provider,
        timestamp: new Date().toISOString(),
        success: false,
        error: "",
        redirectInitiated: false,
      };

      // Test OAuth initialization without redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true, // This prevents actual redirect for testing
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
        if (error instanceof Error) {
          testResult.error = error.message;
          toast.error(`${provider} OAuth test failed: ${error.message}`);
        } else {
          testResult.success = true;
          testResult.redirectInitiated = !!data?.url;
          toast.success(`${provider} OAuth configuration test passed!`);
        }
      }
      setTestResults((prev) => [testResult, ...prev.slice(0, 4)]);
    } catch (error) {
      toast.error(
        `${provider} OAuth test error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const testActualOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    try {
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
        toast.error(`${provider} OAuth failed: ${error.message}`);
      } else {
        console.log(`${provider} OAuth redirect initiated:`, data);
        // The redirect will happen automatically
      }
    } catch (error) {
      toast.error(
        `${provider} OAuth error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const clearAuthParams = () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    window.history.replaceState({}, document.title, url.toString());
    analyzeCurrentURL();
    toast.success("URL parameters cleared");
  };

  const runFullDiagnostics = async () => {
    setLoading(true);
    try {
      // Test Supabase connection
      const { data: session } = await supabase.auth.getSession();

      // Test OAuth providers
      await testOAuthProvider("google");
      await testOAuthProvider("github");

      toast.success("Full diagnostics completed");
    } catch (error) {
      toast.error("Diagnostics failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 shadow-lg"
      >
        <Bug className="h-4 w-4 mr-2" />
        OAuth Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 w-[600px] max-h-[80vh] overflow-y-auto z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bug className="h-5 w-5" />
              OAuth Debugger
            </CardTitle>
            <CardDescription>
              Debug and test OAuth authentication issues
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">URL Analysis</h4>
              {urlAnalysis && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {urlAnalysis.isHTTPS ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      HTTPS: {urlAnalysis.isHTTPS ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {urlAnalysis.isLocalhost ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm">
                      Environment:{" "}
                      {urlAnalysis.isLocalhost ? "Localhost" : "Production"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Redirect URL:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {urlAnalysis.redirectUrl}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(urlAnalysis.redirectUrl)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Supabase Callback URL:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      https://{projectId}.supabase.co/auth/v1/callback
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `https://${projectId}.supabase.co/auth/v1/callback`
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  {urlAnalysis.authError && (
                    <Alert>
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        OAuth Error detected: {urlAnalysis.authError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {urlAnalysis.hasAuthParams && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAuthParams}
                      >
                        Clear Auth Params
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  onClick={runFullDiagnostics}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Run Full Diagnostics
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => testOAuthProvider("google")}
                  disabled={loading}
                >
                  Test Google Config
                </Button>
                <Button
                  variant="outline"
                  onClick={() => testOAuthProvider("github")}
                  disabled={loading}
                >
                  Test GitHub Config
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => testActualOAuth("google")}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Actual Google Login
                </Button>
                <Button
                  onClick={() => testActualOAuth("github")}
                  disabled={loading}
                  className="bg-gray-800 hover:bg-gray-900"
                >
                  Actual GitHub Login
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Required Configuration</h4>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Google Cloud Console:</h5>
                <div className="text-xs space-y-1">
                  <div>Authorized JavaScript origins:</div>
                  <code className="block bg-muted p-2 rounded">
                    {urlAnalysis?.redirectUrl}
                    <br />
                    https://{projectId}.supabase.co
                  </code>
                  <div>Authorized redirect URIs:</div>
                  <code className="block bg-muted p-2 rounded">
                    https://{projectId}.supabase.co/auth/v1/callback
                  </code>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">GitHub OAuth App:</h5>
                <div className="text-xs space-y-1">
                  <div>Authorization callback URL:</div>
                  <code className="block bg-muted p-2 rounded">
                    https://{projectId}.supabase.co/auth/v1/callback
                  </code>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Supabase Settings:</h5>
                <div className="text-xs space-y-1">
                  <div>Site URL:</div>
                  <code className="block bg-muted p-2 rounded">
                    {urlAnalysis?.redirectUrl}
                  </code>
                  <div>Redirect URLs:</div>
                  <code className="block bg-muted p-2 rounded">
                    {urlAnalysis?.redirectUrl}
                    <br />
                    https://{projectId}.supabase.co
                  </code>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Test Results</h4>
              {testResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No test results yet. Run some tests!
                </p>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="border rounded p-3 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={result.success ? "default" : "destructive"}
                        >
                          {result.provider.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {result.error ? (
                        <p className="text-red-600 text-xs">{result.error}</p>
                      ) : (
                        <p className="text-green-600 text-xs">
                          Configuration test passed
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
