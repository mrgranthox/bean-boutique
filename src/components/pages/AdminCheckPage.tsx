import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { useAuth } from "../../App";
import { AdminAccessDebugger } from "../AdminAccessDebugger";
import { CheckCircle2, XCircle, RefreshCw, ArrowLeft } from "lucide-react";

type Page =
  | "home"
  | "coffee"
  | "equipment"
  | "events"
  | "cart"
  | "offers"
  | "subscription"
  | "checkout"
  | "about"
  | "blog"
  | "faq"
  | "contact"
  | "privacy"
  | "terms"
  | "product-details"
  | "profile"
  | "admin";

interface AdminCheckPageProps {
  onPageChange: (page: Page) => void;
}

export function AdminCheckPage({ onPageChange }: AdminCheckPageProps) {
  const { user } = useAuth();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkAdmin = async () => {
    if (!user) {
      setAdminStatus(false);
      return;
    }

    setChecking(true);
    try {
      const { isUserAdmin } = await import("../../utils/admin-db");
      const result = await isUserAdmin();
      setAdminStatus(result);
    } catch (error) {
      console.error("Failed to check admin status:", error);
      setAdminStatus(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkAdmin();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={() => onPageChange("home")}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Admin Status Check</CardTitle>
              <CardDescription>
                Please sign in to check your admin status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  You must be signed in to check admin access.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          onClick={() => onPageChange("home")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Admin Status Check</CardTitle>
                <CardDescription>
                  Checking admin access for {user.email}
                </CardDescription>
              </div>
              <Button
                onClick={checkAdmin}
                disabled={checking}
                size="sm"
                variant="outline"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${checking ? "animate-spin" : ""}`}
                />
                Recheck
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {adminStatus === null && !checking && (
              <div className="text-center py-8 text-muted-foreground">
                Click "Recheck" to verify admin status
              </div>
            )}

            {checking && (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Checking admin status...
                </p>
              </div>
            )}

            {adminStatus !== null && !checking && (
              <div className="space-y-4">
                <div
                  className={`border-2 rounded-lg p-6 text-center ${
                    adminStatus
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  {adminStatus ? (
                    <div className="space-y-3">
                      <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                      <h3 className="text-2xl font-bold text-green-900">
                        Admin Access Granted
                      </h3>
                      <p className="text-green-700">
                        You have admin privileges for this application
                      </p>
                      <Badge className="bg-green-600">Admin User</Badge>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <XCircle className="w-16 h-16 text-red-600 mx-auto" />
                      <h3 className="text-2xl font-bold text-red-900">
                        No Admin Access
                      </h3>
                      <p className="text-red-700">
                        You do not have admin privileges
                      </p>
                      <Badge variant="destructive">Regular User</Badge>
                    </div>
                  )}
                </div>

                {adminStatus ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => onPageChange("admin")}
                      className="flex-1"
                    >
                      Go to Admin Dashboard
                    </Button>
                    <Button
                      onClick={() => onPageChange("home")}
                      variant="outline"
                      className="flex-1"
                    >
                      Go to Home
                    </Button>
                  </div>
                ) : (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">🔧 To get admin access:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Open your Supabase project dashboard</li>
                          <li>Go to the SQL Editor</li>
                          <li>
                            Run the{" "}
                            <code className="bg-amber-100 px-1 rounded">
                              SET_ADMIN_USER.sql
                            </code>{" "}
                            script
                          </li>
                          <li>
                            Use email:{" "}
                            <code className="bg-amber-100 px-1 rounded">
                              {user.email}
                            </code>
                          </li>
                          <li>Sign out and sign back in</li>
                        </ol>
                        <p className="text-sm mt-3">
                          See{" "}
                          <code className="bg-amber-100 px-1 rounded">
                            ADMIN_ACCESS_FIX.md
                          </code>{" "}
                          for detailed instructions.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <AdminAccessDebugger />
      </div>
    </div>
  );
}
