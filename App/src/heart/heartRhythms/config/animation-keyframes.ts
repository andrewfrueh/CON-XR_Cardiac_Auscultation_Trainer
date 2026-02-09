/**
 * Animation Keyframes - Shared heart animation used by all rhythms
 * Extracted from Aortic/NormalS1S2.ts
 */

import { AnimationKeyframe } from "../Rhythm.js";
import { MotionCurves } from "../../../utils/curves.js";

/**
 * Default heart animation keyframes
 * Shows atria and ventricles contracting/relaxing in a cardiac cycle
 */
export const defaultAnimation: AnimationKeyframe[] = [
  // Atria contract
  {
    time: 0,
    blendshape: ["LA", "RA"],
    animationEnd: 0.15,
    value: 2,
    curveFunction: MotionCurves.ATRIAL_CONTRACTION,
  },
  // Atria relax
  {
    time: 0.15,
    blendshape: ["LA", "RA"],
    animationEnd: 0.3,
    value: 0,
    curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
  },
  // Ventricles contract
  {
    time: 0.3,
    blendshape: ["LV", "RV"],
    animationEnd: 0.65,
    value: 1,
    curveFunction: MotionCurves.VENTRICULAR_CONTRACTION,
  },
  // Ventricles relax
  {
    time: 0.65,
    blendshape: ["LV", "RV"],
    animationEnd: 1.0,
    value: 0,
    curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
  },
  // Atrial filling throughout diastole
  {
    time: 0.3,
    blendshape: ["LA", "RA"],
    animationEnd: 1.0,
    value: 0.3,
    curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
  },
];
