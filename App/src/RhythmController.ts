import {
  defaultRhythm,
  Rhythm,
  availableRhythms,
  AuscultationRhythms,
  SelectableRhythm,
  AuscultationLocation,
} from "./heart/heartRhythms/Rhythm.js";

/**
 * RhythmController - Singleton managing rhythm patterns and auscultation locations
 */
export class RhythmController {
  private static instance: RhythmController;

  private rhythm: Rhythm = defaultRhythm;
  private selectableName: SelectableRhythm = "NormalS1S2";
  private auscultationLocation: AuscultationLocation = "Aortic";

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): RhythmController {
    if (!RhythmController.instance) {
      RhythmController.instance = new RhythmController();
    }
    return RhythmController.instance;
  }

  /**
   * Switch to a different rhythm pattern
   */
  public switchToRhythm(rhythm: SelectableRhythm): void {
    const rhythmObject = availableRhythms[this.auscultationLocation][rhythm];
    this.selectableName = rhythm;
    this.rhythm = rhythmObject;
  }

  /**
   * Set the auscultation location
   */
  public setAuscultationLocation(location: AuscultationLocation): void {
    this.auscultationLocation = location;
    this.rhythm = availableRhythms[location][this.selectableName];
  }

  /**
   * Get current rhythm object
   */
  public getRhythm(): Rhythm {
    return this.rhythm;
  }

  /**
   * Get available rhythm patterns for current location
   */
  public getAvailableRhythms(): AuscultationRhythms {
    return availableRhythms[this.rhythm.location];
  }

  /**
   * Get current rhythm name
   */
  public getCurrentRhythmName(): string {
    return this.selectableName;
  }

  /**
   * Get current auscultation location
   */
  public getAuscultationLocation(): AuscultationLocation {
    return this.auscultationLocation;
  }
}
