import {
  locationModifiers,
  getLocationConfig,
} from "../heart/heartRhythms/config/location-modifiers";

const ALL_LOCATIONS = [
  "Mitral",
  "Aortic",
  "Pulmonic",
  "Tricuspid",
] as const;

const ALL_SOUND_KEYS = [
  "S1",
  "S2",
  "S3",
  "S4",
  "Click",
  "SystolicMurmur",
  "HolosystolicMurmur",
  "EarlyDiastolicMurmur",
] as const;

describe("location-modifiers", () => {
  describe("locationModifiers", () => {
    it("defines configs for all four auscultation locations", () => {
      for (const loc of ALL_LOCATIONS) {
        expect(locationModifiers[loc]).toBeDefined();
      }
    });

    it("every location has soundPaths for all sound keys", () => {
      for (const loc of ALL_LOCATIONS) {
        const config = locationModifiers[loc];
        for (const key of ALL_SOUND_KEYS) {
          expect(typeof config.soundPaths[key]).toBe("string");
          expect(config.soundPaths[key].length).toBeGreaterThan(0);
        }
      }
    });

    it("Mitral is the reference location with volume 1.0 and pitch 1.0", () => {
      const mitral = locationModifiers.Mitral;
      expect(mitral.defaultVolume).toBe(1.0);
      expect(mitral.defaultPitch).toBe(1.0);
    });

    it("Tricuspid has lower default pitch (0.9)", () => {
      const tri = locationModifiers.Tricuspid;
      expect(tri.defaultPitch).toBe(0.9);
    });

    it("Tricuspid has lower default volume (0.7)", () => {
      const tri = locationModifiers.Tricuspid;
      expect(tri.defaultVolume).toBe(0.7);
    });

    it("Aortic has S3/S4/Click attenuated and SystolicMurmur boosted", () => {
      const overrides = locationModifiers.Aortic.soundOverrides!;
      expect(overrides.S3!.volume).toBeLessThan(1.0);
      expect(overrides.S4!.volume).toBeLessThan(1.0);
      expect(overrides.Click!.volume).toBeLessThan(1.0);
      expect(overrides.SystolicMurmur!.volume).toBeGreaterThan(1.0);
    });

    it("Pulmonic has S2 boosted and S1 reduced", () => {
      const overrides = locationModifiers.Pulmonic.soundOverrides!;
      expect(overrides.S2!.volume).toBeGreaterThan(1.0);
      expect(overrides.S1!.volume).toBeLessThan(1.0);
    });

    it("sound paths point to .wav files", () => {
      for (const loc of ALL_LOCATIONS) {
        for (const key of ALL_SOUND_KEYS) {
          expect(locationModifiers[loc].soundPaths[key]).toMatch(/\.wav$/);
        }
      }
    });
  });

  describe("getLocationConfig()", () => {
    it("returns the correct config for a known location", () => {
      const config = getLocationConfig("Aortic");
      expect(config).toBe(locationModifiers.Aortic);
    });

    it("returns Mitral config as fallback for unknown locations", () => {
      const config = getLocationConfig("Unknown" as any);
      expect(config).toBe(locationModifiers.Mitral);
    });

    it.each(ALL_LOCATIONS)(
      "returns the config for %s",
      (loc) => {
        const config = getLocationConfig(loc);
        expect(config).toBe(locationModifiers[loc]);
      },
    );
  });
});
