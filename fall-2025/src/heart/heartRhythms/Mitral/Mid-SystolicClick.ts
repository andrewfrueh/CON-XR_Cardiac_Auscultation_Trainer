import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Supine, Bell - Mid-Systolic Click - Mitral Valve Prolapse (MVP)
export const mitralMidSystolicClickRhythm: Rhythm = {
    location: "Mitral",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // Click sound
        {
            time: 0.42,
            soundPath: "assets/sounds/click.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};