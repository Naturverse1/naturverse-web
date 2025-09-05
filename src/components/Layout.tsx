import { ReactNode } from 'react';
import NavBar from './NavBar';
import TurianAssistant from './TurianAssistant';

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
