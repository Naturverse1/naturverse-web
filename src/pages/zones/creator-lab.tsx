import { Link } from "react-router-dom";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import NvCard from "../../components/NvCard";
import { setTitle } from "../_meta";

export default function CreatorLabPage() {
  setTitle("Creator Lab");
  return (
    <main className="container mx-auto px-4 py-8">

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Zones", href: "/zones" },
          { label: "Creator Lab" },
        ]}
      />

      <h1 className="nv-h1 mt-2">Creator Lab</h1>
      <p className="nv-lead mb-6">
        Art, characters, and maker tools.
      </p>

      {/* Example tiles (keep structure consistent with other zones) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NvCard
          title="Make a character"
          desc="Design heroes, mentors, and sidekicks."
          href="#"
        />
        <NvCard
          title="Storyboards"
          desc="Plan adventures and quests."
          href="#"
        />
        <NvCard
          title="Sticker sheets"
          desc="Print-ready sheets for crafts."
          href="#"
        />
      </div>

      <div className="mt-8">
        <Link className="nv-link" to="/zones">Back to Zones</Link>
      </div>
    </main>
  );
}

