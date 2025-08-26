import { Component, ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean; err?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(err: Error) { return { hasError: true, err } }
  componentDidCatch(error: Error, info: any) {
    console.error('[AppErrorBoundary]', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:16}}>
          <h1>Something went wrong.</h1>
          <p>Please refresh the page. If it persists, take a screenshot and send to support.</p>
          <pre style={{whiteSpace:'pre-wrap'}}>{this.state.err?.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
