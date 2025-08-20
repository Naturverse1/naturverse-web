import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./root/Root";
import Home from "./routes/Home";
import Worlds from "./routes/Worlds";
import WorldDetail from "./routes/WorldDetail";
import Zones from "./routes/Zones";
import Arcade from "./routes/Arcade";
import Marketplace from "./routes/Marketplace";
import Stories from "./routes/Stories";
import Quizzes from "./routes/Quizzes";
import Observations from "./routes/Observations";
import Naturversity from "./routes/Naturversity";
import Tips from "./routes/Tips";
import Profile from "./routes/Profile";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },

      { path: "worlds", element: <Worlds /> },
      { path: "worlds/:slug", element: <WorldDetail /> },

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

