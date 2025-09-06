import { NavLink } from "react-router-dom";

export default function NavatarTabs() {
  const tab = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "nv-tab" + (isActive ? " is-active" : "")
      }
      end
    >
      {label}
    </NavLink>
  );

  return (
    <>
      <div className="nv-tabs">
        {tab("/navatar", "My Navatar")}
        {tab("/navatar/pick", "Pick")}
        {tab("/navatar/upload", "Upload")}
        {tab("/navatar/generate", "Generate")}
        {tab("/marketplace", "Marketplace")}
      </div>
      <style>{`
        .nv-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: .75rem;
          justify-content: center;
          margin: .5rem 0 1.25rem;
          overflow-x: auto;
          padding-bottom: .25rem;
        }
        .nv-tab {
          display: inline-block;
          padding: .6rem .9rem;
          border: 2px solid var(--nv-blue-200);
          border-radius: .9rem;
          text-decoration: none;
          color: var(--nv-blue-700);
          background: #fff;
          white-space: nowrap;
        }
        .nv-tab.is-active {
          border-color: var(--nv-blue-400);
          box-shadow: 0 0 0 2px rgba(60,100,255,.06) inset;
        }
      `}</style>
    </>
  );
}
