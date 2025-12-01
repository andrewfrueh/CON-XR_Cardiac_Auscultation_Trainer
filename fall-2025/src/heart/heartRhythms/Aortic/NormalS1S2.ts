import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Supine, Bell - Normal S1 S2 - Normal
export const aorticNormalS1S2Rhythm: Rhythm = {
    name: "Aortic Normal S1 S2",
    location: "Aortic",
    animation: [
        // Atria contract
        {
          time: 0,
          blendshape: ["LA", "RA"],
          animationEnd: 0.15,
          value: 2, // Double the contraction
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
        // Atrial filling continues throughout diastole (30-100% of cycle)
        {
          time: 0.3,
          blendshape: ["LA", "RA"],
          animationEnd: 1.0,
          value: 0.3, // Subtle filling movement
          curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
      ],
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/aorticS2.wav",
        },
    ]
};