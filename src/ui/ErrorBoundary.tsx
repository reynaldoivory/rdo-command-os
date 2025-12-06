import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 COMPONENT CRASH DETECTED:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-8">
          <div className="text-center bg-[#121212] border-2 border-red-500/50 rounded-lg p-8">
            <h1 className="text-3xl font-serif font-bold text-red-500 mb-4">🚨 System Failure</h1>
            <p className="text-gray-400 mb-6">
              The dashboard crashed. Try reloading or check the console.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#D4AF37] text-black rounded font-bold hover:bg-[#B8941F] transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
