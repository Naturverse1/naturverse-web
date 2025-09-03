type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean };

export default function Button({ busy, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`nv-btn ${rest.className ?? ""}`}
      disabled={busy || rest.disabled}
    >
      {busy ? "Working…" : children}
    </button>
  );
}
