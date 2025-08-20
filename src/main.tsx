import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./root/Root";
import Home from "./routes/Home";
import Worlds from "./routes/Worlds";
import WorldDetail from "./routes/WorldDetail";

// Zones
import Zones from "./routes/zones/Zones";
import ZoneMusic from "./routes/zones/Music";
import ZoneWellness from "./routes/zones/Wellness";
import ZoneCreator from "./routes/zones/CreatorLab";
import ZoneCommunity from "./routes/zones/Community";
import ZoneTeachers from "./routes/zones/Teachers";
import ZonePartners from "./routes/zones/Partners";
import ZoneNaturversity from "./routes/zones/Naturversity";
import ZoneParents from "./routes/zones/Parents";

// Arcade
import Arcade from "./routes/arcade/Arcade";
import GameSnake from "./routes/arcade/games/Snake";
import GameMemory from "./routes/arcade/games/Memory";
import GameTyping from "./routes/arcade/games/Typing";

// Marketplace
import Marketplace from "./routes/marketplace/Marketplace";
import MarketCatalog from "./routes/marketplace/Catalog";
import MarketProduct from "./routes/marketplace/Product";
import MarketCart from "./routes/marketplace/Cart";
import MarketCheckout from "./routes/marketplace/Checkout";

// Other top-level
import Stories from "./routes/Stories";
import Quizzes from "./routes/Quizzes";
import Observations from "./routes/Observations";
import Naturversity from "./routes/Naturversity";
import Tips from "./routes/Tips";

// Profile
import Profile from "./routes/profile/Profile";
import ProfileSettings from "./routes/profile/Settings";
import ProfileOrders from "./routes/profile/Orders";
import NotFound from "./routes/NotFound";

import "./styles.css";
import { StoreProvider } from "./store/Store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },

      // Worlds
      { path: "worlds", element: <Worlds /> },
      { path: "worlds/:slug", element: <WorldDetail /> },

      // Zones (shortcuts)
      {
        path: "zones",
        element: <Zones />,
        children: [
          { path: "music", element: <ZoneMusic /> },
          { path: "wellness", element: <ZoneWellness /> },
          { path: "creator-lab", element: <ZoneCreator /> },
          { path: "community", element: <ZoneCommunity /> },
          { path: "teachers", element: <ZoneTeachers /> },
          { path: "partners", element: <ZonePartners /> },
          { path: "naturversity", element: <ZoneNaturversity /> },
          { path: "parents", element: <ZoneParents /> },
        ],
      },

      // Arcade
      {
        path: "arcade",
        element: <Arcade />,
        children: [
          { path: "snake", element: <GameSnake /> },
          { path: "memory", element: <GameMemory /> },
          { path: "typing", element: <GameTyping /> },
        ],
      },

      // Marketplace
      {
        path: "marketplace",
        element: <Marketplace />,
        children: [
          { index: true, element: <MarketCatalog /> },
          { path: "product/:id", element: <MarketProduct /> },
          { path: "cart", element: <MarketCart /> },
          { path: "checkout", element: <MarketCheckout /> },
        ],
      },

      // Content
      { path: "stories", element: <Stories /> },
      { path: "quizzes", element: <Quizzes /> },
      { path: "observations", element: <Observations /> },
      { path: "naturversity", element: <Naturversity /> },
      { path: "tips", element: <Tips /> },

      // Profile
      {
        path: "profile",
        element: <Profile />,
        children: [
          { path: "settings", element: <ProfileSettings /> },
          { path: "orders", element: <ProfileOrders /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>
);
