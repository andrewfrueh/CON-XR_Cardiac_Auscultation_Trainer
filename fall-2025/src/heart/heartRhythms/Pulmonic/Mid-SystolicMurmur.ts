import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

export const pulmonicMidSystolicMurmurRhythm: Rhythm = {
    name: "Mid-Systolic Murmur",
    location: "Pulmonic",
    sound: [
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
            volume: 0.6
        },
        {
            time: 0.40,
            soundPath: "assets/sounds/mid-Systolic-Murmur.wav",
            volume: 0.7,
        },
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
            volume: 1.2
        },
    ]
};