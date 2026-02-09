/**
 * Rhythm Types and Configuration
 *
 * This file defines the core types for heart rhythms and exports the
 * data-driven rhythm configuration system.
 */

import { CurveFunction } from "../../utils/curves.js";
import {
  createAllRhythms,
  getAllRhythmDisplayNames,
  RhythmName,
} from "./config/index.js";

// ============ Core Types ============

export type AnimationKeyframe = {
  time: number;
  animationEnd: number;
  blendshape: ("LA" | "RA" | "LV" | "RV")[];
  value: number;
  curveFunction: CurveFunction;
};

export type SoundKeyframe = {
  time: number;
  soundPath: string;
  volume?: number;
  pitch?: number;
};

export type AuscultationLocation =
  | "Aortic"
  | "Pulmonic"
  | "Tricuspid"
  | "Mitral";

export type Rhythm = {
  animation?: AnimationKeyframe[];
  sound?: SoundKeyframe[];
  location: AuscultationLocation;
};

// ============ Rhythm Names ============

/**
 * All selectable rhythm types
 * To add a new rhythm: add it to rhythm-templates.ts, it will automatically
 * be available for all locations.
 */
export type SelectableRhythm = RhythmName;

/**
 * Display names for rhythms (for UI)
 */
export const SelectableRhythmName: Record<SelectableRhythm, string> =
  getAllRhythmDisplayNames();

// ============ Rhythm Registry ============

export type AuscultationRhythms = {
  [key in SelectableRhythm]: Rhythm;
};

/**
 * All available rhythms, organized by location
 * Generated from templates + location modifiers
 */
export const availableRhythms: Record<
  AuscultationLocation,
  AuscultationRhythms
> = createAllRhythms() as Record<AuscultationLocation, AuscultationRhythms>;

/**
 * Default rhythm (used as fallback)
 */
export const defaultRhythm: Rhythm = availableRhythms.Aortic.NormalS1S2;

// ============ Re-exports ============

export {
  createRhythm,
  getRhythmDisplayName,
  getAvailableRhythmNames,
  type RhythmName,
} from "./config/index.js";
