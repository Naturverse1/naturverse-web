export default function AuthRequiredNote({ action = "use this feature" }: { action?: string }) {
  return (
    <div style={{ background: "#fff7ed", border: "1px solid #fdba74", color: "#7c2d12",
      padding: "10px 12px", borderRadius: 10, marginTop: 8 }}>
      Please sign in to {action}. It’s quick and free.
    </div>
  );
}
