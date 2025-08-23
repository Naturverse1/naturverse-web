import React, { useEffect, useState } from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  exact?: boolean;
  activeClassName?: string;
};

export default function ActiveLink({
  href,
  exact = false,
  activeClassName = "active",
  className = "",
  ...rest
}: Props) {
  const [path, setPath] = useState<string>(typeof window !== "undefined" ? window.location.pathname : "/");
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    window.addEventListener("pushstate", onPop as any);
    window.addEventListener("replacestate", onPop as any);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pushstate", onPop as any);
      window.removeEventListener("replacestate", onPop as any);
    };
  }, []);
  const isActive = exact ? path === href : path.startsWith(href);
  const cls = isActive ? `${className} ${activeClassName}`.trim() : className;
  return <a href={href} className={cls} {...rest} />;
}
