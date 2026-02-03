import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Dream OS Error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to analytics/monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Could send to Sentry, LogRocket, etc.
      console.log('Error logged for monitoring');
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-destructive" aria-hidden="true" />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Terjadi Kesalahan Sistem
            </h1>
            <p className="text-muted-foreground mb-6">
              Dream OS mengalami masalah teknis. Tim Architect sedang menangani ini.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left p-4 rounded-xl bg-muted/50 text-sm">
                <summary className="cursor-pointer font-medium text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  Detail Error (Dev Mode)
                </summary>
                <pre className="mt-3 overflow-auto text-xs text-muted-foreground whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                className="bg-primary hover:bg-primary/90"
                aria-label="Coba lagi memuat halaman"
              >
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Coba Lagi
              </Button>
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                aria-label="Kembali ke halaman utama"
              >
                <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                Ke Beranda
              </Button>
            </div>

            {/* Security Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>🌹 Dream OS v13.0</span>
              <span>•</span>
              <span>Duri Bidara Protection Active 🌵</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
