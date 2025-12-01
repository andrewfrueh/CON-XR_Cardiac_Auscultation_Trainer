import { CurveFunction } from "../../utils/curves.js";
import { aorticNormalS1S2Rhythm } from "./Aortic/NormalS1S2.js";
import {aorticRhythms} from "./Aortic/index.js";
import {mitralRhythms} from "./Mitral/index.js";
import {pulmonicRhythms} from "./Pulmonic/index.js";

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

export const defaultRhythm = aorticNormalS1S2Rhythm;

export const availableRhythms: Rhythm[] = [
	...aorticRhythms,
	...mitralRhythms,
	...pulmonicRhythms,
];