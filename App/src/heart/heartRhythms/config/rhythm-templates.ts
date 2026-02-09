/**
 * Rhythm Templates - Base definitions for each rhythm type
 * These templates define the structure of sounds without location-specific adjustments
 */

/**
 * SoundKey - Abstract sound identifiers that map to actual files per location
 */
export type SoundKey =
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "Click"
  | "SystolicMurmur"
  | "HolosystolicMurmur"
  | "EarlyDiastolicMurmur";

import { MurmurEnvelope } from "../../../AudioEngine.js";

/**
 * Sound event in a rhythm template
 */
export type TemplateSoundEvent = {
  time: number;
  soundKey: SoundKey;
  /** Optional volume multiplier for this specific sound in the template */
  volumeMultiplier?: number;
  /** Optional envelope for gain automation + filtering (murmur modulation) */
  envelope?: MurmurEnvelope;
};

/**
 * Rhythm template definition
 */
export type RhythmTemplate = {
  name: string;
  displayName: string;
  description?: string;
  sounds: TemplateSoundEvent[];
};

/**
 * All rhythm templates
 * Add new rhythms here - they automatically work with all locations
 */
export const rhythmTemplates: Record<string, RhythmTemplate> = {
  NormalS1S2: {
    name: "NormalS1S2",
    displayName: "Normal S1 S2",
    description: "Normal heart sounds",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      { time: 0.62, soundKey: "S2" },
    ],
  },

  S3Gallop: {
    name: "S3Gallop",
    displayName: "S3 Gallop",
    description: "Third heart sound - ventricular gallop",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      { time: 0.62, soundKey: "S2" },
      { time: 0.72, soundKey: "S3", volumeMultiplier: 2 },
    ],
  },

  S4Gallop: {
    name: "S4Gallop",
    displayName: "S4 Gallop",
    description: "Fourth heart sound - atrial gallop",
    sounds: [
      { time: 0.22, soundKey: "S4", volumeMultiplier: 1.5 },
      { time: 0.32, soundKey: "S1" },
      { time: 0.62, soundKey: "S2" },
    ],
  },

  MidSystolicClick: {
    name: "MidSystolicClick",
    displayName: "Mid Systolic Click",
    description: "Mitral valve prolapse",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      { time: 0.42, soundKey: "Click" },
      { time: 0.62, soundKey: "S2" },
    ],
  },

  EarlySystolicMurmur: {
    name: "EarlySystolicMurmur",
    displayName: "Early Systolic Murmur",
    description: "Acute mitral regurgitation",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      {
        time: 0.34,
        soundKey: "SystolicMurmur",
        envelope: {
          attack: 0.0, // Instant onset (decrescendo shape)
          sustain: 0.1,
          decay: 0.2,
          peakGain: 0.3,
          hpFreq: 80,
          lpFreq: 4000,
        },
      },
      { time: 0.62, soundKey: "S2" },
    ],
  },

  MidSystolicMurmur: {
    name: "MidSystolicMurmur",
    displayName: "Mid Systolic Murmur",
    description: "Mitral regurgitation due to CAD",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      {
        time: 0.4,
        soundKey: "SystolicMurmur",
        envelope: {
          attack: 0.08, // Diamond shape (crescendo-decrescendo)
          sustain: 0.25,
          decay: 0.15,
          peakGain: 0.9,
          hpFreq: 120,
          lpFreq: 3500,
        },
      },
      { time: 0.62, soundKey: "S2" },
    ],
  },

  LateSystolicMurmur: {
    name: "LateSystolicMurmur",
    displayName: "Late Systolic Murmur",
    description: "Mitral regurgitation due to MVP",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      {
        time: 0.53,
        soundKey: "SystolicMurmur",
        envelope: {
          attack: 0.25, // Crescendo shape (slow fade-in, sharp cutoff)
          sustain: 0.15,
          decay: 0.05,
          peakGain: 0.85,
          hpFreq: 200,
          lpFreq: 3000,
        },
      },
      { time: 0.62, soundKey: "S2" },
    ],
  },

  ClickLateSystolicMurmur: {
    name: "ClickLateSystolicMurmur",
    displayName: "Click w/ Late Systolic Murmur",
    description: "MVP with mitral regurgitation",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      { time: 0.5, soundKey: "Click" },
      {
        time: 0.53,
        soundKey: "SystolicMurmur",
        envelope: {
          attack: 0.25, // Same crescendo profile as LateSystolicMurmur
          sustain: 0.15,
          decay: 0.05,
          peakGain: 0.85,
          hpFreq: 200,
          lpFreq: 3000,
        },
      },
      { time: 0.62, soundKey: "S2" },
    ],
  },
};

/** All available rhythm names */
export type RhythmName = keyof typeof rhythmTemplates;

/** Get list of all rhythm names */
export function getAvailableRhythmNames(): RhythmName[] {
  return Object.keys(rhythmTemplates) as RhythmName[];
}
