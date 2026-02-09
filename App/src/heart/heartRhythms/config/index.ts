/**
 * Rhythm Configuration - Central exports for the data-driven rhythm system
 */

export {
  rhythmTemplates,
  type RhythmName,
  type RhythmTemplate,
  type SoundKey,
  type TemplateSoundEvent,
  getAvailableRhythmNames,
} from "./rhythm-templates.js";
export {
  locationModifiers,
  type LocationConfig,
  type SoundOverride,
  getLocationConfig,
} from "./location-modifiers.js";
export {
  createRhythm,
  createAllRhythms,
  getRhythmDisplayName,
  getAllRhythmDisplayNames,
} from "./rhythm-factory.js";
export { defaultAnimation } from "./animation-keyframes.js";
