import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const FaucetHelp: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  const faucetUrl = import.meta.env.VITE_FAUCET_URL as string | undefined;
  const docsUrl = import.meta.env.VITE_FAUCET_DOCS as string | undefined;
  const tokenAddr = import.meta.env.VITE_NATUR_TOKEN as string | undefined;

  async function addTokenToMetaMask() {
    try {
      const eth = (window as any).ethereum;
      if (!eth || !tokenAddr) return;
      await eth.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddr,
            symbol: "NATUR",
            decimals: 18,
            image: window.location.origin + "/icon-192.png",
          },
        },
      });
      alert("NATUR token added to MetaMask (if you approved).");
    } catch (e: any) {
      alert(e?.message || "Could not add token.");
    }
  }

  function copy(text?: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard");
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#111",
          border: "1px solid #333",
          borderRadius: 12,
          width: 520,
          maxWidth: "95%",
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Need NATUR or gas?</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <ol style={{ marginTop: 12, lineHeight: 1.5 }}>
          <li>
            Make sure your wallet is on the correct test network (the app will
            prompt you).
          </li>
          <li>Get a little native gas (for fees) and some test NATUR.</li>
        </ol>

        <div style={{ marginTop: 12 }}>
          {faucetUrl ? (
            <div style={{ marginBottom: 8 }}>
              <a href={faucetUrl} target="_blank">
                Open Faucet
              </a>
              <button style={{ marginLeft: 8 }} onClick={() => copy(faucetUrl)}>
                Copy link
              </button>
            </div>
          ) : (
            <div style={{ opacity: 0.8 }}>
              No VITE_FAUCET_URL set. Ask an admin for test tokens.
            </div>
          )}

          {docsUrl && (
            <div style={{ marginBottom: 8 }}>
              <a href={docsUrl} target="_blank">
                Faucet/Network Docs
              </a>
              <button style={{ marginLeft: 8 }} onClick={() => copy(docsUrl)}>
                Copy link
              </button>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button onClick={addTokenToMetaMask} disabled={!tokenAddr}>
              Add NATUR token to MetaMask
            </button>
            {!tokenAddr && (
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                VITE_NATUR_TOKEN not set
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaucetHelp;

