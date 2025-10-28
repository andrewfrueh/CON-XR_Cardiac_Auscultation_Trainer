import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

// Apex, Supine, Bell - Mid-Systolic Murmur - Mitral Regurg due to CAD
export const midSystolicMurmurRhythm: Rhythm = {
    name: "Mid-Systolic Murmur",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // Mid-Systolic Murmur sound
        {
            time: 0.40,
            soundPath: "assets/sounds/mid-Systolic-Murmur.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};