import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

// Apex, Left Ducubitus, Bell - Mitral Opening Snap & Diastolic Murmur - Mitral Stenosis
export const mitralOpeningSnapAndDiastolicMurmurRhythm: Rhythm = {
    name: "Apex Mitral Opening Snap & Diastolic Murmur",
    sound: [
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
        // Click sound
        {
            time: 0.64,
            soundPath: "assets/sounds/click.wav",
        },
        // Diastolic Murmur sound - testing with early systolic murmur sound
        {
            time: 0.66,
            soundPath: "assets/sounds/early-Systolic-Murmur.wav",
        },
        // S1 sound
        {
            time: 0.78,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
    ]
};