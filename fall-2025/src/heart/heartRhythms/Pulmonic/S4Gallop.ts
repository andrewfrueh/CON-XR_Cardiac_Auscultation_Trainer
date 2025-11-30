import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

export const pulmonicS4Gallop: Rhythm = {
    name: "S4 Gallop",
    location: "Pulmonic",
    sound: [
        {
            time: 0.22,
            soundPath: "assets/sounds/s4.wav",
            volume: 0.1
        },
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
            volume: 0.6
        },
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
            volume: 1.2
        }
    ]
}