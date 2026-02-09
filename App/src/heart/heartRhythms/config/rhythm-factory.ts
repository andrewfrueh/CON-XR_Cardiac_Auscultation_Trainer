/**
 * Rhythm Factory - Generates Rhythm objects from templates + location modifiers
 */

import { Rhythm, SoundKeyframe, AuscultationLocation } from "../Rhythm.js";
import {
  rhythmTemplates,
  RhythmName,
  RhythmTemplate,
} from "./rhythm-templates.js";
import { locationModifiers, getLocationConfig } from "./location-modifiers.js";
import { defaultAnimation } from "./animation-keyframes.js";

/**
 * Create a Rhythm object for a given rhythm name and location
 */
export function createRhythm(
  rhythmName: RhythmName,
  location: AuscultationLocation,
): Rhythm {
  const template = rhythmTemplates[rhythmName];
  if (!template) {
    throw new Error(`Unknown rhythm: ${rhythmName}`);
  }

  const locationConfig = getLocationConfig(location);
  const sounds: SoundKeyframe[] = [];

  for (const event of template.sounds) {
    const soundPath = locationConfig.soundPaths[event.soundKey];
    if (!soundPath) {
      console.warn(`No sound path for ${event.soundKey} at ${location}`);
      continue;
    }

    // Calculate final volume: default × override × template multiplier
    let volume = locationConfig.defaultVolume ?? 1.0;

    const override = locationConfig.soundOverrides?.[event.soundKey];
    if (override?.volume !== undefined) {
      volume = override.volume;
    }

    if (event.volumeMultiplier !== undefined) {
      volume *= event.volumeMultiplier;
    }

    // Calculate final pitch
    let pitch = locationConfig.defaultPitch ?? 1.0;
    if (override?.pitch !== undefined) {
      pitch = override.pitch;
    }

    sounds.push({
      time: event.time,
      soundPath,
      volume,
      pitch,
    });
  }

  return {
    location,
    sound: sounds,
    // Animation is shared across all rhythms (from Aortic NormalS1S2)
    animation: defaultAnimation,
  };
}

/**
 * Create all rhythms for all locations
 * Returns a nested map: location -> rhythmName -> Rhythm
 */
export function createAllRhythms(): Record<
  AuscultationLocation,
  Record<RhythmName, Rhythm>
> {
  const locations: AuscultationLocation[] = [
    "Aortic",
    "Pulmonic",
    "Tricuspid",
    "Mitral",
  ];
  const rhythmNames = Object.keys(rhythmTemplates) as RhythmName[];

  const result = {} as Record<AuscultationLocation, Record<RhythmName, Rhythm>>;

  for (const location of locations) {
    result[location] = {} as Record<RhythmName, Rhythm>;
    for (const rhythmName of rhythmNames) {
      result[location][rhythmName] = createRhythm(rhythmName, location);
    }
  }

  return result;
}

/**
 * Get the display name for a rhythm
 */
export function getRhythmDisplayName(rhythmName: RhythmName): string {
  return rhythmTemplates[rhythmName]?.displayName ?? rhythmName;
}

/**
 * Get all rhythm display names
 */
export function getAllRhythmDisplayNames(): Record<RhythmName, string> {
  const result = {} as Record<RhythmName, string>;
  for (const [name, template] of Object.entries(rhythmTemplates)) {
    result[name as RhythmName] = template.displayName;
  }
  return result;
}
