import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { pickStaticAvatar } from "../../shared/avatars";
import { useAuthUser } from "../../lib/useAuthUser";
import "../../styles/navatar.css";

const images = Object.values(
  import.meta.glob("/public/navatars/photos/*.{png,jpg,jpeg,webp,gif}", {
    eager: true,
    as: "url",
  })
) as string[];

export default function PickNavatarPage() {
  const nav = useNavigate();
  const { user } = useAuthUser();

  async function onPick(url: string) {
    try {
      if (!user) {
        alert("Please sign in.");
        return;
      }
      await pickStaticAvatar(url, url.split("/").pop() || "Navatar");
      alert("Picked!");
      nav("/navatar");
    } catch (e: any) {
      alert(`Pick failed: ${e.message}`);
    }
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Pick" }]} />
      <h1 className="center">Pick Navatar</h1>
      <NavatarTabs />
      <div className="nav-grid">
        {images.map((url) => {
          const name = url.split("/").pop() || "Navatar";
          return (
            <button
              key={url}
              className="linklike"
              onClick={() => onPick(url)}
              aria-label={`Pick ${name}`}
              style={{ background: "none", border: 0, padding: 0, textAlign: "inherit" }}
            >
              <NavatarCard src={url} title={name} />
            </button>
          );
        })}
      </div>
    </main>
  );
}

