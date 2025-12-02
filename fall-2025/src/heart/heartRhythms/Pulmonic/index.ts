import { AuscultationRhythms } from "../Rhythm.js"
import {pulmonicClickLateSystolicMurmurRhythm} from "./Click-Late-SystolicMurmur.js"
import {pulmonicEarlySystolicMurmurRhythm} from "./EarlySystolicMurmur.js"
import {pulmonicLateSystolicMurmurRhythm} from "./LateSystolicMurmur.js"
import {pulmonicMidSystolicClickRhythm} from "./Mid-SystolicClick.js"
import {pulmonicMidSystolicMurmurRhythm} from "./Mid-SystolicMurmur.js"
import {pulmonicNormalS1S2Rhythm} from "./NormalS1S2.js"
import {pulmonicS3Gallop} from "./S3Gallop.js"
import {pulmonicS4Gallop} from "./S4Gallop.js"

export const pulmonicRhythms: AuscultationRhythms = {
    NormalS1S2: pulmonicNormalS1S2Rhythm,
    S3Gallop: pulmonicS3Gallop,
    S4Gallop: pulmonicS4Gallop,
    MidSystolicClick: pulmonicMidSystolicClickRhythm,
    EarlySystolicMurmur: pulmonicEarlySystolicMurmurRhythm,
    MidSystolicMurmur: pulmonicMidSystolicMurmurRhythm,
    LateSystolicMurmur: pulmonicLateSystolicMurmurRhythm,
    ClickLateSystolicMurmur: pulmonicClickLateSystolicMurmurRhythm,
};