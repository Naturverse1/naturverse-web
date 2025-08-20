import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppHome from './AppHome'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <AppHome />, errorElement: <ErrorBoundary /> },
  { path: '/worlds', lazy: () => import('./pages/Worlds') },
  { path: '/zones', lazy: () => import('./pages/zones') },
  { path: '/arcade', lazy: () => import('./pages/arcade') },
  { path: '/marketplace', lazy: () => import('./pages/marketplace') },
  { path: '/stories', lazy: () => import('./pages/Stories') },
  { path: '/quizzes', lazy: () => import('./pages/Quizzes') },
  { path: '/observations', lazy: () => import('./pages/Observations') },
  { path: '/tips', lazy: () => import('./pages/TurianTips') },
  { path: '/profile', lazy: () => import('./pages/Profile') }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
