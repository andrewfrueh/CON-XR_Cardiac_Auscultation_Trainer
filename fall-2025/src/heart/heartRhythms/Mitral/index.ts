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

export const mitralRhythms = [
    mitralNormalS1S2Rhythm,
    mitralS3GallopRhythm,
    mitralS4GallopRhythm,
    mitralMidSystolicClickRhythm,
    mitralEarlySystolicMurmurRhythm,
    mitralMidSystolicMurmurRhythm,
    mitralLateSystolicMurmurRhythm,
    mitralClickLateSystolicMurmurRhythm,
  // mitralOpeningSnapAndDiastolicMurmurRhythm,
  // mitralS4MidSysRhythm,
  // mitralS3HolosysMurmurRhythm,
  // mitralHolosystolicMurmurRhythm,
];