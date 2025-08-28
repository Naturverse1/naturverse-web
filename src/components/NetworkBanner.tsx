import * as React from "react";
import useOnline from "../hooks/useOnline";
import "./network.css";

export default function NetworkBanner() {
  const online = useOnline();
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    // Show again whenever we go offline
    if (!online) setHidden(false);
  }, [online]);

  if (online || hidden) return null;

  return (
    <div className="nv-net">
      <span>You’re offline. Some actions may not work.</span>
      <div className="nv-net__actions">
        <button onClick={() => location.reload()}>Retry</button>
        <button className="ghost" onClick={() => setHidden(true)}>Dismiss</button>
      </div>
    </div>
  );
}
