import React from 'react';

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>Please refresh or go back to the home page.</p>
          <a href="/" className="btn">
            Back to Home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
