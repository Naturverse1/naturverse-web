import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { getOrCreateNavatar, upsertNavatar } from "../../lib/navatar";
import { listNavatarImages } from "../../shared/storage";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useAuthUser } from "../../lib/useAuthUser";
import { useToast } from "../../components/Toast";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<{ name: string; url: string; path: string }[]>([]);
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const toast = useToast();

  useEffect(() => {
    listNavatarImages().then(setItems).catch(() => setItems([]));
  }, []);

  async function choose(item: { path: string; name: string; url: string }) {
    if (!user) {
      toast({ text: "Please sign in.", kind: "err" });
      return;
    }
    try {
      const base = await getOrCreateNavatar(user.id);
      const updated = await upsertNavatar(user.id, {
        image_url: item.url,
        image_path: item.path,
        ...(base.name ? {} : { name: item.name }),
      });
      setActiveNavatarId(updated.id);
      navigate("/navatar");
    } catch {
      toast({ text: "Could not save Navatar.", kind: "err" });
    }
  }

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Pick" }]} />
      </div>
      <h1 className="pageTitle mt-6 mb-12">Pick Navatar</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />
      <div className="nav-grid mt-6">
        {items.map(it => (
          <button
            key={it.path}
            className="linklike"
            onClick={() => choose(it)}
            aria-label={`Pick ${it.name}`}
            style={{ background: "none", border: 0, padding: 0, textAlign: "inherit" }}
          >
            <NavatarCard src={it.url} title={it.name} />
          </button>
        ))}
      </div>
    </main>
  );
}

