export type Observation = {
  id: string;
  title: string;
  notes?: string;
  tags: string[];
  takenAt?: string; // ISO
  lat?: number;
  lon?: number;
  color?: string; // dominant hex
  src: string; // full data URL
  thumb: string; // small data URL
};
