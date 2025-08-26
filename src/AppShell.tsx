import { ErrorBoundary } from './system/ErrorBoundary'
import SwUpdateToast from './components/SwUpdateToast'
import InstallPrompt from './components/InstallPrompt'
import { useRoutes } from 'react-router-dom'
import { routes } from './router.lazy'
import Analytics from './components/Analytics'
import { useEffect } from 'react'
import { logEvent } from './lib/logger'

export default function AppShell(){
  const content = useRoutes(routes)
  useEffect(()=>{ logEvent('app_loaded') },[])
  return (
    <ErrorBoundary>
      {content}
      <SwUpdateToast/>
      <InstallPrompt/>
      <Analytics/>
    </ErrorBoundary>
  )
}
