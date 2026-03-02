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
  VentricularSeptalDefect: {
    name: "VentricularSeptalDefect",
    displayName: "Ventricular Septal Defect",
    description: "Ventricular septal defect",
    sounds: [
      { time: 0.12, soundKey: "S1" },
      { time: 0.23, soundKey: "EarlyDiastolicMurmur", volumeMultiplier: 4 },
      { time: 0.5, soundKey: "S2", volumeMultiplier: 0.4 },
      { time: 0.66, soundKey: "S2", volumeMultiplier: 0.6 },
    ],
  },
  SecondHeartSoundFixed: {
    name: "SecondHeartSoundFixed",
    displayName: "Second Heart Sound Fixed",
    description: "Second heart sound fixed",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      { time: 0.72, soundKey: "S2" },
      { time: 0.78, soundKey: "S3", volumeMultiplier: 1.5 },
    ],
  },
  SecondHeartSoundTumorPlop: {
    name: "SecondHeartSoundTumorPlop",
    displayName: "Second Heart Sound Tumor Plop",
    description: "Second heart sound tumor plop",
    sounds: [
      { time: 0.32, soundKey: "S1", volumeMultiplier: 0.9 },
      { time: 0.79, soundKey: "S2" },
      { time: 0.93, soundKey: "S3", volumeMultiplier: 0.9 },
    ],
  },
  SecondHeartSoundAndLateSystolicClick: {
    name: "SecondHeartSoundAndLateSystolicClick",
    displayName: "Second Heart Sound and Late Systolic Click",
    description: "Second heart sound with late systolic click",
    sounds: [
      { time: 0.32, soundKey: "S1", volumeMultiplier: 0.9 },
      {
        time: 0.76,
        soundKey: "SystolicMurmur",
        volumeMultiplier: 0.5,
        envelope: {
          attack: 0,
          sustain: 0.1,
          decay: 0.05,
          peakGain: 0.85,
          hpFreq: 200,
          lpFreq: 3000,
        },
      },
      { time: 0.78, soundKey: "Click", volumeMultiplier: 1.5 },
      { time: 0.87, soundKey: "S2", volumeMultiplier: 0.9 },
    ],
  },
  SummationGallop: {
    name: "SummationGallop",
    displayName: "Summation Gallop",
    description: "Summation gallop",
    sounds: [
      { time: 0.45, soundKey: "S1" },
      { time: 0.67, soundKey: "S2" },
      { time: 0.91, soundKey: "S3" },
    ],
  },
  TetralogyOfFallot: {
    name: "TetralogyOfFallot",
    displayName: "Tetralogy of Fallot",
    description: "Tetralogy of Fallot",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      { time: 0.45, soundKey: "S2", volumeMultiplier: 0.5 },
      { time: 0.52, soundKey: "HolosystolicMurmur" },
      { time: 0.85, soundKey: "S2" },
    ],
  },
  ThirdAndFourthHeartSoundGallop: {
    name: "ThirdAndFourthHeartSoundGallop",
    displayName: "Third and Fourth Heart Sound Gallop",
    description: "Third and fourth heart sound gallop",
    sounds: [
      { time: 0.32, soundKey: "S2", volumeMultiplier: 0.5 },
      { time: 0.75, soundKey: "S3" },
      { time: 0.92, soundKey: "S4" },
    ],
  },
  ArrhythmogenicRVADysplasia: {
    name: "ArrhythmogenicRVADysplasia",
    displayName: "Arrhythmogenic RV Dysplasia",
    description: "Arrhythmogenic RV dysplasia",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      {
        time: 0.4,
        soundKey: "HolosystolicMurmur",
        envelope: {
          attack: 0,
          sustain: 0.32,
          decay: 0.05,
          peakGain: 1,
        },
      },
      { time: 0.82, soundKey: "S2" },
    ],
  },
  AtrialSeptalDefect: {
    name: "AtrialSeptalDefect",
    displayName: "Atrial Septal Defect",
    description: "Atrial septal defect",
    sounds: [
      { time: 0.12, soundKey: "S1" },
      {
        time: 0.25,
        soundKey: "HolosystolicMurmur",
        envelope: {
          attack: 0.1,
          sustain: 0.1,
          decay: 0.05,
          peakGain: 1,
        },
      },
      { time: 0.56, soundKey: "S2", volumeMultiplier: 0.8 },
      { time: 0.64, soundKey: "S3", volumeMultiplier: 1.6 },
      { time: 0.96, soundKey: "S3", volumeMultiplier: 1.2 },
    ],
  },
  CoarctationOfTheAorta: {
    name: "CoarctationOfTheAorta",
    displayName: "Coarctation of the Aorta",
    description: "Coarctation of the aorta",
    sounds: [
      { time: 0.32, soundKey: "S1" },
      {
        time: 0.4,
        soundKey: "SystolicMurmur",
        envelope: {
          attack: 0.08,
          sustain: 0.25,
          decay: 0.15,
          peakGain: 0.8,
          hpFreq: 120,
          lpFreq: 3500,
        },
      },
      { time: 0.62, soundKey: "S2", volumeMultiplier: 1.5 },
      { time: 0.65, soundKey: "EarlyDiastolicMurmur", volumeMultiplier: 0.5 },
    ],
  },
  CommotioCordis: {
    name: "CommotioCordis",
    displayName: "Commotio Cordis",
    description: "Ventricular fibrillation following chest impact",
    sounds: [
      { time: 0.21, soundKey: "S1" },
      { time: 0.34, soundKey: "EarlyDiastolicMurmur", volumeMultiplier: 3 },
      { time: 0.72, soundKey: "S2" },
    ],
  },
  EbsteinsAnomaly: {
    name: "EbsteinsAnomaly",
    displayName: "Ebsteins Anomaly",
    description: "Widely split S1 and S2, with S3, S4 and holosystolic murmur",
    sounds: [
      { time: 0.01, soundKey: "S1"},
      {
        time: 0.07,
        soundKey: "HolosystolicMurmur",
        envelope: {
          attack: 0.05,
          sustain: 0.25,
          decay: 0.05,
          peakGain: 0.7,
        },
      },
      { time: 0.34, soundKey: "S1" },
      { time: 0.46, soundKey: "Click" },
      { time: 0.53, soundKey: "SystolicMurmur", volumeMultiplier: 0.7 },
      { time: 0.89, soundKey: "Click" },
    ],
  },
  ExerciseHeartRate: {
    name: "ExerciseHeartRate",
    displayName: "Exercise Heart Rate",
    description: "Exercise heart rate",
    sounds: [
      { time: 0.25, soundKey: "S1" },
      { time: 0.68, soundKey: "S2", volumeMultiplier: 0.15 },
    ],
  },
  FirstHeartSoundMinimallySplit: {
    name: "FirstHeartSoundMinimallySplit",
    displayName: "First Heart Sound Minimally Split",
    description: "First heart sound minimally split",
    sounds: [
      { time: 0.26, soundKey: "S1" },
      { time: 0.32, soundKey: "S1" },
      { time: 0.76, soundKey: "S2" },
    ],
  },
};

/** All available rhythm names */
export type RhythmName = keyof typeof rhythmTemplates;

/** Get list of all rhythm names */
export function getAvailableRhythmNames(): RhythmName[] {
  return Object.keys(rhythmTemplates) as RhythmName[];
}
