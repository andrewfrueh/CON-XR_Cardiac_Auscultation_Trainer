import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Supine, Bell - Split S1 - Normal
export const mitralSplitS1Rhythm: Rhythm = {
    location: "Mitral",
    sound: [
        // Split S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/splitS1.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};