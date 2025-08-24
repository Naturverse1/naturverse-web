import React from "react";

type State = { hasError: boolean; msg?: string };

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false };
  static getDerivedStateFromError(e: unknown) {
    return { hasError: true, msg: e instanceof Error ? e.message : String(e) };
  }
  componentDidCatch(err: unknown, info: unknown) {
    // TODO: send to logs if you want
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <section style={{maxWidth: 680, margin: "48px auto"}}>
          <h1>Something went wrong.</h1>
          <p style={{color:"#64748b"}}>{this.state.msg}</p>
          <a href="/" className="btn">Go home</a>
        </section>
      );
    }
    return this.props.children;
  }
}
