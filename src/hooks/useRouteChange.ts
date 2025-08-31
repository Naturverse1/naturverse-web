import * as React from "react";

/** Fire a callback when SPA route changes (hash and pushState) */
export default function useRouteChange(handler: () => void) {
  React.useEffect(() => {
    let origPush = history.pushState;
    let origReplace = history.replaceState;
    const emit = () => handler();

    history.pushState = function (this: any, ...args: any[]) {
      const r = origPush.apply(this, args as any);
      emit();
      return r;
    } as any;
    history.replaceState = function (this: any, ...args: any[]) {
      const r = origReplace.apply(this, args as any);
      emit();
      return r;
    } as any;

    window.addEventListener("popstate", emit);
    window.addEventListener("hashchange", emit);

    return () => {
      history.pushState = origPush;
      history.replaceState = origReplace;
      window.removeEventListener("popstate", emit);
      window.removeEventListener("hashchange", emit);
    };
  }, [handler]);
}
