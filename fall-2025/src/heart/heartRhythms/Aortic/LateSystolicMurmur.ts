import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Supine, Bell - Late Systolic Murmur - Mitral Regurg due to MVP
export const aorticLateSystolicMurmurRhythm: Rhythm = {
    name: "Late Systolic Murmur",
    location: "Aortic",
    sound: [
        // S1 sound from aortic location
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav",
        },
        // Late Systolic Murmur sound. From our research it not as loud here so adjusted volume to be less.
        {
            time: 0.53,
            soundPath: "assets/sounds/late-Systolic-Murmur.wav",
            volume: 0.5
        },
        // S2 sound from aortic location
        {
            time: 0.62,
            soundPath: "assets/sounds/aorticS2.wav",
        },
    ]
};