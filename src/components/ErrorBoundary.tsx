import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 Unhandled React rendering error caught by boundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#deb887]/30 p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Coffee cup broken or error illustration */}
            <div className="w-20 h-20 bg-[#faf8f5] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#deb887]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#8b4513"
                className="w-10 h-10 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-[#3c2414] mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              An unexpected error occurred while rendering this view. Our team has been notified. Let's get you back to your coffee!
            </p>

            {this.state.error && (
              <div className="bg-red-50 text-red-800 text-xs font-mono p-3 rounded-lg text-left overflow-auto max-h-32 mb-6 border border-red-100">
                {this.state.error.name}: {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-[#8b4513] text-white rounded-xl text-sm font-semibold hover:bg-[#3c2414] transition-all duration-200 shadow-md shadow-[#8b4513]/10"
              >
                Go to Homepage
              </button>
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-white border border-[#deb887]/40 text-[#8b4513] rounded-xl text-sm font-semibold hover:bg-[#faf8f5] transition-all duration-200"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
