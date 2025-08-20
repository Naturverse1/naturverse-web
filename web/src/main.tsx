import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './layouts/Root';
import Home from './pages/Home';
import SectionList from './pages/SectionList';
import SectionDetail from './pages/SectionDetail';
import Marketplace from './pages/Marketplace';
import Worlds from './pages/Worlds';
import Zones from './pages/Zones';
import ZoneDetail from './pages/ZoneDetail';
import Arcade from './pages/Arcade';
import Tapper from './pages/games/Tapper';
import Memory from './pages/games/Memory';
import Snake from './pages/games/Snake';

import './styles.css';

const router = createBrowserRouter([
  {
    path: '/', element: <Root/>, children: [
      { index: true, element: <Home/> },

      { path: 'stories', element: <SectionList/> },
      { path: 'stories/:slug', element: <SectionDetail/> },

      { path: 'quizzes', element: <SectionList/> },
      { path: 'quizzes/:slug', element: <SectionDetail/> },

      { path: 'observations', element: <SectionList/> },
      { path: 'observations/:slug', element: <SectionDetail/> },

      { path: 'tips', element: <SectionList/> },
      { path: 'tips/:slug', element: <SectionDetail/> },

      { path: 'marketplace', element: <Marketplace/> },

      { path: 'zones', element: <Zones/> },
      { path: 'zones/:slug', element: <ZoneDetail/> },

      { path: 'worlds', element: <Worlds/> },

      { path: 'arcade', element: <Arcade/> },
      { path: 'arcade/tapper', element: <Tapper/> },
      { path: 'arcade/memory', element: <Memory/> },
      { path: 'arcade/snake', element: <Snake/> },

      { path: 'profile', element: <SectionDetail/> }, // placeholder – can swap later
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router}/></React.StrictMode>
);
