import { Component, ReactNode } from 'react';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { error?: any }> {
  state = { error: undefined as any };
  static getDerivedStateFromError(error: any) { return { error }; }
  componentDidCatch(error: any, info: any) { console.error('App error:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:24}}>
          <h1>Something went wrong</h1>
          <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error?.message ?? this.state.error)}</pre>
          <button onClick={()=>location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
