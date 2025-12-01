import {tricuspidClickLateSystolicMurmurRhythm} from "./Click-Late-SystolicMurmur.js"
import {tricuspidEarlySystolicMurmurRhythm} from "./EarlySystolicMurmur.js"
import {tricuspidLateSystolicMurmurRhythm} from "./LateSystolicMurmur.js"
import {tricuspidMidSystolicClickRhythm} from "./Mid-SystolicClick.js"
import {tricuspidMidSystolicMurmurRhythm} from "./Mid-SystolicMurmur.js"
import {tricuspidNormalS1S2Rhythm} from "./NormalS1S2.js"
import {tricuspidS3GallopRhythm} from "./S3Gallop.js"
import {tricuspidS4GallopRhythm} from "./S4Gallop.js"

export const tricuspidRhythms = [
    tricuspidNormalS1S2Rhythm,
    tricuspidS3GallopRhythm,
    tricuspidS4GallopRhythm,
    tricuspidMidSystolicClickRhythm,
    tricuspidEarlySystolicMurmurRhythm,
    tricuspidMidSystolicMurmurRhythm,
    tricuspidLateSystolicMurmurRhythm,
    tricuspidClickLateSystolicMurmurRhythm,
];