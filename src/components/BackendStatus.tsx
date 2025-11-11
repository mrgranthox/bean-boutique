import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { healthApi, adminApi } from "../utils/api";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export function BackendStatus() {
  const [status, setStatus] = useState<
    "checking" | "online" | "offline" | "error"
  >("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const checkBackendHealth = async () => {
    setStatus("checking");
    try {
      await healthApi.check();
      setStatus("online");
      setLastCheck(new Date());
    } catch (error) {
      console.error("Backend health check failed:", error);
      setStatus("offline");
      setLastCheck(new Date());
    }
  };

  const initializeData = async () => {
    setIsInitializing(true);
    try {
      const result = await adminApi.getProducts();
      if (result.success) {
        console.log("Data initialized successfully");
        await checkBackendHealth(); // Recheck after initialization
      } else {
        console.error("Data initialization failed:", result.error);
      }
    } catch (error) {
      console.error("Data initialization error:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "error":
        return "bg-yellow-500";
      case "checking":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4" />;
      case "offline":
        return <XCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "checking":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Backend Status
          <Badge
            variant="outline"
            className={`${getStatusColor()} text-white border-none`}
          >
            {getStatusIcon()}
            <span className="ml-1 capitalize">{status}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastCheck && (
          <p className="text-sm text-muted-foreground">
            Last checked: {lastCheck.toLocaleTimeString()}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            onClick={checkBackendHealth}
            variant="outline"
            size="sm"
            disabled={status === "checking"}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                status === "checking" ? "animate-spin" : ""
              }`}
            />
            Check Status
          </Button>

          {status === "online" && (
            <Button
              onClick={initializeData}
              variant="outline"
              size="sm"
              disabled={isInitializing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  isInitializing ? "animate-spin" : ""
                }`}
              />
              Initialize Data
            </Button>
          )}
        </div>

        {status === "offline" && (
          <div className="text-sm text-muted-foreground">
            <p>
              The backend service is not available. The app will work with local
              data only.
            </p>
            <p className="mt-1">
              Features like authentication, cart sync, and data persistence will
              be limited.
            </p>
          </div>
        )}

        {status === "online" && (
          <div className="text-sm text-green-600">
            Backend is running properly. All features are available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
