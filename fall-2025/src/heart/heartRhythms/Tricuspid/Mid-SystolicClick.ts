import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Apex, Supine, Bell - Mid-Systolic Click - Mitral Valve Prolapse (MVP)
export const tricuspidMidSystolicClickRhythm: Rhythm = {
    location: "Tricuspid",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
            volume: .8
        },
        // Click sound
        {
            time: 0.42,
            soundPath: "assets/sounds/click.wav",
            volume: .8
        },
        // S2 sound
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
            volume: .8
        },
    ]
};