import { ReactNode } from 'react';
import SiteHeader from './SiteHeader';

type Props = { children: ReactNode; title?: string; breadcrumbs?: ReactNode };

export default function Layout({ title, breadcrumbs, children }: Props) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="nv-page">
        <div className="nv-container">
          {title ? <h1 className="nv-title">{title}</h1> : null}
          {breadcrumbs ? <div className="nv-breadcrumbs">{breadcrumbs}</div> : null}
          {children}
        </div>
      </main>
    </>
  );
}
