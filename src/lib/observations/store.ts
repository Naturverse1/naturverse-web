import { Observation } from './types';

const KEY = 'naturverse.observations.v1';

export function loadObservations(): Observation[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveObservations(list: Observation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function addObservation(o: Observation) {
  const list = loadObservations();
  list.unshift(o);
  saveObservations(list);
}

export function removeObservation(id: string) {
  const list = loadObservations().filter((o) => o.id !== id);
  saveObservations(list);
}

export function exportObservations(): string {
  return JSON.stringify(loadObservations(), null, 2);
}

export function importObservations(json: string) {
  const parsed = JSON.parse(json) as Observation[];
  saveObservations(parsed);
}
