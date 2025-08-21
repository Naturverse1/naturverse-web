import { createBrowserRouter } from "react-router-dom";

/**
 * Minimal route components (safe placeholders so the UI renders even
 * if dedicated pages are still under construction).
 * Replace these with your real pages as they land.
 */
const Page = (title: string, body?: string) => () =>
  (
    <main style={{ maxWidth: 860, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{title}</h1>
      {body ? <p style={{ opacity: 0.8 }}>{body}</p> : null}
    </main>
  );

const Home = Page("Welcome 🌿", "Choose a section from the navigation.");
const Worlds = Page("Worlds");
const Zones = Page("Zones");
const Arcade = Page("Arcade");
const Marketplace = Page("Marketplace");
const Stories = Page("Stories");
const Quizzes = Page("Quizzes");
const Observations = Page("Observations");
const Naturversity = Page("Naturversity");
const TurianTips = Page("Turian Tips");
const Profile = Page("Profile & Settings");
const NotFound = Page("Not Found", "That page doesn't exist (yet).");

/**
 * Route table.
 * Export both the routes (named) and the created router (default).
 */
export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  { path: "/worlds", element: <Worlds /> },
  { path: "/zones", element: <Zones /> },
  { path: "/arcade", element: <Arcade /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/stories", element: <Stories /> },
  { path: "/quizzes", element: <Quizzes /> },
  { path: "/observations", element: <Observations /> },
  { path: "/naturversity", element: <Naturversity /> },
  { path: "/turian", element: <TurianTips /> },
  { path: "/profile", element: <Profile /> },
  { path: "*", element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
export default router;
