import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Left Ducubitus, Bell - S4 & Mid-Sys Murmur - Ischemic Cardiomyopathy w/ Mitral Regurg
export const mitralS4MidSysRhythm: Rhythm = {
    location: "Mitral",
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