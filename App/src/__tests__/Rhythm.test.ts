import {
  availableRhythms,
  defaultRhythm,
  SelectableRhythmName,
} from "../heart/heartRhythms/Rhythm";

const ALL_LOCATIONS = [
  "Aortic",
  "Pulmonic",
  "Tricuspid",
  "Mitral",
] as const;

describe("Rhythm (re-exports and data)", () => {
  describe("availableRhythms", () => {
    it("has entries for all 4 locations", () => {
      for (const loc of ALL_LOCATIONS) {
        expect(availableRhythms[loc]).toBeDefined();
      }
    });

    it("each location has a NormalS1S2 rhythm", () => {
      for (const loc of ALL_LOCATIONS) {
        expect(availableRhythms[loc].NormalS1S2).toBeDefined();
      }
    });

    it("locations have matching location fields in their rhythms", () => {
      for (const loc of ALL_LOCATIONS) {
        for (const rhythm of Object.values(availableRhythms[loc])) {
          expect(rhythm.location).toBe(loc);
        }
      }
    });
  });

  describe("defaultRhythm", () => {
    it("is Aortic NormalS1S2", () => {
      expect(defaultRhythm).toBe(availableRhythms.Aortic.NormalS1S2);
    });

    it("has animation keyframes", () => {
      expect(defaultRhythm.animation).toBeDefined();
      expect(defaultRhythm.animation!.length).toBeGreaterThan(0);
    });

    it("has sound keyframes", () => {
      expect(defaultRhythm.sound).toBeDefined();
      expect(defaultRhythm.sound!.length).toBeGreaterThan(0);
    });

    it("location is Aortic", () => {
      expect(defaultRhythm.location).toBe("Aortic");
    });
  });

  describe("SelectableRhythmName", () => {
    it("maps rhythm keys to display strings", () => {
      expect(typeof SelectableRhythmName.NormalS1S2).toBe("string");
      expect(typeof SelectableRhythmName.S3Gallop).toBe("string");
    });

    it("NormalS1S2 display name is 'Normal S1 S2'", () => {
      expect(SelectableRhythmName.NormalS1S2).toBe("Normal S1 S2");
    });
  });
});
