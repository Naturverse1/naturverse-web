import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'health', element: <div>ok</div> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
