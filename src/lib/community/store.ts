import { BoardPost, Poll } from './types';

const PK = 'naturverse.community.polls.v1';
const BK = 'naturverse.community.board.v1';
const VK = 'naturverse.community.voted.v1'; // pollId -> choiceId

const read = <T>(k: string, d: T) => {
  try {
    return JSON.parse(localStorage.getItem(k) || 'null') ?? d;
  } catch {
    return d;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/* Polls */
export function loadPolls(): Poll[] {
  return read<Poll[]>(PK, []);
}
export function savePolls(list: Poll[]) {
  write(PK, list);
}
export function submitVote(pollId: string, choiceId: string) {
  const voted = read<Record<string, string>>(VK, {});
  if (voted[pollId]) return false; // already voted
  const polls = loadPolls();
  const p = polls.find((p) => p.id === pollId);
  if (!p) return false;
  const c = p.choices.find((c) => c.id === choiceId);
  if (!c) return false;
  c.votes += 1;
  voted[pollId] = choiceId;
  savePolls(polls);
  write(VK, voted);
  return true;
}
export function hasVoted(pollId: string) {
  const voted = read<Record<string, string>>(VK, {});
  return !!voted[pollId];
}

/* Board */
export function loadBoard(): BoardPost[] {
  return read<BoardPost[]>(BK, []);
}
export function saveBoard(list: BoardPost[]) {
  write(BK, list);
}
export function rsvp(postId: string) {
  const list = loadBoard();
  const p = list.find((x) => x.id === postId);
  if (!p) return;
  p.rsvps += 1;
  saveBoard(list);
}
