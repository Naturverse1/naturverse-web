import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HubIndex from "./pages/HubIndex";
import NaturBank from "./pages/naturbank/NaturBank";
import NavatarCreator from "./pages/navatar/NavatarCreator";
import MusicZone from "./pages/zones/Music";
import WellnessZone from "./pages/zones/Wellness";
import CreatorLab from "./pages/zones/CreatorLab";
import Observations from "./pages/zones/Observations";
import Stories from "./pages/zones/Stories";
import Quizzes from "./pages/zones/Quizzes";
import WorldsIndex from "./pages/worlds/WorldsIndex";
import WorldDetail from "./pages/worlds/WorldDetail";

export const router = createBrowserRouter([
  { path: "/", element: <HubIndex /> },
  { path: "/naturbank", element: <NaturBank /> },
  { path: "/navatar", element: <NavatarCreator /> },
  { path: "/zones/music", element: <MusicZone /> },
  { path: "/zones/wellness", element: <WellnessZone /> },
  { path: "/zones/creator-lab", element: <CreatorLab /> },
  { path: "/zones/observations", element: <Observations /> },
  { path: "/zones/stories", element: <Stories /> },
  { path: "/zones/quizzes", element: <Quizzes /> },
  { path: "/worlds", element: <WorldsIndex /> },
  { path: "/worlds/:id", element: <WorldDetail /> },
]);
