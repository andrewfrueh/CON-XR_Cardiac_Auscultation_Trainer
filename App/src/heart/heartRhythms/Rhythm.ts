import { CurveFunction } from "../../utils/curves.js";
import { aorticNormalS1S2Rhythm } from "./Aortic/NormalS1S2.js";
import {aorticRhythms} from "./Aortic/index.js";
import {mitralRhythms} from "./Mitral/index.js";
import {pulmonicRhythms} from "./Pulmonic/index.js";
import {tricuspidRhythms} from "./Tricuspid/index.js";

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

export type AuscultationLocation = "Aortic" | "Pulmonic" | "Tricuspid" | "Mitral";

export type Rhythm = {
	animation?: AnimationKeyframe[];
	sound?: SoundKeyframe[];
	location: AuscultationLocation;
};

export const defaultRhythm = aorticNormalS1S2Rhythm;

export type SelectableRhythm = "ClickLateSystolicMurmur" | "EarlySystolicMurmur" | "LateSystolicMurmur" | "MidSystolicClick" | "MidSystolicMurmur" | "NormalS1S2" | "S3Gallop" | "S4Gallop";
export const SelectableRhythmName: Record<SelectableRhythm, string> = {
	ClickLateSystolicMurmur: "Click w/ Late Systolic Murmur",
	EarlySystolicMurmur: "Early Systolic Murmur",
	LateSystolicMurmur: "Late Systolic Murmur",
	MidSystolicClick: "Mid Systolic Click",
	MidSystolicMurmur: "Mid Systolic Murmur",
	NormalS1S2: "Normal S1 S2",
	S3Gallop: "S3 Gallop",
	S4Gallop: "S4 Gallop",
}

export type AuscultationRhythms = {
	[key in SelectableRhythm]: Rhythm;
}

export const availableRhythms: Record<AuscultationLocation, AuscultationRhythms> = {
    Aortic: aorticRhythms,
    Pulmonic: pulmonicRhythms,
    Tricuspid: tricuspidRhythms,
    Mitral: mitralRhythms,
};