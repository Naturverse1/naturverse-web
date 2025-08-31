import { lazy, Suspense } from 'react'
import Skeleton from './components/Skeleton'

const Home        = lazy(()=>import('./pages/Home'))
const Stories     = lazy(()=>import('./pages/zones/Stories'))
const Quizzes     = lazy(()=>import('./pages/zones/Quizzes'))
const CreatorLab  = lazy(()=>import('./pages/zones/creator-lab'))
const Community   = lazy(()=>import('./pages/zones/Community'))
const Observations= lazy(()=>import('./pages/zones/Observations'))
const AuthCallback= lazy(()=>import('./pages/AuthCallback'))

export const withSuspense = (el: JSX.Element) => (
  <Suspense fallback={<div><Skeleton h={24}/><br/><Skeleton h={180}/></div>}>
    {el}
  </Suspense>
)

export const routes = [
  { path: '/',            element: withSuspense(<Home/>) },
  { path: '/stories',     element: withSuspense(<Stories/>) },
  { path: '/quizzes',     element: withSuspense(<Quizzes/>) },
  { path: '/creator-lab', element: withSuspense(<CreatorLab/>) },
  { path: '/community',   element: withSuspense(<Community/>) },
  { path: '/observations',element: withSuspense(<Observations/>) },
  { path: '/auth/callback', element: withSuspense(<AuthCallback/>) },
]
