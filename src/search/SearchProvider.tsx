import React from "react";
import { buildSearchIndex } from "./buildIndex";
import type { SearchDoc } from "./index";
import { on, EVT } from "../lib/events";

type Ctx = { docs: SearchDoc[]; rebuild: () => void };
export const SearchCtx = React.createContext<Ctx>({ docs: [], rebuild: () => {} });

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  const [docs, setDocs] = React.useState<SearchDoc[]>([]);

  const rebuild = React.useCallback(() => {
    const idx = buildSearchIndex();
    setDocs(idx);
  }, []);

  React.useEffect(() => {
    // initial build
    rebuild();
    // listen for rebuild triggers
    const off1 = on(EVT.SEARCH_REBUILD, rebuild);
    const off2 = on(EVT.QUEST_SAVED, rebuild);
    const off3 = on(EVT.QUESTS_SYNCED, rebuild);
    return () => { off1(); off2(); off3(); };
  }, [rebuild]);

  return (
    <SearchCtx.Provider value={{ docs, rebuild }}>
      {children}
    </SearchCtx.Provider>
  );
}
