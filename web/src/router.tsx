import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppHome from "./AppHome";
import ErrorBoundary from "./ErrorBoundary";

const Worlds = React.lazy(() => import("./pages/Worlds/index"));
const Zones = React.lazy(() => import("./pages/Zones"));
const Arcade = React.lazy(() => import("./pages/Arcade/index"));
const Marketplace = React.lazy(() => import("./pages/Marketplace/index"));
const Stories = React.lazy(() => import("./pages/Stories/index"));
const Quizzes = React.lazy(() => import("./pages/Quizzes/index"));
const Observations = React.lazy(() => import("./pages/Observations/index"));
const Tips = React.lazy(() => import("./pages/TurianTips/index"));
const Profile = React.lazy(() => import("./pages/Profile/index"));
const NotFound = React.lazy(() => import("./pages/errors/NotFound"));

const withSuspense = (el: JSX.Element) => (
  <React.Suspense fallback={<div />}>{el}</React.Suspense>
);

export const router = createBrowserRouter([
  { path: "/", element: <AppHome />, errorElement: <ErrorBoundary /> },
  { path: "/worlds", element: withSuspense(<Worlds />) },
  { path: "/zones", element: withSuspense(<Zones />) },
  { path: "/arcade", element: withSuspense(<Arcade />) },
  { path: "/marketplace/*", element: withSuspense(<Marketplace />) },
  { path: "/stories", element: withSuspense(<Stories />) },
  { path: "/quizzes", element: withSuspense(<Quizzes />) },
  { path: "/observations", element: withSuspense(<Observations />) },
  { path: "/tips", element: withSuspense(<Tips />) },
  { path: "/profile", element: withSuspense(<Profile />) },
  { path: "*", element: withSuspense(<NotFound />) },
]);
