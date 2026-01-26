import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Left Ducubitus, Bell - S4 Gallop - Left Ventricular Hypertrophy
export const tricuspidS4GallopRhythm: Rhythm = {
    location: "Tricuspid",
    sound: [
        // S4 sound
        {
            time: 0.22,
            soundPath: "assets/sounds/s4.wav",
            volume: .7
        },
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
            volume: .7
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
            volume: .7
        },
    ]
};