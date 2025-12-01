import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Supine, Bell - Normal S1 S2 - Normal
export const mitralNormalS1S2Rhythm: Rhythm = {
  name: "Apex Normal S1 S2",
  location: "Mitral",
  sound: [
    // S1 sound
    {
      time: 0.32,
      soundPath: "assets/sounds/heart-normal-S1.wav",
    },
    // S2 sound
    {
      time: 0.62,
      soundPath: "assets/sounds/heart-normal-S2.wav",
    }
  ]
};
