import { CurveFunction } from "../../utils/curves.js";
import { normalS1S2Rhythm } from "./NormalS1S2.js";
import { s4GallopRhythm } from "./S4Gallop.js";
import { s3GallopRhythm } from "./S3Gallop.js";
import { midSystolicClickRhythm } from "./Mid-SystolicClick.js";
import { midSystolicMurmurRhythm } from "./Mid-SystolicMurmur.js"
import { splitS1Rhythm } from "./SplitS1.js"
import { earlySystolicMurmurRhythm } from "./EarlySystolicMurmur.js";
import { lateSystolicMurmurRhythm } from "./LateSystolicMurmur.js";
import { holosystolicMurmurRhythm } from "./HolosystolicMurmur.js";
import { clickLateSystolicMurmurRhythm } from "./Click-Late-SystolicMurmur.js";

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
	s4GallopRhythm,
	s3GallopRhythm,
	midSystolicClickRhythm,
	splitS1Rhythm,
	midSystolicMurmurRhythm,
	earlySystolicMurmurRhythm,
	lateSystolicMurmurRhythm,
	holosystolicMurmurRhythm,
	clickLateSystolicMurmurRhythm
];