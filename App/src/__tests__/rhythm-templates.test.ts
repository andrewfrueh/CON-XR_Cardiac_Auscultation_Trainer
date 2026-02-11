import {
  rhythmTemplates,
  getAvailableRhythmNames,
} from "../heart/heartRhythms/config/rhythm-templates";

describe("rhythm-templates", () => {
  describe("rhythmTemplates", () => {
    it("contains NormalS1S2", () => {
      expect(rhythmTemplates.NormalS1S2).toBeDefined();
    });

    it("contains S3Gallop", () => {
      expect(rhythmTemplates.S3Gallop).toBeDefined();
    });

    it("contains S4Gallop", () => {
      expect(rhythmTemplates.S4Gallop).toBeDefined();
    });

    it("contains MidSystolicClick", () => {
      expect(rhythmTemplates.MidSystolicClick).toBeDefined();
    });

    it("contains all expected murmur rhythms", () => {
      expect(rhythmTemplates.EarlySystolicMurmur).toBeDefined();
      expect(rhythmTemplates.MidSystolicMurmur).toBeDefined();
      expect(rhythmTemplates.LateSystolicMurmur).toBeDefined();
      expect(rhythmTemplates.ClickLateSystolicMurmur).toBeDefined();
    });

    it("every template has a name, displayName, and sounds array", () => {
      for (const [key, template] of Object.entries(rhythmTemplates)) {
        expect(template.name).toBe(key);
        expect(typeof template.displayName).toBe("string");
        expect(Array.isArray(template.sounds)).toBe(true);
        expect(template.sounds.length).toBeGreaterThan(0);
      }
    });

    it("NormalS1S2 has exactly 2 sounds (S1 and S2)", () => {
      const normal = rhythmTemplates.NormalS1S2;
      expect(normal.sounds).toHaveLength(2);
      expect(normal.sounds[0].soundKey).toBe("S1");
      expect(normal.sounds[1].soundKey).toBe("S2");
    });

    it("S3Gallop has S1, S2, and S3", () => {
      const sounds = rhythmTemplates.S3Gallop.sounds;
      expect(sounds).toHaveLength(3);
      const keys = sounds.map((s) => s.soundKey);
      expect(keys).toContain("S1");
      expect(keys).toContain("S2");
      expect(keys).toContain("S3");
    });

    it("S4Gallop has S4, S1, and S2", () => {
      const sounds = rhythmTemplates.S4Gallop.sounds;
      expect(sounds).toHaveLength(3);
      const keys = sounds.map((s) => s.soundKey);
      expect(keys).toContain("S4");
      expect(keys).toContain("S1");
      expect(keys).toContain("S2");
    });

    it("sound event times are between 0 and 1", () => {
      for (const template of Object.values(rhythmTemplates)) {
        for (const event of template.sounds) {
          expect(event.time).toBeGreaterThanOrEqual(0);
          expect(event.time).toBeLessThanOrEqual(1);
        }
      }
    });

    it("murmur templates include envelopes", () => {
      const murmurRhythms = [
        "EarlySystolicMurmur",
        "MidSystolicMurmur",
        "LateSystolicMurmur",
        "ClickLateSystolicMurmur",
      ];
      for (const name of murmurRhythms) {
        const template = rhythmTemplates[name];
        const murmurSounds = template.sounds.filter(
          (s) => s.soundKey === "SystolicMurmur",
        );
        expect(murmurSounds.length).toBeGreaterThan(0);
        for (const s of murmurSounds) {
          expect(s.envelope).toBeDefined();
          expect(s.envelope!.attack).toBeGreaterThanOrEqual(0);
          expect(s.envelope!.sustain).toBeGreaterThan(0);
          expect(s.envelope!.decay).toBeGreaterThan(0);
          expect(s.envelope!.peakGain).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("getAvailableRhythmNames()", () => {
    it("returns all rhythm names as an array", () => {
      const names = getAvailableRhythmNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names).toContain("NormalS1S2");
      expect(names).toContain("S3Gallop");
      expect(names).toContain("S4Gallop");
      expect(names).toContain("MidSystolicClick");
    });

    it("matches the keys of rhythmTemplates", () => {
      const names = getAvailableRhythmNames();
      const keys = Object.keys(rhythmTemplates);
      expect(names.sort()).toEqual(keys.sort());
    });
  });
});
