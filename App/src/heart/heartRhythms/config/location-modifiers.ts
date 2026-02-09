/**
 * Location Modifiers - Per-auscultation-location sound adjustments
 * Based on clinical research documented in HeartRhythms.txt
 */

import { SoundKey } from "./rhythm-templates.js";
import { AuscultationLocation } from "../Rhythm.js";

/**
 * Sound override for specific sounds at a location
 */
export type SoundOverride = {
  volume?: number;
  pitch?: number;
};

/**
 * Configuration for a single auscultation location
 */
export type LocationConfig = {
  /** Map sound keys to actual file paths */
  soundPaths: Record<SoundKey, string>;
  /** Default volume multiplier for all sounds at this location */
  defaultVolume?: number;
  /** Default pitch multiplier for all sounds at this location */
  defaultPitch?: number;
  /** Per-sound overrides (applied on top of defaults) */
  soundOverrides?: Partial<Record<SoundKey, SoundOverride>>;
};

/**
 * Location modifiers for all auscultation points
 *
 * Clinical notes from HeartRhythms.txt:
 * - Mitral: All sounds at full volume (reference location)
 * - Aortic: S3/S4/Click barely heard, Mid-systolic louder, Late-systolic quieter
 * - Pulmonic: S2 loudest, S1 softer, S3/S4/Click very faint
 * - Tricuspid: All sounds less prominent, lower pitched
 */
export const locationModifiers: Record<AuscultationLocation, LocationConfig> = {
  Mitral: {
    soundPaths: {
      S1: "assets/sounds/heart-normal-S1.wav",
      S2: "assets/sounds/heart-normal-S2.wav",
      S3: "assets/sounds/s3.wav",
      S4: "assets/sounds/s4.wav",
      Click: "assets/sounds/click.wav",
      EarlySystolicMurmur: "assets/sounds/early-Systolic-Murmur.wav",
      MidSystolicMurmur: "assets/sounds/mid-Systolic-Murmur.wav",
      LateSystolicMurmur: "assets/sounds/late-Systolic-Murmur.wav",
      HolosystolicMurmur: "assets/sounds/holosystolic-Murmur.wav",
      EarlyDiastolicMurmur: "assets/sounds/early-Diastolic-Murmur.wav",
    },
    defaultVolume: 1.0,
    defaultPitch: 1.0,
    // S3/S4 boosted per SME feedback
    soundOverrides: {
      S3: { volume: 1.5 },
      S4: { volume: 1.5 },
    },
  },

  Aortic: {
    soundPaths: {
      S1: "assets/sounds/aorticS1.wav",
      S2: "assets/sounds/aorticS2.wav",
      S3: "assets/sounds/s3.wav",
      S4: "assets/sounds/s4.wav",
      Click: "assets/sounds/click.wav",
      EarlySystolicMurmur: "assets/sounds/early-Systolic-Murmur.wav",
      MidSystolicMurmur: "assets/sounds/mid-Systolic-Murmur.wav",
      LateSystolicMurmur: "assets/sounds/late-Systolic-Murmur.wav",
      HolosystolicMurmur: "assets/sounds/holosystolic-Murmur.wav",
      EarlyDiastolicMurmur: "assets/sounds/early-Diastolic-Murmur.wav",
    },
    defaultVolume: 1.0,
    defaultPitch: 1.0,
    // S3/S4/Click barely heard from this location
    soundOverrides: {
      S3: { volume: 0.5 },
      S4: { volume: 0.5 },
      Click: { volume: 0.3 },
      MidSystolicMurmur: { volume: 1.2 }, // Louder
      LateSystolicMurmur: { volume: 0.7 }, // Quieter
    },
  },

  Pulmonic: {
    soundPaths: {
      S1: "assets/sounds/heart-normal-S1.wav",
      S2: "assets/sounds/heart-normal-S2.wav",
      S3: "assets/sounds/s3.wav",
      S4: "assets/sounds/s4.wav",
      Click: "assets/sounds/click.wav",
      EarlySystolicMurmur: "assets/sounds/early-Systolic-Murmur.wav",
      MidSystolicMurmur: "assets/sounds/mid-Systolic-Murmur.wav",
      LateSystolicMurmur: "assets/sounds/late-Systolic-Murmur.wav",
      HolosystolicMurmur: "assets/sounds/holosystolic-Murmur.wav",
      EarlyDiastolicMurmur: "assets/sounds/early-Diastolic-Murmur.wav",
    },
    defaultVolume: 1.0,
    defaultPitch: 1.0,
    // S2 loudest, S1 softer, S3/S4/Click very faint
    soundOverrides: {
      S1: { volume: 0.6 },
      S2: { volume: 1.2 },
      S3: { volume: 0.4 },
      S4: { volume: 0.4 },
      Click: { volume: 0.2 },
      EarlySystolicMurmur: { volume: 0.8 },
      MidSystolicMurmur: { volume: 0.8 },
      LateSystolicMurmur: { volume: 0.8 },
      HolosystolicMurmur: { volume: 0.8 },
    },
  },

  Tricuspid: {
    soundPaths: {
      S1: "assets/sounds/heart-normal-S1.wav",
      S2: "assets/sounds/heart-normal-S2.wav",
      S3: "assets/sounds/s3.wav",
      S4: "assets/sounds/s4.wav",
      Click: "assets/sounds/click.wav",
      EarlySystolicMurmur: "assets/sounds/early-Systolic-Murmur.wav",
      MidSystolicMurmur: "assets/sounds/mid-Systolic-Murmur.wav",
      LateSystolicMurmur: "assets/sounds/late-Systolic-Murmur.wav",
      HolosystolicMurmur: "assets/sounds/holosystolic-Murmur.wav",
      EarlyDiastolicMurmur: "assets/sounds/early-Diastolic-Murmur.wav",
    },
    // All sounds less prominent and lower pitched
    defaultVolume: 0.7,
    defaultPitch: 0.9,
    soundOverrides: {
      S3: { volume: 1.2 }, // Boosted from 0.7 base
      S4: { volume: 1.2 },
    },
  },
};

/** Get location config, with fallback to Mitral */
export function getLocationConfig(
  location: AuscultationLocation,
): LocationConfig {
  return locationModifiers[location] ?? locationModifiers.Mitral;
}
