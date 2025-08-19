import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">The Naturverse</h1>
        <nav className="mt-2 flex gap-4 text-blue-700">
          <a href="/">Home</a>
          <a href="/health">Health</a>
        </nav>
      </header>
      {children}
    </div>
  );
}

function Home() {
  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-2">Welcome 🌿</h2>
      <p className="prose">Naturverse is live and the client router is working.</p>
    </Layout>
  );
}

function Health() {
  const [status, setStatus] = React.useState<string>("checking…");
  React.useEffect(() => {
    fetch("/.netlify/functions/health")
      .then(r => r.json())
      .then(d => setStatus(d.ok ? "ok ✅" : "not ok"))
      .catch(() => setStatus("not ok"));
  }, []);
  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-2">Health</h2>
      <p className="prose">API status: {status}</p>
    </Layout>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/health", element: <Health /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
