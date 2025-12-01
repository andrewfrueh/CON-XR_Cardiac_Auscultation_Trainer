import { mitralRhythms } from "./heartRhythms/Mitral/index.js";
import { aorticRhythms } from "./heartRhythms/Aortic/index.js";
import { pulmonicRhythms } from "./heartRhythms/Pulmonic/index.js";
import { tricuspidRhythms } from "./heartRhythms/Tricuspid/index.js";

export interface RhythmOption {
    value: string;  
    label: string;  
}

export interface RhythmGroups {
    [location: string]: RhythmOption[];
}

export const rhythmGroups: RhythmGroups = {
    mitral: mitralRhythms.map(rhythm => ({ value: rhythm.name, label: rhythm.name })),
    aortic: aorticRhythms.map(rhythm => ({ value: rhythm.name, label: rhythm.name })),
    pulmonic: pulmonicRhythms.map(rhythm => ({ value: rhythm.name, label: rhythm.name })),
    tricuspid: tricuspidRhythms.map(rhythm => ({ value: rhythm.name, label: rhythm.name })),
}
