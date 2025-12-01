import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Supine, Bell - Mid-Systolic Click - Mitral Valve Prolapse (MVP)
export const aorticMidSystolicClickRhythm: Rhythm = {
    name: "Mid-Systolic Click",
    location: "Aortic",
    sound: [
        // S1 sound from aortic location
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav",
        },
        // Click sound. From our research the click sound is rarely heard here
        {
            time: 0.42,
            soundPath: "assets/sounds/click.wav",
            volume: 0.3,
        },
        // S2 sound from aortic location
        {
            time: 0.62,
            soundPath: "assets/sounds/aorticS2.wav",
        },
    ]
};