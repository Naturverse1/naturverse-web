import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; msg?: string }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, msg: err?.message || 'Something went wrong' };
  }
  componentDidCatch(err: any, info: any) {
    console.error('ErrorBoundary:', err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">We hit a snag</h2>
          <p className="text-neutral-600">{this.state.msg}</p>
        </div>
      );
    }
    return this.props.children as any;
  }
}

export default ErrorBoundary;
