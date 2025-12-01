import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Sitting, Bell - Systolic Murmur w/ Absent S2 - Severe Aortic Stenosis
export const aorticSystolicMurmurAbsentS2Rhythm: Rhythm = {
    name: "Systolic Murmur w/ Absent S2",
    location: "Aortic",
    sound: [
        // S1 sound
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav",
        },
        // Systolic Murmur sound
        {
            time: 0.35,
            soundPath: "assets/sounds/systolicMurmur.wav",
        },
    ]
};