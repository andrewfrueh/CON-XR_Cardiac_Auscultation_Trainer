/**
 * RhythmOptions - UI helper types for rhythm selection
 */

import {
  availableRhythms,
  SelectableRhythmName,
  AuscultationLocation,
  SelectableRhythm,
} from "./heartRhythms/Rhythm.js";

export interface RhythmOption {
  value: string;
  label: string;
}

export interface RhythmGroups {
  [location: string]: RhythmOption[];
}

/**
 * Get rhythm options for a specific location
 */
export function getRhythmOptionsForLocation(
  location: AuscultationLocation,
): RhythmOption[] {
  const rhythms = availableRhythms[location];
  return Object.keys(rhythms).map((rhythmName) => ({
    value: rhythmName,
    label: SelectableRhythmName[rhythmName as SelectableRhythm],
  }));
}

/**
 * Get all rhythm options grouped by location
 */
export function getAllRhythmGroups(): RhythmGroups {
  const locations: AuscultationLocation[] = [
    "Aortic",
    "Pulmonic",
    "Tricuspid",
    "Mitral",
  ];
  const groups: RhythmGroups = {};

  for (const location of locations) {
    groups[location] = getRhythmOptionsForLocation(location);
  }

  return groups;
}
