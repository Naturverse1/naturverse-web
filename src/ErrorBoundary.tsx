import React from 'react'
export default class ErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  { error?: Error }
> {
  state = { error: undefined as Error | undefined }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ padding: 16 }}>
        <h2>Something went wrong.</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
      </div>
    )
  }
}

