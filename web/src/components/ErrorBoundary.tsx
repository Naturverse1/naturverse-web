import React from 'react'

export class ErrorBoundary extends React.Component<{children: React.ReactNode},{err?: any}> {
  state = { err: undefined as any }
  static getDerivedStateFromError(err: any) { return { err } }
  render() {
    if (this.state.err) {
      return (
        <div style={{display:'grid',placeItems:'center',minHeight:'100dvh',color:'#fff'}}>
          <div style={{textAlign:'center'}}>
            <h1>Something went wrong</h1>
            <p>Try a hard refresh. If that doesn’t work, clear site data/cache.</p>
            <button onClick={() => { localStorage.clear(); caches?.keys().then(k=>k.forEach(c=>caches.delete(c))).finally(()=>location.reload()) }}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children as any
  }
}
