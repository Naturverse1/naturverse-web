import { createBrowserRouter } from "react-router-dom";
import AppHome from "./AppHome";
import ErrorBoundary from "./ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppHome />,
    errorElement: <div style={{ padding: 24 }}>Route not found.</div>
  }
]);

export default router;
