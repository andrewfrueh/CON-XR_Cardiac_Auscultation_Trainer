import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

export const pulmonicS3Gallop: Rhythm = { 
    name: "S3 Gallop",
    location: "Pulmonic",
    sound: [
        {
            time: 0.32,
            soundPath: "assets/sounds/heart-normal-S1.wav",
            volume: 0.6
        },
        {
            time: 0.62,
            soundPath: "assets/sounds/heart-normal-S2.wav",
            volume: 1.2
        },
        {
            time: 0.72,
            soundPath: "assets/sounds/s3.wav",
            volume: 0.1
        }
    ]
}