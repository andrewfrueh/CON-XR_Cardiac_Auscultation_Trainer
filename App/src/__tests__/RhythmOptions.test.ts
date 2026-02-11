import {
  getRhythmOptionsForLocation,
  getAllRhythmGroups,
} from "../heart/RhythmOptions";
import { rhythmTemplates } from "../heart/heartRhythms/config/rhythm-templates";

describe("RhythmOptions", () => {
  describe("getRhythmOptionsForLocation()", () => {
    it("returns options for Aortic location", () => {
      const options = getRhythmOptionsForLocation("Aortic");
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
    });

    it("each option has value and label", () => {
      const options = getRhythmOptionsForLocation("Mitral");
      for (const opt of options) {
        expect(typeof opt.value).toBe("string");
        expect(typeof opt.label).toBe("string");
      }
    });

    it("includes NormalS1S2 in options", () => {
      const options = getRhythmOptionsForLocation("Aortic");
      const names = options.map((o) => o.value);
      expect(names).toContain("NormalS1S2");
    });

    it("returns options matching the number of rhythm templates", () => {
      const options = getRhythmOptionsForLocation("Mitral");
      expect(options.length).toBe(Object.keys(rhythmTemplates).length);
    });
  });

  describe("getAllRhythmGroups()", () => {
    it("returns groups for all 4 locations", () => {
      const groups = getAllRhythmGroups();
      expect(groups["Aortic"]).toBeDefined();
      expect(groups["Pulmonic"]).toBeDefined();
      expect(groups["Tricuspid"]).toBeDefined();
      expect(groups["Mitral"]).toBeDefined();
    });

    it("each group has the same number of options", () => {
      const groups = getAllRhythmGroups();
      const expectedCount = Object.keys(rhythmTemplates).length;
      for (const group of Object.values(groups)) {
        expect(group.length).toBe(expectedCount);
      }
    });

    it("returns only 4 location groups", () => {
      const groups = getAllRhythmGroups();
      expect(Object.keys(groups)).toHaveLength(4);
    });
  });
});
