import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "./screens/Home";
import Worlds from "./screens/worlds/Worlds";
import World from "./screens/worlds/World";
import Zones from "./screens/zones/Zones";
import Zone from "./screens/zones/Zone";
import Marketplace from "./screens/Marketplace";
import Naturversity from "./screens/Naturversity";
import Naturbank from "./screens/naturbank/Naturbank";
import NaturbankSection from "./screens/naturbank/NaturbankSection";
import Navatar from "./screens/Navatar";
import Passport from "./screens/Passport";
import Turian from "./screens/Turian";
import Profile from "./screens/Profile";
import AppShell from "./shell/AppShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "worlds", element: <Worlds /> },
      { path: "worlds/:slug", element: <World /> },
      { path: "zones", element: <Zones /> },
      { path: "zones/:slug", element: <Zone /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "naturversity", element: <Naturversity /> },
      { path: "naturbank", element: <Naturbank /> },
      { path: "naturbank/:section", element: <NaturbankSection /> },
      { path: "navatar", element: <Navatar /> },
      { path: "passport", element: <Passport /> },
      { path: "turian", element: <Turian /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
