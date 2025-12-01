import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Supine, Bell - Mid-Systolic Murmur - Mitral Regurg due to CAD
export const tricuspidMidSystolicMurmurRhythm: Rhythm = {
    name: "Mid-Systolic Murmur",
    location: "Tricuspid",
    sound: [
        // S1 sound from aortic location
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav",
            volume: .5,
            pitch: .6
        },
        // Mid-Systolic Murmur sound. From our research its the loudest in the region
        {
            time: 0.40,
            soundPath: "assets/sounds/mid-Systolic-Murmur.wav",
            volume: .5,
            pitch: .6
        },
        // S2 sound from aortic location
        {
            time: 0.62,
            soundPath: "assets/sounds/aorticS2.wav",
            volume: .5,
            pitch: .6
        },
    ]
};