import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "./routes";
import Worlds from "./routes/worlds";
import Zones from "./routes/zones";
import Marketplace from "./routes/marketplace";
import Naturversity from "./routes/naturversity";
import Naturbank from "./routes/naturbank";
import Navatar from "./routes/navatar";
import Passport from "./routes/passport";
import Turian from "./routes/turian";
import Profile from "./routes/profile";
import AppShell from "./shell/AppShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "worlds", element: <Worlds /> },
      { path: "zones", element: <Zones /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "naturversity", element: <Naturversity /> },
      { path: "naturbank", element: <Naturbank /> },
      { path: "navatar", element: <Navatar /> },
      { path: "passport", element: <Passport /> },
      { path: "turian", element: <Turian /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
