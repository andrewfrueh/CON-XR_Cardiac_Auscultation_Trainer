import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

// Aortic, Supine, Bell - Normal S1 S2 - Normal
export const aorticNormalS1S2Rhythm: Rhythm = {
    name: "Aortic Normal S1 S2",
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