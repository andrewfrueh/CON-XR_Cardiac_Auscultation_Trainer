import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Supine, Bell - Early Systolic Murmur - Acute Mitral Regurg
export const aorticEarlySystolicMurmurRhythm: Rhythm = {
    name: "Early Systolic Murmur",
    location: "Aortic",
    sound: [
        // S1 sound from aortic location
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav",
        },
        // Early Systolic Murmur sound. From our research it sounds similar to mitral region, so we let it unchanged
        {
            time: 0.34,
            soundPath: "assets/sounds/early-Systolic-Murmur.wav",
        },
        // S2 sound from aortic location
        {
            time: 0.62,
            soundPath: "assets/sounds/aorticS2.wav",
        },
    ]
};