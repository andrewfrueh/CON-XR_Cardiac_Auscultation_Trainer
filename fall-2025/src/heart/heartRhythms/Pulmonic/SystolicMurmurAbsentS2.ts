import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

export const pulmonicSystolicMurmurAbsentS2Rhythm: Rhythm = {
    name: "Pulmonic Systolic Murmur w/ Absent S2",
    location: "Pulmonic",
    sound: [
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
            volume: 0.6
        },
        {
            time: 0.35,
            soundPath: "assets/sounds/systolicMurmur.wav",
            volume: 0.8
        },
    ]
};