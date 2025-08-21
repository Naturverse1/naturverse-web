import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "./routes";
import Worlds from "./routes/worlds";
import World from "./routes/worlds/World";
import Zones from "./routes/zones";
import ArcadeZone from "./routes/zones/arcade";
import MusicZone from "./routes/zones/music";
import WellnessZone from "./routes/zones/wellness";
import CreatorLabZone from "./routes/zones/creator-lab";
import Stories from "./pages/zones/Stories";
import Quizzes from "./pages/zones/Quizzes";
import Observations from "./pages/zones/Observations";
import Community from "./pages/zones/Community";
import Marketplace from "./routes/marketplace";
import Catalog from "./pages/marketplace/Catalog";
import Wishlist from "./pages/marketplace/Wishlist";
import Checkout from "./pages/marketplace/Checkout";
import Naturversity from "./pages/Naturversity";
import Teachers from "./pages/naturversity/Teachers";
import Partners from "./pages/naturversity/Partners";
import Courses from "./pages/naturversity/Courses";
import CourseDetail from "./pages/naturversity/CourseDetail";
import Naturbank from "./routes/naturbank";
import Wallet from "./routes/naturbank/wallet";
import Token from "./routes/naturbank/token";
import NFTs from "./routes/naturbank/nfts";
import Learn from "./routes/naturbank/learn";
import Navatar from "./pages/Navatar";
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
      { path: "worlds/:slug", element: <World /> },
      { path: "zones", element: <Zones /> },
      { path: "zones/arcade", element: <ArcadeZone /> },
      { path: "zones/music", element: <MusicZone /> },
      { path: "zones/wellness", element: <WellnessZone /> },
      { path: "zones/creator-lab", element: <CreatorLabZone /> },
      { path: "zones/stories", element: <Stories /> },
      { path: "zones/quizzes", element: <Quizzes /> },
      { path: "zones/observations", element: <Observations /> },
      { path: "zones/community", element: <Community /> },
      { path: "marketplace", element: <Marketplace /> },
      { path: "marketplace/catalog", element: <Catalog /> },
      { path: "marketplace/wishlist", element: <Wishlist /> },
      { path: "marketplace/checkout", element: <Checkout /> },
      { path: "naturversity", element: <Naturversity /> },
      { path: "naturversity/teachers", element: <Teachers /> },
      { path: "naturversity/partners", element: <Partners /> },
      { path: "naturversity/courses", element: <Courses /> },
      { path: "naturversity/course/:slug", element: <CourseDetail /> },
      { path: "naturbank", element: <Naturbank /> },
      { path: "naturbank/wallet", element: <Wallet /> },
      { path: "naturbank/token", element: <Token /> },
      { path: "naturbank/nfts", element: <NFTs /> },
      { path: "naturbank/learn", element: <Learn /> },
      { path: "navatar", element: <Navatar /> },
      { path: "passport", element: <Passport /> },
      { path: "turian", element: <Turian /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
