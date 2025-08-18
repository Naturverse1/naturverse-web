export type Address = {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postal?: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
};

const KEY = 'natur_addresses_v1';

function save(list: Address[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function getAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Address[];
  } catch {}
  return [];
}

export function saveAddress(addr: Omit<Address, 'id'> & { id?: string }): Address {
  const list = getAddresses();
  const id = addr.id || crypto.randomUUID();
  const next: Address = { ...addr, id };
  if (next.isDefault) {
    list.forEach((a) => (a.isDefault = false));
  }
  const idx = list.findIndex((a) => a.id === id);
  if (idx >= 0) list[idx] = next; else list.push(next);
  save(list);
  return next;
}

export function removeAddress(id: string): void {
  const list = getAddresses().filter((a) => a.id !== id);
  save(list);
}

export function setDefault(id: string): void {
  const list = getAddresses();
  list.forEach((a) => (a.isDefault = a.id === id));
  save(list);
}

