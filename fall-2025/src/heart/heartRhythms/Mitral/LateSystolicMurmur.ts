import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Supine, Bell - Late Systolic Murmur - Mitral Regurg due to MVP
export const mitralLateSystolicMurmurRhythm: Rhythm = {
    location: "Mitral",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // Late Systolic Murmur sound
        {
            time: 0.53,
            soundPath: "assets/sounds/late-Systolic-Murmur.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};