import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

export const pulmonicClickLateSystolicMurmurRhythm: Rhythm = {
    name: "Click w/ Late Systolic Murmur",
    location: "Pulmonic",
    sound: [
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
            volume: 0.6
        },
        {
            time: 0.50,
            soundPath: "assets/sounds/click.wav",
            volume: 0.15,
        },
        {
            time: 0.53,
            soundPath: "assets/sounds/late-Systolic-Murmur.wav",
            volume: 0.25,
        },
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
            volume: 1.2
        },
    ]
};