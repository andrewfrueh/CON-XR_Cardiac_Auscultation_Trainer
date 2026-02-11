import {
  createRhythm,
  createAllRhythms,
  getRhythmDisplayName,
  getAllRhythmDisplayNames,
} from "../heart/heartRhythms/config/rhythm-factory";
import { rhythmTemplates } from "../heart/heartRhythms/config/rhythm-templates";

const ALL_LOCATIONS = [
  "Aortic",
  "Pulmonic",
  "Tricuspid",
  "Mitral",
] as const;

describe("rhythm-factory", () => {
  // ---------- createRhythm ----------
  describe("createRhythm()", () => {
    it("creates a rhythm with the correct location", () => {
      const rhythm = createRhythm("NormalS1S2", "Mitral");
      expect(rhythm.location).toBe("Mitral");
    });

    it("creates a rhythm with sound keyframes", () => {
      const rhythm = createRhythm("NormalS1S2", "Aortic");
      expect(rhythm.sound).toBeDefined();
      expect(rhythm.sound!.length).toBeGreaterThan(0);
    });

    it("includes animation keyframes (shared default)", () => {
      const rhythm = createRhythm("NormalS1S2", "Aortic");
      expect(rhythm.animation).toBeDefined();
      expect(rhythm.animation!.length).toBeGreaterThan(0);
    });

    it("applies location-specific sound paths", () => {
      const aortic = createRhythm("NormalS1S2", "Aortic");
      const mitral = createRhythm("NormalS1S2", "Mitral");

      // Aortic uses different S1/S2 files
      const aorticS1Path = aortic.sound!.find((s) =>
        s.soundPath.includes("aorticS1"),
      );
      expect(aorticS1Path).toBeDefined();

      const mitralS1Path = mitral.sound!.find((s) =>
        s.soundPath.includes("heart-normal-S1"),
      );
      expect(mitralS1Path).toBeDefined();
    });

    it("preserves envelope on murmur sounds", () => {
      const rhythm = createRhythm("MidSystolicMurmur", "Aortic");
      const murmurSound = rhythm.sound!.find(
        (s) => s.envelope !== undefined,
      );
      expect(murmurSound).toBeDefined();
      expect(murmurSound!.envelope!.attack).toBeGreaterThanOrEqual(0);
    });

    it("throws for an unknown rhythm name", () => {
      expect(() => createRhythm("NonExistent" as any, "Aortic")).toThrow(
        "Unknown rhythm",
      );
    });

    it("applies volume multipliers from templates", () => {
      const rhythm = createRhythm("S3Gallop", "Mitral");
      // S3Gallop template has volumeMultiplier: 2 for S3
      const s3 = rhythm.sound!.find((s) =>
        s.soundPath.includes("s3"),
      );
      expect(s3).toBeDefined();
      // Mitral S3 override: 1.5, multiplied by template's 2 = 3.0
      expect(s3!.volume).toBeCloseTo(3.0);
    });
  });

  // ---------- createAllRhythms ----------
  describe("createAllRhythms()", () => {
    it("returns rhythms for all 4 locations", () => {
      const all = createAllRhythms();
      for (const loc of ALL_LOCATIONS) {
        expect(all[loc]).toBeDefined();
      }
    });

    it("each location contains all rhythm templates", () => {
      const all = createAllRhythms();
      const expectedNames = Object.keys(rhythmTemplates);

      for (const loc of ALL_LOCATIONS) {
        for (const name of expectedNames) {
          expect(all[loc][name]).toBeDefined();
          expect(all[loc][name].location).toBe(loc);
        }
      }
    });

    it("every generated rhythm has sound keyframes", () => {
      const all = createAllRhythms();
      for (const loc of ALL_LOCATIONS) {
        for (const rhythm of Object.values(all[loc])) {
          expect(rhythm.sound).toBeDefined();
          expect(rhythm.sound!.length).toBeGreaterThan(0);
        }
      }
    });
  });

  // ---------- getRhythmDisplayName ----------
  describe("getRhythmDisplayName()", () => {
    it("returns the display name for NormalS1S2", () => {
      expect(getRhythmDisplayName("NormalS1S2")).toBe("Normal S1 S2");
    });

    it("returns the display name for S3Gallop", () => {
      expect(getRhythmDisplayName("S3Gallop")).toBe("S3 Gallop");
    });

    it("falls back to the key name for unknown rhythms", () => {
      expect(getRhythmDisplayName("FakeRhythm" as any)).toBe("FakeRhythm");
    });
  });

  // ---------- getAllRhythmDisplayNames ----------
  describe("getAllRhythmDisplayNames()", () => {
    it("returns a record with all rhythm names", () => {
      const names = getAllRhythmDisplayNames();
      const keys = Object.keys(rhythmTemplates);
      for (const key of keys) {
        expect(names[key as keyof typeof names]).toBeDefined();
        expect(typeof names[key as keyof typeof names]).toBe("string");
      }
    });
  });
});
