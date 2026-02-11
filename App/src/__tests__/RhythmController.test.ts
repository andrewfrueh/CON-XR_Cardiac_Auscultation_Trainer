import { RhythmController } from "../RhythmController";

// Import the rhythm data for assertions
import {
  availableRhythms,
  defaultRhythm,
} from "../heart/heartRhythms/Rhythm";

function resetRhythmController(): void {
  (RhythmController as any).instance = undefined;
}

describe("RhythmController", () => {
  beforeEach(() => {
    resetRhythmController();
  });

  // ---------- Singleton ----------
  describe("singleton", () => {
    it("returns the same instance", () => {
      expect(RhythmController.getInstance()).toBe(
        RhythmController.getInstance(),
      );
    });
  });

  // ---------- Default State ----------
  describe("default state", () => {
    it("defaults to NormalS1S2 rhythm", () => {
      const ctrl = RhythmController.getInstance();
      expect(ctrl.getCurrentRhythmName()).toBe("NormalS1S2");
    });

    it("defaults to Aortic location", () => {
      const ctrl = RhythmController.getInstance();
      expect(ctrl.getAuscultationLocation()).toBe("Aortic");
    });

    it("returns a valid default rhythm object", () => {
      const ctrl = RhythmController.getInstance();
      const rhythm = ctrl.getRhythm();
      expect(rhythm).toBeDefined();
      expect(rhythm.location).toBe("Aortic");
    });
  });

  // ---------- switchToRhythm ----------
  describe("switchToRhythm()", () => {
    it("switches to S3Gallop", () => {
      const ctrl = RhythmController.getInstance();
      ctrl.switchToRhythm("S3Gallop");
      expect(ctrl.getCurrentRhythmName()).toBe("S3Gallop");
      expect(ctrl.getRhythm()).toBe(
        availableRhythms["Aortic"]["S3Gallop"],
      );
    });

    it("switches to S4Gallop", () => {
      const ctrl = RhythmController.getInstance();
      ctrl.switchToRhythm("S4Gallop");
      expect(ctrl.getCurrentRhythmName()).toBe("S4Gallop");
    });

    it("preserves auscultation location when switching rhythm", () => {
      const ctrl = RhythmController.getInstance();
      ctrl.setAuscultationLocation("Mitral");
      ctrl.switchToRhythm("S3Gallop");
      expect(ctrl.getAuscultationLocation()).toBe("Mitral");
      expect(ctrl.getRhythm().location).toBe("Mitral");
    });
  });

  // ---------- setAuscultationLocation ----------
  describe("setAuscultationLocation()", () => {
    it("changes location to Mitral", () => {
      const ctrl = RhythmController.getInstance();
      ctrl.setAuscultationLocation("Mitral");
      expect(ctrl.getAuscultationLocation()).toBe("Mitral");
      expect(ctrl.getRhythm().location).toBe("Mitral");
    });

    it("changes location to Pulmonic", () => {
      const ctrl = RhythmController.getInstance();
      ctrl.setAuscultationLocation("Pulmonic");
      expect(ctrl.getAuscultationLocation()).toBe("Pulmonic");
    });

    it("changes location to Tricuspid", () => {
      const ctrl = RhythmController.getInstance();
      ctrl.setAuscultationLocation("Tricuspid");
      expect(ctrl.getAuscultationLocation()).toBe("Tricuspid");
    });

    it("preserves rhythm selection when changing location", () => {
      const ctrl = RhythmController.getInstance();
      ctrl.switchToRhythm("S3Gallop");
      ctrl.setAuscultationLocation("Pulmonic");
      expect(ctrl.getCurrentRhythmName()).toBe("S3Gallop");
      expect(ctrl.getRhythm().location).toBe("Pulmonic");
    });
  });

  // ---------- getAvailableRhythms ----------
  describe("getAvailableRhythms()", () => {
    it("returns rhythms for the current location", () => {
      const ctrl = RhythmController.getInstance();
      const rhythms = ctrl.getAvailableRhythms();
      expect(rhythms).toBeDefined();
      expect(rhythms.NormalS1S2).toBeDefined();
      expect(rhythms.S3Gallop).toBeDefined();
    });

    it("returns different rhythm objects for different locations", () => {
      const ctrl = RhythmController.getInstance();
      const aortic = ctrl.getAvailableRhythms();

      ctrl.setAuscultationLocation("Mitral");
      const mitral = ctrl.getAvailableRhythms();

      // Both should have NormalS1S2 but with different location data
      expect(aortic.NormalS1S2.location).toBe("Aortic");
      expect(mitral.NormalS1S2.location).toBe("Mitral");
    });
  });
});
