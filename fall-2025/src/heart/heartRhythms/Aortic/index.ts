import { aorticNormalS1S2Rhythm } from "./NormalS1S2.js";
import { aorticS3GallopRhythm } from "./S3Gallop.js";
import { aorticS4GallopRhythm } from "./S4Gallop.js";
import { aorticMidSystolicClickRhythm } from "./Mid-SystolicClick.js";
import { aorticEarlySystolicMurmurRhythm } from "./EarlySystolicMurmur.js";
import { aorticMidSystolicMurmurRhythm } from "./Mid-SystolicMurmur.js";
import { aorticLateSystolicMurmurRhythm } from "./LateSystolicMurmur.js";
import { aorticClickLateSystolicMurmurRhythm } from "./Click-Late-SystolicMurmur.js";
import { AuscultationRhythms } from "../Rhythm.js";

export const aorticRhythms: AuscultationRhythms = {
    NormalS1S2: aorticNormalS1S2Rhythm,
    S3Gallop: aorticS3GallopRhythm,
    S4Gallop: aorticS4GallopRhythm,
    MidSystolicClick: aorticMidSystolicClickRhythm,
    EarlySystolicMurmur: aorticEarlySystolicMurmurRhythm,
    MidSystolicMurmur: aorticMidSystolicMurmurRhythm,
    LateSystolicMurmur: aorticLateSystolicMurmurRhythm,
    ClickLateSystolicMurmur: aorticClickLateSystolicMurmurRhythm,
};