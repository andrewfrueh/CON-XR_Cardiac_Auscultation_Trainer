/**
 * Smooth step function for more natural transitions
 */
const smoothStep = (t: number): number => {
  return t * t * (3 - 2 * t);
};

/**
 * Bell curve (smoothstep) - slow start, fast middle, slow end
 */
const bellCurve = (t: number): number => {
  return smoothStep(t);
};

/**
 * Bathtub curve (inverse smoothstep) - fast start, slow middle, fast end
 */
const bathtubCurve = (t: number): number => {
  // Inverse of smoothstep: fast at edges, slow in middle
  if (t < 0.5) {
    // First half: accelerate quickly then decelerate
    const t2 = t * 2; // Map 0-0.5 to 0-1
    return (2 * t2 - t2 * t2) * 0.5;
  } else {
    // Second half: accelerate then decelerate quickly
    const t2 = (t - 0.5) * 2; // Map 0.5-1 to 0-1
    return 0.5 + (t2 * t2 + 2 * t2 - t2 * t2) * 0.5;
  }
};

/**
 * Linear interpolation curve - constant speed
 */
const lerpCurve = (t: number): number => {
  return t; // Linear progression
};

/**
 * Heart muscle contraction curve - rapid onset, sustained peak, rapid relaxation
 * Mimics the actual contraction pattern of cardiac muscle
 */
const heartContractionCurve = (t: number): number => {
  if (t < 0.1) {
    // Rapid onset phase (0-10%)
    return smoothStep(t / 0.1) * 0.8;
  } else if (t < 0.3) {
    // Peak contraction phase (10-30%)
    return 0.8 + smoothStep((t - 0.1) / 0.2) * 0.2;
  } else if (t < 0.6) {
    // Sustained peak (30-60%)
    return 1.0;
  } else {
    // Rapid relaxation phase (60-100%)
    return 1.0 - smoothStep((t - 0.6) / 0.4);
  }
};

/**
 * Atrial contraction curve - shorter, gentler contraction
 * Atria contract more gently than ventricles
 */
const atrialContractionCurve = (t: number): number => {
  if (t < 0.2) {
    // Quick onset
    return smoothStep(t / 0.2) * 0.6;
  } else if (t < 0.4) {
    // Brief peak
    return 0.6;
  } else {
    // Quick relaxation
    return 0.6 - smoothStep((t - 0.4) / 0.6) * 0.6;
  }
};

/**
 * Ventricular contraction curve - powerful, sustained contraction
 * Ventricles have the strongest contraction force
 */
const ventricularContractionCurve = (t: number): number => {
  if (t < 0.15) {
    // Very rapid onset
    return smoothStep(t / 0.15) * 0.9;
  } else if (t < 0.4) {
    // Peak contraction
    return 0.9 + smoothStep((t - 0.15) / 0.25) * 0.1;
  } else if (t < 0.7) {
    // Sustained peak
    return 1.0;
  } else {
    // Gradual relaxation
    return 1.0 - smoothStep((t - 0.7) / 0.3);
  }
};

/**
 * Diastolic relaxation curve - gradual filling phase
 * Represents the heart chambers filling with blood
 */
const diastolicRelaxationCurve = (t: number): number => {
  // Very gentle curve for the relaxation/filling phase
  return 1.0 - smoothStep(t) * 0.3; // Only 30% movement for subtle filling
};

export type CurveFunction = (t: number) => number;

/**
 * Motion curve types for heart animation
 */
export const MotionCurves = {
  BELL: bellCurve,
  BATHTUB: bathtubCurve,
  LERP: lerpCurve,
  HEART_CONTRACTION: heartContractionCurve,
  ATRIAL_CONTRACTION: atrialContractionCurve,
  VENTRICULAR_CONTRACTION: ventricularContractionCurve,
  DIASTOLIC_RELAXATION: diastolicRelaxationCurve,
};
