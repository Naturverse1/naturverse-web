export type Review = {
  id: string; productId: string; rating: number; title: string; body: string;
  author?: string; createdAt: string; votesUp: number; votesDown: number;
};
export type QA = {
  id: string; productId: string; question: string; answer?: string;
  author?: string; createdAt: string;
};

const REV_KEY = 'nv_reviews_v1';
const QA_KEY = 'nv_qas_v1';

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function write<T>(key: string, list: T[]) { localStorage.setItem(key, JSON.stringify(list)); }

export function getReviews(productId: string): Review[] {
  return read<Review>(REV_KEY).filter(r => r.productId === productId);
}
export function addReview(r: Omit<Review, 'id'|'createdAt'|'votesUp'|'votesDown'>) {
  const list = read<Review>(REV_KEY);
  const item: Review = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), votesUp:0, votesDown:0, ...r };
  list.unshift(item); write(REV_KEY, list); return item;
}
export function voteReview(id: string, up: boolean) {
  const list = read<Review>(REV_KEY);
  const i = list.findIndex(r => r.id === id);
  if (i >= 0) { up ? list[i].votesUp++ : list[i].votesDown++; write(REV_KEY, list); }
}
export function removeReview(id: string) {
  write(REV_KEY, read<Review>(REV_KEY).filter(r => r.id !== id));
}
export function ratingStats(productId: string) {
  const arr = getReviews(productId);
  const total = arr.length;
  const avg = total ? +(arr.reduce((s,r)=>s+r.rating,0)/total).toFixed(2) : 0;
  const dist = [1,2,3,4,5].map(star => arr.filter(r=>r.rating===star).length);
  return { total, avg, dist };
}

// Q&A
export function getQA(productId: string): QA[] {
  return read<QA>(QA_KEY).filter(q => q.productId === productId);
}
export function askQuestion(q: Omit<QA,'id'|'createdAt'>) {
  const list = read<QA>(QA_KEY);
  const item: QA = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...q };
  list.unshift(item); write(QA_KEY, list); return item;
}
export function answerQuestion(id: string, answer: string) {
  const list = read<QA>(QA_KEY);
  const i = list.findIndex(x => x.id === id);
  if (i >= 0) { list[i].answer = answer; write(QA_KEY, list); }
}
export function removeQA(id: string) {
  write(QA_KEY, read<QA>(QA_KEY).filter(q => q.id !== id));
}
