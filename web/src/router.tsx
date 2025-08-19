import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Zones from "./routes/Zones";
import Marketplace from "./routes/Marketplace";
import Arcade from "./routes/Arcade";
import Worlds from "./routes/Worlds";
import Zone from "./routes/Zone";
import Stories from "./routes/Stories";
import Story from "./routes/Story";
import Quizzes from "./routes/Quizzes";
import Quiz from "./routes/Quiz";
import Observations from "./routes/Observations";
import Observation from "./routes/Observation";
import Tips from "./routes/Tips";
import Tip from "./routes/Tip";
import Profile from "./routes/Profile";
import NotFound from "./routes/NotFound";

export default createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/zones", element: <Zones /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/arcade", element: <Arcade /> },
  { path: "/worlds", element: <Worlds /> },

  // zone shortcuts
  { path: "/zones/:slug", element: <Zone /> },

  // content
  { path: "/stories", element: <Stories /> },
  { path: "/stories/:id", element: <Story /> },

  { path: "/quizzes", element: <Quizzes /> },
  { path: "/quizzes/:id", element: <Quiz /> },

  { path: "/observations", element: <Observations /> },
  { path: "/observations/:id", element: <Observation /> },

  { path: "/tips", element: <Tips /> },
  { path: "/tips/:id", element: <Tip /> },

  { path: "/profile", element: <Profile /> },
  { path: "*", element: <NotFound /> },
]);
