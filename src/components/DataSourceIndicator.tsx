import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { dataManager } from '../utils/data-manager';

export function DataSourceIndicator() {
  const [status, setStatus] = useState(dataManager.getStatus());
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      // Give data manager time to initialize
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus(dataManager.getStatus());
      setIsChecking(false);
    };

    checkStatus();

    // Check status every 30 seconds
    const interval = setInterval(() => {
      setStatus(dataManager.getStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    
    if (status.backend === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status.backend === false) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    if (isChecking) {
      return 'Checking...';
    }
    
    if (status.backend === true) {
      return 'Backend Online';
    } else if (status.backend === false) {
      return status.fallbackEnabled ? 'Local Data' : 'Backend Offline';
    } else {
      return 'Unknown';
    }
  };

  const getStatusColor = () => {
    if (isChecking) {
      return 'default';
    }
    
    if (status.backend === true) {
      return 'default'; // Green
    } else if (status.backend === false) {
      return status.fallbackEnabled ? 'secondary' : 'destructive'; // Yellow or red
    } else {
      return 'outline';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span>{getStatusText()}</span>
            <Badge variant={getStatusColor()} className="text-xs">
              {status.backend === true ? 'Backend' : 'Local'}
            </Badge>
          </div>
          {status.initialized && !isChecking && (
            <div className="text-xs text-muted-foreground mt-1">
              Data: {status.backend === true ? 'Live' : 'Cached'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}