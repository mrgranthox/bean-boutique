import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from "../App";
import { supabase } from "../utils/supabase/client";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

export function AdminAccessDebugger() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const info: any = {
      timestamp: new Date().toISOString(),
      checks: [],
    };

    try {
      // Check 1: User session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      info.checks.push({
        name: "User Session",
        status: sessionData?.session?.user ? "success" : "error",
        details: {
          userId: sessionData?.session?.user?.id,
          email: sessionData?.session?.user?.email,
          error: sessionError?.message,
        },
      });

      if (sessionData?.session?.user?.id) {
        // Check 2: Users table record
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email, role, created_at")
          .eq("id", sessionData.session.user.id)
          .maybeSingle();

        info.checks.push({
          name: "Users Table Record",
          status: userData ? "success" : "error",
          details: {
            found: !!userData,
            role: userData?.role,
            email: userData?.email,
            error: userError?.message,
            errorCode: userError?.code,
          },
        });

        // Check 3: Admin status
        const isAdmin = userData?.role === "admin";
        info.checks.push({
          name: "Admin Status",
          status: isAdmin ? "success" : "warning",
          details: {
            isAdmin,
            currentRole: userData?.role,
            expectedRole: "admin",
          },
        });

        // Check 4: RLS Policies
        try {
          const { data: testQuery, error: rlsError } = await supabase
            .from("users")
            .select("role")
            .eq("id", sessionData.session.user.id)
            .single();

          info.checks.push({
            name: "RLS Policies",
            status: !rlsError ? "success" : "error",
            details: {
              canQueryOwnRecord: !rlsError,
              error: rlsError?.message,
            },
          });
        } catch (e: any) {
          info.checks.push({
            name: "RLS Policies",
            status: "error",
            details: {
              error: e.message,
            },
          });
        }

        // Check 5: Profile record
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", sessionData.session.user.id)
          .maybeSingle();

        info.checks.push({
          name: "Profile Record",
          status: profileData ? "success" : "warning",
          details: {
            found: !!profileData,
            error: profileError?.message,
          },
        });
      }
    } catch (error: any) {
      info.checks.push({
        name: "Diagnostics Error",
        status: "error",
        details: {
          error: error.message,
        },
      });
    }

    setDebugInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      runDiagnostics();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Please sign in to run admin access diagnostics.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Admin Access Diagnostics</CardTitle>
            <CardDescription>
              Debug admin access issues for {user.email}
            </CardDescription>
          </div>
          <Button
            onClick={runDiagnostics}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {debugInfo ? (
          <>
            <div className="text-sm text-muted-foreground">
              Last checked: {new Date(debugInfo.timestamp).toLocaleString()}
            </div>

            <div className="space-y-3">
              {debugInfo.checks.map((check: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(check.status)}
                      <span className="font-medium">{check.name}</span>
                    </div>
                    <Badge
                      variant={
                        check.status === "success"
                          ? "default"
                          : check.status === "warning"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {check.status}
                    </Badge>
                  </div>

                  <div className="text-sm bg-muted p-3 rounded font-mono text-xs overflow-auto max-h-40">
                    <pre>{JSON.stringify(check.details, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Solution suggestions */}
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">🔧 Troubleshooting Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Verify the user exists in both auth.users and public.users
                      tables
                    </li>
                    <li>Run SET_ADMIN_USER.sql in your Supabase SQL Editor</li>
                    <li>
                      Ensure the role column is set to 'admin' (not 'Admin' or
                      'ADMIN')
                    </li>
                    <li>
                      Check that RLS policies allow users to read their own role
                    </li>
                    <li>Clear browser cache and sign out/in again</li>
                    <li>Check browser console for detailed error messages</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Running diagnostics...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
