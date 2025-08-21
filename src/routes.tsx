import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";

const Page = (title: string, body?: string) => () =>
  (
    <section>
      <h2 style={{ fontSize: "1.75rem", margin: "0 0 .5rem" }}>{title}</h2>
      {body ? <p style={{ opacity: 0.8 }}>{body}</p> : null}
    </section>
  );

const Home = Page("Explore", "Choose a section from the navigation above.");
const Worlds = Page("Worlds");
const Zones = Page("Zones");
const Arcade = Page("Arcade", "Mini-games arriving soon.");
const Marketplace = Page("Marketplace");
const Stories = Page("Stories");
const Quizzes = Page("Quizzes");
const Observations = Page("Observations");
const Naturversity = Page("Naturversity");
const TurianTips = Page("Turian Tips");
const Profile = Page("Profile & Settings");
const NotFound = Page("Not Found", "That page doesn't exist (yet).");

export const routes = [
  {
    path: "/",
    element: <Layout />,
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
      { path: "turian", element: <TurianTips /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

const router = createBrowserRouter(routes);
export default router;

