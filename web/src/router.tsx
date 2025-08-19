import { createBrowserRouter } from 'react-router-dom';

const Home = () => <div style={{padding:24}}><h1>Naturverse</h1><p>Home is up ✅</p></div>;
const NotFound = () => <div style={{padding:24}}><h1>Not found</h1></div>;

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '*', element: <NotFound /> },
]);

export default router;
