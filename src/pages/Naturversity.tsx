import Page from "../components/Page";

export default function Naturversity() {
  return (
    <Page title="Naturversity" subtitle="Teachers, partners, and courses.">
      <ul className="grid gap-4 md:gap-6 sm:grid-cols-2">
        <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold">Teachers</h3>
          <p className="mt-1 text-slate-600">Mentors across the 14 kingdoms.</p>
        </li>
        <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold">Partners</h3>
          <p className="mt-1 text-slate-600">Brands & orgs supporting missions.</p>
        </li>
        <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
          <h3 className="font-semibold">Courses</h3>
          <p className="mt-1 text-slate-600">Nature, art, music, wellness, crypto basics.</p>
          <p className="mt-3 text-sm text-slate-500">Coming soon: AI tutors and step-by-step lessons.</p>
        </li>
      </ul>
    </Page>
  );
}

