import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Left Ducubitus, Bell - S4 Gallop - Left Ventricular Hypertrophy
export const aorticS4GallopRhythm: Rhythm = {
    name: "S4 Gallop",
    location: "Aortic",
    sound: [
        // S4 sound. Volume is low because from our research this sound can barely be heard from this location
        {
            time: 0.22,
            soundPath: "assets/sounds/s4.wav",
            volume: 0.2
        },
        // S1 sound from aortic location
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav"
        },
        // S2 sound from aortic loction
        {
            time: 0.62,
            soundPath: "assets/sounds/aorticS2.wav"
        }
    ]
}