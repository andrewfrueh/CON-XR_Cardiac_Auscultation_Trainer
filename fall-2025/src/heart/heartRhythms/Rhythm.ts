import { CurveFunction } from "../../utils/curves.js";
import { mitralNormalS1S2Rhythm } from "./Mitral/NormalS1S2.js";
import { mitralS4GallopRhythm } from "./Mitral/S4Gallop.js";
import { mitralS3GallopRhythm } from "./Mitral/S3Gallop.js";
import { mitralMidSystolicClickRhythm } from "./Mitral/Mid-SystolicClick.js";
import { mitralMidSystolicMurmurRhythm } from "./Mitral/Mid-SystolicMurmur.js"
import { mitralSplitS1Rhythm } from "./Mitral/SplitS1.js"
import { mitralEarlySystolicMurmurRhythm } from "./Mitral/EarlySystolicMurmur.js";
import { mitralLateSystolicMurmurRhythm } from "./Mitral/LateSystolicMurmur.js";
import { mitralHolosystolicMurmurRhythm } from "./Mitral/HolosystolicMurmur.js";
import { mitralClickLateSystolicMurmurRhythm } from "./Mitral/Click-Late-SystolicMurmur.js";
import { mitralS4MidSysRhythm } from "./Mitral/S4&Mid-SysMurmur.js"
import { mitralS3HolosysMurmurRhythm } from "./Mitral/S3&HolosysMurmur.js"
import { mitralOpeningSnapAndDiastolicMurmurRhythm } from "./Mitral/MitralOpeningSnap&DiastolicMurmur.js"
import { aorticNormalS1S2Rhythm } from "./Aortic/NormalS1S2.js";
import { aorticS3GallopRhythm } from "./Aortic/S3Gallop.js";
import { aorticS4GallopRhythm } from "./Aortic/S4Gallop.js";
import { aorticMidSystolicClickRhythm } from "./Aortic/Mid-SystolicClick.js";
import { aorticEarlySystolicMurmurRhythm } from "./Aortic/EarlySystolicMurmur.js";
import { aorticMidSystolicMurmurRhythm } from "./Aortic/Mid-SystolicMurmur.js";
import { aorticLateSystolicMurmurRhythm } from "./Aortic/LateSystolicMurmur.js";
import { aorticSystolicMurmurAbsentS2Rhythm } from "./Aortic/SystolicMurmurAbsentS2.js";
import { aorticEarlyDiastolicMurmurRhythm } from "./Aortic/EarlyDiastolicMurmur.js";
import { aorticSystolicDiastolicMurmurRhythm } from "./Aortic/Systolic&DiastolicMurmur.js"
import {aorticClickLateSystolicMurmurRhythm} from "./Aortic/Click-Late-SystolicMurmur.js"
import {pulmonicMidSystolicMurmurRhythm} from "./Pulmonic/Mid-SystolicMurmur.js"
export type AnimationKeyframe = {
	time: number;
	animationEnd: number;
	blendshape: ("LA" | "RA" | "LV" | "RV")[];
	value: number;
	curveFunction: CurveFunction;
}

export type SoundKeyframe = {
	time: number;
	soundPath: string;
	volume?: number;
	pitch?: number;
};

export type Rhythm = {
	name: string;
	animation?: AnimationKeyframe[];
	sound?: SoundKeyframe[];
	location: "Aortic" | "Pulmonic" | "Tricuspid" | "Mitral";
};

export const defaultRhythm: Rhythm = mitralNormalS1S2Rhythm;

export const availableRhythms: Rhythm[] = [
	mitralNormalS1S2Rhythm,
	mitralS3GallopRhythm,
	mitralS4GallopRhythm,
	mitralMidSystolicClickRhythm,
	mitralEarlySystolicMurmurRhythm,
	mitralMidSystolicMurmurRhythm,
	mitralLateSystolicMurmurRhythm,
	mitralClickLateSystolicMurmurRhythm,
	aorticNormalS1S2Rhythm,
	aorticS3GallopRhythm,
	aorticS4GallopRhythm,
	aorticMidSystolicClickRhythm,
	aorticEarlySystolicMurmurRhythm,
	aorticMidSystolicMurmurRhythm,
	aorticLateSystolicMurmurRhythm,
	aorticClickLateSystolicMurmurRhythm
];