import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Supine, Bell - Early Systolic Murmur - Acute Mitral Regurg
export const tricuspidEarlySystolicMurmurRhythm: Rhythm = {
    location: "Tricuspid",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // Early Systolic Murmur sound
        {
            time: 0.34,
            soundPath: "assets/sounds/early-Systolic-Murmur.wav",
            volume: .8
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};