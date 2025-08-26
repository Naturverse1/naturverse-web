export default function SkipLink() {
  return (
    <a href="#main" style={{
      position: "absolute", left: -9999, top: -9999, background: "#e8f1ff", color: "#0b2545",
      padding: "8px 12px", borderRadius: 8
    }}
    onFocus={(e) => { e.currentTarget.style.left="12px"; e.currentTarget.style.top="12px"; }}
    onBlur={(e) => { e.currentTarget.style.left="-9999px"; e.currentTarget.style.top="-9999px"; }}>
      Skip to content
    </a>
  );
}
