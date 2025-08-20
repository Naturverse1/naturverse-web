const KEY = 'nv_leaderboard';
export type Score = { game: string; name: string; score: number; at: number; };
export function addScore(s: Score) {
  const list: Score[] = JSON.parse(localStorage.getItem(KEY) || '[]');
  list.push(s);
  localStorage.setItem(KEY, JSON.stringify(list.slice(-100)));
}
export function top(game: string, n=10): Score[] {
  const list: Score[] = JSON.parse(localStorage.getItem(KEY) || '[]');
  return list.filter(s=>s.game===game).sort((a,b)=>b.score-a.score).slice(0,n);
}
