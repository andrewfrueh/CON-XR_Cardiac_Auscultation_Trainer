import { CurveFunction } from "../../utils/curves.js";
import { normalS1S2Rhythm } from "./ApexNormalS1S2.js";
import { s4GallopRhythm } from "./ApexS4Gallop.js";
import { s3GallopRhythm } from "./ApexS3Gallop.js";
import { midSystolicClickRhythm } from "./ApexMid-SystolicClick.js";
import { midSystolicMurmurRhythm } from "./ApexMid-SystolicMurmur.js"
import { splitS1Rhythm } from "./ApexSplitS1.js"
import { earlySystolicMurmurRhythm } from "./ApexEarlySystolicMurmur.js";
import { lateSystolicMurmurRhythm } from "./ApexLateSystolicMurmur.js";
import { holosystolicMurmurRhythm } from "./ApexHolosystolicMurmur.js";
import { clickLateSystolicMurmurRhythm } from "./ApexClick-Late-SystolicMurmur.js";
import { s4MidSysRhythm } from "./ApexS4&Mid-SysMurmur.js"
import { s3HolosysMurmurRhythm } from "./ApexS3&HolosysMurmur.js"
import { mitralOpeningSnapAndDiastolicMurmurRhythm } from "./ApexMitralOpeningSnap&DiastolicMurmur.js"
import { aorticNormalS1S2Rhythm } from "./AorticNormalS1S2.js"
import { aorticSystolicMurmurAbsentS2Rhythm } from "./AorticSystolicMurmurAbsentS2.js";
import { aorticEarlyDiastolicMurmurRhythm } from "./AorticEarlyDiastolicMurmur.js";
import { aorticSystolicDiastolicMurmurRhythm } from "./AorticSystolic&DiastolicMurmur.js"

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
};

export type Rhythm = {
	name: string;
	animation?: AnimationKeyframe[];
	sound?: SoundKeyframe[];
};

export const defaultRhythm: Rhythm = normalS1S2Rhythm;

export const availableRhythms: Rhythm[] = [
	normalS1S2Rhythm,
	s3GallopRhythm,
	s4GallopRhythm,
	midSystolicClickRhythm,
	splitS1Rhythm,
	earlySystolicMurmurRhythm,
	midSystolicMurmurRhythm,
	lateSystolicMurmurRhythm,
	holosystolicMurmurRhythm,
	clickLateSystolicMurmurRhythm,
	s4MidSysRhythm,
	s3HolosysMurmurRhythm,
	mitralOpeningSnapAndDiastolicMurmurRhythm,
	aorticNormalS1S2Rhythm,
	aorticSystolicMurmurAbsentS2Rhythm,
	aorticEarlyDiastolicMurmurRhythm,
	aorticSystolicDiastolicMurmurRhythm
];