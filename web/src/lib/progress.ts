const KEY = "naturversity_progress_v1";

export type Progress = {
  completed: Record<string, boolean>; // lessonId -> true
};

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { completed: {} };
  } catch {
    return { completed: {} };
  }
}

function write(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function isComplete(lessonId: string) {
  return !!read().completed[lessonId];
}

export function toggleComplete(lessonId: string, value?: boolean) {
  const p = read();
  const next = value ?? !p.completed[lessonId];
  if (next) p.completed[lessonId] = true;
  else delete p.completed[lessonId];
  write(p);
}

export function countCompleted(ids: string[]) {
  const p = read();
  return ids.reduce((n, id) => (p.completed[id] ? n + 1 : n), 0);
}
