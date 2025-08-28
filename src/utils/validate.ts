import { Quest } from "../data/quests";

export function validateQuest(q: Quest): string[] {
  const errs: string[] = [];
  if (!q.title?.trim()) errs.push("Title is required.");
  if (!q.summary?.trim()) errs.push("Summary is required.");
  if (!q.steps?.length) errs.push("At least one step is required.");
  if (q.steps.some(s => !s.text?.trim())) errs.push("Each step needs text.");
  return errs;
}
