import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

// Apex, Left Ducubitus, Bell - S4 Gallop - Left Ventricular Hypertrophy
export const s4GallopRhythm: Rhythm = {
    name: "Apex S4 Gallop",
    sound: [
        // S4 sound
        {
            time: 0.22,
            soundPath: "assets/sounds/s4.wav",
        },
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};