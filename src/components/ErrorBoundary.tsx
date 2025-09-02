import React from 'react';
export class ErrorBoundary extends React.Component<{children:React.ReactNode},{hasError:boolean;msg?:string}>{
  constructor(p:any){ super(p); this.state={hasError:false}; }
  static getDerivedStateFromError(err:any){ return {hasError:true, msg: err?.message || 'Something went wrong'} }
  componentDidCatch(err:any, info:any){ console.error('Navatar error:', err, info); }
  render(){ return this.state.hasError
    ? <div className="mx-auto max-w-2xl p-6"><h2 className="text-xl font-semibold mb-2">We hit a snag</h2><p className="text-neutral-600">{this.state.msg}</p></div>
    : (this.props.children as any); }
}
