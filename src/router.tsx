import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import Home from './pages/Home';
import Worlds from './pages/Worlds';
import Zones from './pages/zones';
import Marketplace from './pages/marketplace';
import Stories from './pages/Stories';
import Quizzes from './pages/Quizzes';
import Observations from './pages/Observations';
import Profile from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: 'worlds', element: <Worlds /> },
      { path: 'zones', element: <Zones /> },
      { path: 'marketplace', element: <Marketplace /> },
      { path: 'stories', element: <Stories /> },
      { path: 'quizzes', element: <Quizzes /> },
      { path: 'observations', element: <Observations /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
]);
