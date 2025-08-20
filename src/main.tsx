import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./ui/App";
import Home from "./pages/Home";
import Worlds from "./pages/Worlds";
import Zones from "./pages/Zones";
import Arcade from "./pages/Arcade";
import Marketplace from "./pages/Marketplace";
import Stories from "./pages/Stories";
import Quizzes from "./pages/Quizzes";
import Observations from "./pages/Observations";
import Naturversity from "./pages/Naturversity";
import Tips from "./pages/Tips";
import Profile from "./pages/Profile";
import "./ui/styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "worlds", element: <Worlds /> },
      { path: "zones", element: <Zones /> },
      { path: "arcade", element: <Arcade /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "stories", element: <Stories /> },
      { path: "quizzes", element: <Quizzes /> },
      { path: "observations", element: <Observations /> },
      { path: "naturversity", element: <Naturversity /> },
      { path: "tips", element: <Tips /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
