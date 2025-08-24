import Link from "next/link";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import Breadcrumbs from "@/components/breadcrumbs";
import ComingSoonBanner from "@/components/coming-soon-banner";

export default function Naturversity() {
  return (
    <main className="container mx-auto px-4 md:px-6">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Naturversity' }]} />
      <h1 className="page-title">Naturversity</h1>
      <p className="mt-2 text-muted-foreground">Teachers, partners, and courses.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Teachers */}
        <Card>
          <CardHeader>
            <CardDescription>Mentors across the 14 kingdoms.</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Link href="/naturversity/teachers" className="btn-primary btn-block">Teachers</Link>
          </div>
        </Card>

        {/* Partners */}
        <Card>
          <CardHeader>
            <CardDescription>Brands & orgs supporting missions.</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Link href="/naturversity/partners" className="btn-primary btn-block">Partners</Link>
          </div>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardDescription>Phrasebooks for each kingdom.</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Link href="/naturversity/languages" className="btn-primary btn-block">Languages</Link>
          </div>
        </Card>

        {/* Courses */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardDescription>Nature, art, music, wellness, crypto basics…</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Link href="/naturversity/courses" className="btn-primary btn-block">Courses</Link>
          </div>
        </Card>
      </div>

      <div className="mt-10">
        <ComingSoonBanner text="Coming soon: AI tutors and step-by-step lessons." />
      </div>
    </main>
  );
}
