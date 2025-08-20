import { createBrowserRouter } from "react-router-dom";
import AppHome from "./AppHome";
import Worlds from "./pages/Worlds";
import Zones from "./pages/zones";
import Marketplace from "./pages/marketplace";
import Stories from "./pages/Stories";
import Quizzes from "./pages/Quizzes";
import Observations from "./pages/Observations";
import Profile from "./pages/Profile";
import ErrorBoundary from "./ErrorBoundary";

export const router = createBrowserRouter([
  { path: "/", element: <AppHome />, errorElement: <ErrorBoundary /> },
  { path: "/worlds", element: <Worlds /> },
  { path: "/zones", element: <Zones /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/stories", element: <Stories /> },
  { path: "/quizzes", element: <Quizzes /> },
  { path: "/observations", element: <Observations /> },
  { path: "/profile", element: <Profile /> },
]);

