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
import { Progress } from "./ui/progress";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Settings,
  Zap,
} from "lucide-react";
import { testOAuthProvider } from "../utils/oauth-handler";
import { projectId } from "../utils/supabase/info";
import { toast } from "sonner";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "failed";
  provider?: "google" | "github";
  action?: () => void;
}

export function OAuthSetupWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([]);
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    initializeSteps();
  }, []);

  const initializeSteps = () => {
    const steps: SetupStep[] = [
      {
        id: "google-cloud",
        title: "Google Cloud Console Setup",
        description: "Create and configure Google OAuth credentials",
        status: "pending",
      },
      {
        id: "github-app",
        title: "GitHub OAuth App Setup",
        description: "Create GitHub OAuth application",
        status: "pending",
      },
      {
        id: "supabase-google",
        title: "Enable Google in Supabase",
        description: "Configure Google provider in Supabase dashboard",
        status: "pending",
        provider: "google",
      },
      {
        id: "supabase-github",
        title: "Enable GitHub in Supabase",
        description: "Configure GitHub provider in Supabase dashboard",
        status: "pending",
        provider: "github",
      },
      {
        id: "test-google",
        title: "Test Google OAuth",
        description: "Verify Google OAuth configuration",
        status: "pending",
        provider: "google",
        action: () => testProvider("google"),
      },
      {
        id: "test-github",
        title: "Test GitHub OAuth",
        description: "Verify GitHub OAuth configuration",
        status: "pending",
        provider: "github",
        action: () => testProvider("github"),
      },
    ];

    setSetupSteps(steps);
  };

  const testProvider = async (provider: "google" | "github") => {
    setTesting(true);
    try {
      const result = await testOAuthProvider(provider);

      const updatedSteps = setupSteps.map((step) => {
        if (step.provider === provider && step.id.startsWith("test-")) {
          return {
            ...step,
            status: result.success ? "completed" : "failed",
          } as SetupStep;
        }
        return step;
      });

      setSetupSteps(updatedSteps);

      if (result.success) {
        toast.success(`${provider} OAuth configuration verified!`);
      } else {
        toast.error(`${provider} OAuth test failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Failed to test ${provider} OAuth`);
    } finally {
      setTesting(false);
    }
  };

  const testAllProviders = async () => {
    setTesting(true);
    try {
      await testProvider("google");
      await testProvider("github");
      calculateProgress();
    } finally {
      setTesting(false);
    }
  };

  const calculateProgress = () => {
    const completedSteps = setupSteps.filter(
      (step) => step.status === "completed"
    ).length;
    const totalSteps = setupSteps.length;
    setProgress((completedSteps / totalSteps) * 100);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const markStepCompleted = (stepId: string) => {
    const updatedSteps = setupSteps.map((step) =>
      step.id === stepId ? { ...step, status: "completed" as const } : step
    );
    setSetupSteps(updatedSteps);
    calculateProgress();
  };

  const getStepIcon = (status: SetupStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-50 shadow-lg"
      >
        <Settings className="h-4 w-4 mr-2" />
        OAuth Setup
      </Button>
    );
  }

  return (
    <Card className="fixed top-20 right-4 w-[500px] max-h-[80vh] overflow-y-auto z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              OAuth Setup Wizard
            </CardTitle>
            <CardDescription>
              Complete OAuth configuration step by step
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <div className="space-y-3">
              {setupSteps.map((step, index) => (
                <div key={step.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {step.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={step.action}
                        disabled={testing}
                      >
                        {testing ? "Testing..." : "Test"}
                      </Button>
                    )}
                    {!step.action && step.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markStepCompleted(step.id)}
                      >
                        Mark Done
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button
                onClick={testAllProviders}
                disabled={testing}
                className="w-full mt-4"
              >
                <Zap className="h-4 w-4 mr-2" />
                {testing
                  ? "Testing All Providers..."
                  : "Test All OAuth Providers"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Use these exact URLs in your OAuth provider configurations
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Google Cloud Console
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium">
                        Authorized JavaScript origins:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-muted px-2 py-1 rounded flex-1">
                          {window.location.origin}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(window.location.origin)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-muted px-2 py-1 rounded flex-1">
                          https://{projectId}.supabase.co
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(`https://${projectId}.supabase.co`)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">
                        Authorized redirect URIs:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-muted px-2 py-1 rounded flex-1">
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
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">GitHub OAuth App</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium">
                        Authorization callback URL:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-muted px-2 py-1 rounded flex-1">
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
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">
                    Supabase Configuration
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium">Site URL:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-muted px-2 py-1 rounded flex-1">
                          {window.location.origin}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(window.location.origin)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open("https://console.cloud.google.com", "_blank")
                  }
                  className="flex-1"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Google Console
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://github.com/settings/developers",
                      "_blank"
                    )
                  }
                  className="flex-1"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  GitHub Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://supabase.com/dashboard/project/${projectId}/auth/providers`,
                      "_blank"
                    )
                  }
                  className="flex-1"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Supabase Auth
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">OAuth Provider Tests</h4>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => testProvider("google")}
                  disabled={testing}
                >
                  Test Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => testProvider("github")}
                  disabled={testing}
                >
                  Test GitHub
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  These tests check if OAuth providers are properly configured
                  in Supabase. They don't test the external provider setup
                  (Google Cloud Console, GitHub).
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Test Results:</h5>
                {setupSteps
                  .filter((step) => step.id.startsWith("test-"))
                  .map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      {getStepIcon(step.status)}
                      <span>{step.title}</span>
                      <Badge
                        variant={
                          step.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {step.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
