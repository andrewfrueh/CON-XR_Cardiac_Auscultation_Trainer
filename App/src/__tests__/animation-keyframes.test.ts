import { defaultAnimation } from "../heart/heartRhythms/config/animation-keyframes";
import { MotionCurves } from "../utils/curves";

describe("animation-keyframes", () => {
  describe("defaultAnimation", () => {
    it("is a non-empty array", () => {
      expect(Array.isArray(defaultAnimation)).toBe(true);
      expect(defaultAnimation.length).toBeGreaterThan(0);
    });

    it("has 5 keyframes", () => {
      expect(defaultAnimation).toHaveLength(5);
    });

    it("every keyframe has required fields", () => {
      for (const kf of defaultAnimation) {
        expect(typeof kf.time).toBe("number");
        expect(typeof kf.animationEnd).toBe("number");
        expect(Array.isArray(kf.blendshape)).toBe(true);
        expect(typeof kf.value).toBe("number");
        expect(typeof kf.curveFunction).toBe("function");
      }
    });

    it("time values are within [0, 1]", () => {
      for (const kf of defaultAnimation) {
        expect(kf.time).toBeGreaterThanOrEqual(0);
        expect(kf.time).toBeLessThanOrEqual(1.0);
      }
    });

    it("animationEnd values are within [0, 1]", () => {
      for (const kf of defaultAnimation) {
        expect(kf.animationEnd).toBeGreaterThanOrEqual(0);
        expect(kf.animationEnd).toBeLessThanOrEqual(1.0);
      }
    });

    it("animationEnd >= time for each keyframe", () => {
      for (const kf of defaultAnimation) {
        expect(kf.animationEnd).toBeGreaterThanOrEqual(kf.time);
      }
    });

    it("first keyframe is atrial contraction (LA, RA)", () => {
      const first = defaultAnimation[0];
      expect(first.blendshape).toContain("LA");
      expect(first.blendshape).toContain("RA");
      expect(first.curveFunction).toBe(MotionCurves.ATRIAL_CONTRACTION);
    });

    it("third keyframe is ventricular contraction (LV, RV)", () => {
      const third = defaultAnimation[2];
      expect(third.blendshape).toContain("LV");
      expect(third.blendshape).toContain("RV");
      expect(third.curveFunction).toBe(MotionCurves.VENTRICULAR_CONTRACTION);
    });

    it("uses DIASTOLIC_RELAXATION for relaxation phases", () => {
      const relaxKeyframes = defaultAnimation.filter(
        (kf) => kf.curveFunction === MotionCurves.DIASTOLIC_RELAXATION,
      );
      expect(relaxKeyframes.length).toBeGreaterThanOrEqual(2);
    });

    it("blendshape arrays only contain valid chamber names", () => {
      const validChambers = ["LA", "RA", "LV", "RV"];
      for (const kf of defaultAnimation) {
        for (const bs of kf.blendshape) {
          expect(validChambers).toContain(bs);
        }
      }
    });
  });
});
