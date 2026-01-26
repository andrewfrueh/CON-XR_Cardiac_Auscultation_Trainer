import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Sitting, Bell - Systolic & Diastolic Murmur - Combined Aortic Stenosis and Regurg
export const aorticSystolicDiastolicMurmurRhythm: Rhythm = {
    location: "Aortic",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav",
        },
        // Systolic Murmur sound
        {
            time: 0.35,
            soundPath: "assets/sounds/systolicMurmur.wav",
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