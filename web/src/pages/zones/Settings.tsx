import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Theme = "light" | "dark";
type Scale = "normal" | "large";

export default function Settings() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "light");
  const [scale, setScale] = useState<Scale>(() => (localStorage.getItem("textScale") as Scale) || "normal");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--text-scale", scale === "large" ? "1.25" : "1");
    localStorage.setItem("textScale", scale);
  }, [scale]);

  return (
    <main className="page-container mx-auto max-w-5xl py-10 text-white">
      <Breadcrumbs
        items={[
          { label: "Naturverse" },
          { label: "Home", to: "/" },
          { label: "Zones", to: "/zones" },
          { label: "Settings" }
        ]}
      />
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-white/80 mt-2">Theme, accessibility, and account options.</p>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Theme</h2>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`rounded-md px-4 py-2 ${theme === "light" ? "bg-sky-600" : "bg-white/10"}`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`rounded-md px-4 py-2 ${theme === "dark" ? "bg-sky-600" : "bg-white/10"}`}
          >
            Dark
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Text size</h2>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => setScale("normal")}
            className={`rounded-md px-4 py-2 ${scale === "normal" ? "bg-sky-600" : "bg-white/10"}`}
          >
            Normal
          </button>
          <button
            onClick={() => setScale("large")}
            className={`rounded-md px-4 py-2 ${scale === "large" ? "bg-sky-600" : "bg-white/10"}`}
          >
            Large
          </button>
        </div>
      </section>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 mt-6">
        <h2 className="text-xl font-semibold text-white">Immersive Background</h2>
        <p className="text-white/70 mt-1">Choose backdrop visuals. Starfield disables automatically if “Reduce motion” is on.</p>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => { localStorage.setItem("immersive-mode", "off"); window.dispatchEvent(new StorageEvent("storage")); }}
            className="rounded-md bg-white/10 px-3 py-2"
          >
            Off
          </button>
          <button
            onClick={() => { localStorage.setItem("immersive-mode", "canvas"); window.dispatchEvent(new StorageEvent("storage")); }}
            className="rounded-md bg-sky-600 px-3 py-2"
          >
            Starfield
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4 mt-6">
        <h2 className="text-xl font-semibold text-white">Motion</h2>
        <label className="text-white/80">
          <input
            type="checkbox"
            defaultChecked={localStorage.getItem("reduce-motion") === "true"}
            onChange={(e) => {
              localStorage.setItem("reduce-motion", e.target.checked ? "true" : "false");
              window.dispatchEvent(new StorageEvent("storage"));
            }}
            style={{ marginRight: 8 }}
          />
          Reduce motion (fewer animations)
        </label>
      </div>
    </main>
  );
}
