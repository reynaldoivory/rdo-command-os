// FILE: src/components/ErrorBoundary.jsx
// Production Error Boundary - Catches render crashes gracefully
import React from 'react';
import { sanitizeErrorMessage } from '../utils/security';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in dev, could send to error tracking service in prod
    if (import.meta.env.DEV) {
      console.error('[RDO OS] Render crash:', error, errorInfo);
    } else {
      // In production, log sanitized version
      console.error('[RDO OS] Render crash:', sanitizeErrorMessage(error, true));
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-[#121212] border border-red-500/30 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">💀</div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">
              Critical System Failure
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              The application encountered an unexpected error. Your saved data is safe.
            </p>
            {import.meta.env.DEV && (
              <div className="bg-black/50 rounded-lg p-4 mb-6 text-left">
                <code className="text-xs text-red-300 font-mono break-all">
                  {sanitizeErrorMessage(this.state.error, false)}
                </code>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#B8962E] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white/10 text-gray-300 font-bold rounded-lg hover:bg-white/20 transition-colors"
              >
                Hard Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
