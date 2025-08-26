import { ErrorBoundary } from './system/ErrorBoundary'
import SwUpdateToast from './components/SwUpdateToast'
import InstallPrompt from './components/InstallPrompt'
import { useRoutes } from 'react-router-dom'
import { routes } from './router.lazy'

export default function AppShell(){
  const content = useRoutes(routes)
  return (
    <ErrorBoundary>
      {content}
      <SwUpdateToast/>
      <InstallPrompt/>
    </ErrorBoundary>
  )
}
