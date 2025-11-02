import { MotionCurves } from "../../utils/curves.js";
import { Rhythm } from "./Rhythm.js";

// Apex, Left Ducubitus, Bell - S3 & Holosys Murmur - Dilated Cardiomyopathy w/ Mitral Regurg
export const s3HolosysMurmurRhythm: Rhythm = {
    name: "Apex S3 & Holosys Murmur",
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
        // S3 sound
        {
            time: 0.72,
            soundPath: "assets/sounds/s3.wav",
        },
    ]
};