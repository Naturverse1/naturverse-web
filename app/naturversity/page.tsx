import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import ComingSoonBanner from "@/components/coming-soon-banner";

export default function Naturversity() {
  return (
    <main className="naturverse-bg min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Naturversity' }]} />
        <h1 className="naturverse-title">Naturversity</h1>
        <p className="naturverse-subtitle">Teachers, partners, and courses.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="naturverse-card">
            <Link href="/naturversity/teachers" className="font-bold text-blue-700">Teachers</Link>
            <p className="text-gray-600">Mentors across the 14 kingdoms.</p>
          </div>

          <div className="naturverse-card">
            <Link href="/naturversity/partners" className="font-bold text-blue-700">Partners</Link>
            <p className="text-gray-600">Brands & orgs supporting missions.</p>
          </div>

          <div className="naturverse-card">
            <Link href="/naturversity/languages" className="font-bold text-blue-700">Languages</Link>
            <p className="text-gray-600">Phrasebooks for each kingdom.</p>
          </div>

          <div className="naturverse-card sm:col-span-2 lg:col-span-1">
            <Link href="/naturversity/courses" className="font-bold text-blue-700">Courses</Link>
            <p className="text-gray-600">Nature, art, music, wellness, crypto basics…</p>
          </div>
        </div>

        <div className="mt-10">
          <ComingSoonBanner text="Coming soon: AI tutors and step-by-step lessons." />
        </div>
      </div>
    </main>
  );
}
