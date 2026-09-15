import React from 'react';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl shadow-xl p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              ⚠️
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
              <p className="text-xs text-gray-500 mt-1">
                An unexpected interface error occurred. Our team has been notified.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-red-50 rounded-lg text-left text-xs font-mono text-red-700 overflow-x-auto max-h-32 border border-red-200">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex space-x-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={this.handleReset}
              >
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
