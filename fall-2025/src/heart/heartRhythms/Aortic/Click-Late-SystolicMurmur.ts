import { MotionCurves } from "../../../utils/curves.js";
import { Rhythm } from "../Rhythm.js";

// Aortic, Left Ducubitus, Bell - Sys Click w/ Late Sys Murmur - MVP w/ Mitral Regurg
export const aorticClickLateSystolicMurmurRhythm: Rhythm = {
    name: "Click w/ Late Systolic Murmur",
    location: "Aortic",
    sound: [
        // S1 sound from aortic location
        {
            time: 0.32,
            soundPath: "assets/sounds/aorticS1.wav",
        },
        // Click sound. From our research the click sound is rarely heard here
        {
            time: 0.50,
            soundPath: "assets/sounds/click.wav",
            volume: 0.3,
        },
        // Late Systolic Murmur sound. From our research it not as loud here so adjusted volume to be less.
        {
            time: 0.53,
            soundPath: "assets/sounds/late-Systolic-Murmur.wav",
            volume: 0.5,
        },
        // S2 sound from aortic location
        {
            time: 0.62,
            soundPath: "assets/sounds/aorticS2.wav",
        },
    ]
};