type Handler<T = any> = (payload: T) => void;
const bus = new Map<string, Set<Handler>>();

export function on<T = any>(event: string, handler: Handler<T>) {
  if (!bus.has(event)) bus.set(event, new Set());
  bus.get(event)!.add(handler as Handler);
  return () => off(event, handler);
}
export function off<T = any>(event: string, handler: Handler<T>) {
  bus.get(event)?.delete(handler as Handler);
}
export function emit<T = any>(event: string, payload?: T) {
  bus.get(event)?.forEach(h => {
    try { (h as Handler<T>)(payload as T); } catch (e) { console.error(e); }
  });
}

/** Event names used in the app */
export const EVT = {
  SEARCH_REBUILD: "search:rebuild",                // ask index to rebuild
  QUEST_SAVED: "quest:saved",                      // a quest was created/updated
  QUESTS_SYNCED: "quests:supabase-synced",         // initial/refresh fetch from cloud done
} as const;
