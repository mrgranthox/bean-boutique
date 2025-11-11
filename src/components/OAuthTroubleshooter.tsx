import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  action?: string;
  link?: string;
}

export function OAuthTroubleshooter() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    try {
      // Test 1: Check if we can access Supabase auth
      try {
        await supabase.auth.getSession();
        diagnostics.push({
          test: 'Supabase Auth Connection',
          status: 'pass',
          message: 'Successfully connected to Supabase Auth',
        });
      } catch (error) {
        diagnostics.push({
          test: 'Supabase Auth Connection',
          status: 'fail',
          message: 'Failed to connect to Supabase Auth',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Test 2: Check URL configuration
      const currentUrl = window.location.origin;
      const isLocalhost = currentUrl.includes('localhost');
      const isHttps = currentUrl.startsWith('https://');

      if (isLocalhost) {
        diagnostics.push({
          test: 'URL Configuration',
          status: 'warning',
          message: 'Running on localhost',
          details: 'Make sure localhost is configured in your OAuth providers',
          action: 'Add http://localhost:3000 to authorized domains',
        });
      } else if (isHttps) {
        diagnostics.push({
          test: 'URL Configuration',
          status: 'pass',
          message: 'Using secure HTTPS connection',
        });
      } else {
        diagnostics.push({
          test: 'URL Configuration',
          status: 'fail',
          message: 'Not using HTTPS',
          details: 'OAuth providers require HTTPS for production',
          action: 'Deploy to HTTPS domain or use localhost for testing',
        });
      }

      // Test 3: Test Google OAuth initialization
      try {
        // This won't actually sign in, but will test if the OAuth flow can be initiated
        const testGoogleAuth = async () => {
          // Check if we can initiate OAuth without actually completing it
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: currentUrl,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
              scopes: 'openid email profile',
              skipBrowserRedirect: true, // This prevents actual redirect
            }
          });
          
          return { data, error };
        };

        const googleTest = await testGoogleAuth();
        if (googleTest.error) {
          throw googleTest.error;
        }

        diagnostics.push({
          test: 'Google OAuth Configuration',
          status: 'pass',
          message: 'Google OAuth provider is configured',
          details: 'OAuth flow can be initiated successfully',
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('not enabled')) {
          diagnostics.push({
            test: 'Google OAuth Configuration',
            status: 'fail',
            message: 'Google OAuth not enabled in Supabase',
            details: 'Enable Google provider in Supabase Authentication settings',
            action: 'Go to Supabase Dashboard → Authentication → Providers → Google',
            link: 'https://supabase.com/dashboard',
          });
        } else {
          diagnostics.push({
            test: 'Google OAuth Configuration',
            status: 'fail',
            message: 'Google OAuth configuration error',
            details: errorMessage,
            action: 'Check Google Cloud Console and Supabase configuration',
          });
        }
      }

      // Test 4: Check for common OAuth errors in URL
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        diagnostics.push({
          test: 'OAuth Error Check',
          status: 'fail',
          message: `OAuth Error: ${error}`,
          details: errorDescription || 'Check OAuth provider configuration',
          action: 'Review redirect URIs and client configuration',
        });
      } else {
        diagnostics.push({
          test: 'OAuth Error Check',
          status: 'pass',
          message: 'No OAuth errors detected in URL',
        });
      }

      // Test 5: Check CORS and domain configuration
      const supbaseUrl = 'https://exufontwxqjrnpmyisso.supabase.co';
      diagnostics.push({
        test: 'Domain Configuration',
        status: 'warning',
        message: 'Manual verification required',
        details: `Ensure ${currentUrl} is added to authorized domains in Google Cloud Console`,
        action: 'Add current domain to OAuth provider authorized origins',
        link: 'https://console.cloud.google.com',
      });

    } catch (error) {
      diagnostics.push({
        test: 'General Diagnostics',
        status: 'fail',
        message: 'Diagnostic test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <Badge className={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (!showTroubleshooter) {
    return (
      <Button
        variant="outline"
        onClick={() => setShowTroubleshooter(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        OAuth Diagnostics
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">OAuth Troubleshooter</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTroubleshooter(false)}
          >
            ×
          </Button>
        </div>
        <CardDescription>
          Diagnose OAuth authentication issues
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(result.status)}
                  <span className="text-sm">{result.test}</span>
                  {getStatusBadge(result.status)}
                </div>
                
                <p className="text-sm text-muted-foreground mb-1">
                  {result.message}
                </p>
                
                {result.details && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {result.details}
                  </p>
                )}
                
                {result.action && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-blue-600">Action:</span>
                    <span>{result.action}</span>
                    {result.link && (
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            If you're seeing "accounts.google.com refused to connect", 
            ensure your domain is added to Google Cloud Console authorized origins.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}