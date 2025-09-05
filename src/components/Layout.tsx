import { ReactNode } from 'react';
import NavBar from './NavBar';
import dynamic from 'next/dynamic';

// Load client component only on client to avoid any SSR hiccups
const TurianAssistant = dynamic(() => import('./TurianAssistant'), { ssr: false });

type Props = { children: ReactNode; title?: ReactNode; breadcrumbs?: ReactNode };

export default function Layout({ title, breadcrumbs, children }: Props) {
  return (
    <>
      <NavBar />
      <main id="main" className="nv-page">
        <div className="nv-container">
          {title ? <h1 className="nv-title">{title}</h1> : null}
          {breadcrumbs ? <div className="nv-breadcrumbs">{breadcrumbs}</div> : null}
          {children}
        </div>
      </main>
      <TurianAssistant />
    </>
  );
}
