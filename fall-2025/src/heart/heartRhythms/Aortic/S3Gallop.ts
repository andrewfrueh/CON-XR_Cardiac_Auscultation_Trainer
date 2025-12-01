import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Left Ducubitus, Bell - S3 Gallop - Both Normal and Cardiomyopathy
export const aorticS3GallopRhythm: Rhythm = { 
    name: "Aortic S3 Gallop",
    location: "Aortic",
    sound: [
        // S1 sound from aortic location
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav"
        },
        // S2 sound from aortic location
        {
            time: 0.62,
            soundPath: "assets/sounds/aorticS2.wav"
        },
        // S3 sound. Volume low because from our research this sound can barely be heard from this location
        {
            time: 0.72,
            soundPath: "assets/sounds/s3.wav",
            volume: 0.2
        }
    ]
}