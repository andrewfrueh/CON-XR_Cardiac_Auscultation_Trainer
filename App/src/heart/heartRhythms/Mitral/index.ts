import { mitralNormalS1S2Rhythm } from "./NormalS1S2.js";
import { mitralMidSystolicClickRhythm } from "./Mid-SystolicClick.js";
import { mitralEarlySystolicMurmurRhythm } from "./EarlySystolicMurmur.js";
import { mitralMidSystolicMurmurRhythm } from "./Mid-SystolicMurmur.js";
import { mitralLateSystolicMurmurRhythm } from "./LateSystolicMurmur.js";
import { mitralClickLateSystolicMurmurRhythm } from "./Click-Late-SystolicMurmur.js";
import { mitralOpeningSnapAndDiastolicMurmurRhythm } from "./MitralOpeningSnap&DiastolicMurmur.js";
import { mitralS4MidSysRhythm } from "./S4&Mid-SysMurmur.js";
import { mitralS3HolosysMurmurRhythm } from "./S3&HolosysMurmur.js";
import { mitralHolosystolicMurmurRhythm } from "./HolosystolicMurmur.js";
import { mitralS3GallopRhythm } from "./S3Gallop.js";
import { mitralS4GallopRhythm } from "./S4Gallop.js";
import { AuscultationRhythms } from "../Rhythm.js";

export const mitralRhythms: AuscultationRhythms = {
    NormalS1S2: mitralNormalS1S2Rhythm,
    S3Gallop: mitralS3GallopRhythm,
    S4Gallop: mitralS4GallopRhythm,
    MidSystolicClick: mitralMidSystolicClickRhythm,
    EarlySystolicMurmur: mitralEarlySystolicMurmurRhythm,
    MidSystolicMurmur: mitralMidSystolicMurmurRhythm,
    LateSystolicMurmur: mitralLateSystolicMurmurRhythm,
    ClickLateSystolicMurmur: mitralClickLateSystolicMurmurRhythm,
};