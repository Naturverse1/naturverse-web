export class LRU<K, V> {
  private m = new Map<K, V>();
  constructor(private max = 8) {}

  get(k: K) {
    const v = this.m.get(k);
    if (v !== undefined) {
      this.m.delete(k);
      this.m.set(k, v);
    }
    return v;
  }

  set(k: K, v: V) {
    if (this.m.has(k)) this.m.delete(k);
    this.m.set(k, v);
    if (this.m.size > this.max) {
      const f = this.m.keys().next().value as K | undefined;
      if (f !== undefined) this.m.delete(f);
    }
  }
}
