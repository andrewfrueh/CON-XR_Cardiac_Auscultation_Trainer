import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Supine, Bell - Normal S1 S2 - Normal
export const mitralNormalS1S2Rhythm: Rhythm = {
    name: "Tricuspid Normal S1 S2",
    location: "Tricuspid",
    sound: [
        // S1 sound
        {
          time: 0.32,
          soundPath: "assets/sounds/heart-normal-S1.wav",
          volume: .7,
          pitch: .7
        },
        // S2 sound
        {
          time: 0.62,
          soundPath: "assets/sounds/heart-normal-S2.wav",
          volume: 0.7,
          pitch: 0.9
        }
      ]
    };