import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Sitting, Bell - Early Diastolic Murmur - Aortic Regurg
export const aorticEarlyDiastolicMurmurRhythm: Rhythm = {
    name: "Aortic Early Diastolic Murmur",
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
        // Early Diastolic sound
        {
            time: 0.65,
            soundPath: "assets/sounds/early-Diastolic-Murmur.wav",
        },
    ]
};