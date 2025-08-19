import { Route, Routes } from "react-router-dom";

function Home() {
  return <div style={{ padding: 24 }}>Naturverse is live ✅</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
