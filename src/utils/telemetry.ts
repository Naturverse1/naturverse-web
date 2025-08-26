type Payload = Record<string, unknown>;

const hasDL = () => typeof window !== "undefined" && Array.isArray((window as any).dataLayer);
const push = (e: string, p: Payload = {}) => {
  if (hasDL()) (window as any).dataLayer.push({ event: e, ...p });
};

export const track = {
  pageview(path = location.pathname) {
    push("nv_page", { path });
  },
  click(name: string, meta: Payload = {}) {
    push("nv_click", { name, ...meta });
  },
  search(query: string, hits: number) {
    push("nv_search", { query, hits });
  },
  error(where: string, message: string) {
    push("nv_error", { where, message });
  },
};
