import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Theme = "light" | "dark";
type Scale = "normal" | "large";

export default function Settings() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "light");
  const [scale, setScale] = useState<Scale>(() => (localStorage.getItem("textScale") as Scale) || "normal");
  const [reduce, setReduce] = useState(() => localStorage.getItem("reduceMotion") === "1");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--text-scale", scale === "large" ? "1.25" : "1");
    localStorage.setItem("textScale", scale);
  }, [scale]);

  useEffect(() => {
    document.body.classList.toggle("reduce-motion", reduce);
    localStorage.setItem("reduceMotion", reduce ? "1" : "0");
  }, [reduce]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
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

      <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Accessibility</h2>
        <label className="mt-3 flex items-center gap-2">
          <input type="checkbox" checked={reduce} onChange={(e) => setReduce(e.target.checked)} />
          Reduce motion
        </label>
      </section>
    </main>
  );
}
