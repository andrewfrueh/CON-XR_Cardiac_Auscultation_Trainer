import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

export const pulmonicMidSystolicClickRhythm: Rhythm = {
    location: "Pulmonic",
    sound: [
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
            volume: 0.6
        },
        {
            time: 0.42,
            soundPath: "assets/sounds/click.wav",
            volume: 0.1,
        },
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
            volume: 1.2
        },
    ]
};