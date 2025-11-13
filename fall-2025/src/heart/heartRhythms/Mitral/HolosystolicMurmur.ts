import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Supine, Bell - Holosystolic Murmur - Classic Mitral Regurg or Ventricular Septal Defect when heard along the left sternal border
export const mitralHolosystolicMurmurRhythm: Rhythm = {
    name: "Apex Holosystolic Murmur",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
        },
        // Holosystolic Murmur sound
        {
            time: 0.34,
            soundPath: "assets/sounds/holosystolic-Murmur.wav",
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
        },
    ]
};