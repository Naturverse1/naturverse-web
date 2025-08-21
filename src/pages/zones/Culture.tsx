import Page from "../../components/Page";
import { CULTURE_SECTIONS } from "../../data/culture-sections";

const kingdoms = CULTURE_SECTIONS.map(k => ({
  emoji: k.emoji,
  name: k.kingdom,
  tagline: k.caption,
  beliefs: k.beliefs,
  holidays: k.holidays.map(h => `${h.name} — ${h.when}. ${h.note}`),
  ceremonies: k.ceremonies || [],
}));

export default function Culture() {
  return (
    <Page
      title="Culture"
      subtitle="Beliefs, holidays, and ceremonies across the 14 kingdoms."
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Zones", to: "/zones" },
        { label: "Culture" },
      ]}
    >
      <div className="culture-grid grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kingdoms.map((k) => (
          <section key={k.name} className="nv-card rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>{k.emoji}</span>
              {k.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{k.tagline}</p>

            <div className="mt-4 grid grid-cols-3 gap-4">
              {["Beliefs", "Holidays", "Ceremonies"].map((label) => (
                <div key={label}>
                  <h4 className="text-sm font-semibold">{label}</h4>
                  <ul className="mt-2 list-reset [li]:ml-0 [li]:text-sm [li]:leading-6">
                    {k[label.toLowerCase() as "beliefs" | "holidays" | "ceremonies"].map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Page>
  );
}

