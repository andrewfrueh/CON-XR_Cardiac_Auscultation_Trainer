import { MotionCurves } from "../utils/curves";

describe("MotionCurves", () => {
  // ======================== BELL CURVE ========================
  describe("BELL (smoothstep)", () => {
    it("returns 0 at t=0", () => {
      expect(MotionCurves.BELL(0)).toBe(0);
    });

    it("returns 1 at t=1", () => {
      expect(MotionCurves.BELL(1)).toBe(1);
    });

    it("returns 0.5 at t=0.5", () => {
      expect(MotionCurves.BELL(0.5)).toBe(0.5);
    });

    it("is monotonically non-decreasing between 0 and 1", () => {
      let prev = MotionCurves.BELL(0);
      for (let t = 0.01; t <= 1; t += 0.01) {
        const val = MotionCurves.BELL(t);
        expect(val).toBeGreaterThanOrEqual(prev - 1e-10);
        prev = val;
      }
    });

    it("output stays in [0, 1] range", () => {
      for (let t = 0; t <= 1; t += 0.05) {
        const val = MotionCurves.BELL(t);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1);
      }
    });
  });

  // ======================== BATHTUB CURVE ========================
  describe("BATHTUB (inverse smoothstep)", () => {
    it("returns 0 at t=0", () => {
      expect(MotionCurves.BATHTUB(0)).toBe(0);
    });

    it("returns 1.5 at t=1", () => {
      expect(MotionCurves.BATHTUB(1)).toBeCloseTo(1.5);
    });

    it("returns 0.5 at t=0.5", () => {
      expect(MotionCurves.BATHTUB(0.5)).toBe(0.5);
    });

    it("output stays in [0, 1.5] range", () => {
      for (let t = 0; t <= 1; t += 0.05) {
        const val = MotionCurves.BATHTUB(t);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1.5);
      }
    });
  });

  // ======================== LERP CURVE ========================
  describe("LERP (linear)", () => {
    it("returns the same value as input", () => {
      for (let t = 0; t <= 1; t += 0.1) {
        expect(MotionCurves.LERP(t)).toBeCloseTo(t);
      }
    });
  });

  // ======================== HEART CONTRACTION CURVE ========================
  describe("HEART_CONTRACTION", () => {
    it("returns 0 at t=0", () => {
      expect(MotionCurves.HEART_CONTRACTION(0)).toBe(0);
    });

    it("reaches 1.0 during sustained peak (t=0.4)", () => {
      expect(MotionCurves.HEART_CONTRACTION(0.4)).toBe(1.0);
    });

    it("stays at 1.0 during sustained peak (t=0.5)", () => {
      expect(MotionCurves.HEART_CONTRACTION(0.5)).toBe(1.0);
    });

    it("returns to 0 at t=1", () => {
      expect(MotionCurves.HEART_CONTRACTION(1)).toBeCloseTo(0, 1);
    });

    it("output stays in [0, 1] range", () => {
      for (let t = 0; t <= 1; t += 0.02) {
        const val = MotionCurves.HEART_CONTRACTION(t);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1.001);
      }
    });
  });

  // ======================== ATRIAL CONTRACTION CURVE ========================
  describe("ATRIAL_CONTRACTION", () => {
    it("returns 0 at t=0", () => {
      expect(MotionCurves.ATRIAL_CONTRACTION(0)).toBe(0);
    });

    it("peaks at 0.6 during brief peak phase", () => {
      expect(MotionCurves.ATRIAL_CONTRACTION(0.3)).toBeCloseTo(0.6);
    });

    it("returns to 0 at t=1", () => {
      expect(MotionCurves.ATRIAL_CONTRACTION(1)).toBeCloseTo(0);
    });

    it("output stays in [0, 0.6] range", () => {
      for (let t = 0; t <= 1; t += 0.02) {
        const val = MotionCurves.ATRIAL_CONTRACTION(t);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(0.601);
      }
    });
  });

  // ======================== VENTRICULAR CONTRACTION CURVE ========================
  describe("VENTRICULAR_CONTRACTION", () => {
    it("returns 0 at t=0", () => {
      expect(MotionCurves.VENTRICULAR_CONTRACTION(0)).toBe(0);
    });

    it("reaches 1.0 during sustained peak (t=0.5)", () => {
      expect(MotionCurves.VENTRICULAR_CONTRACTION(0.5)).toBe(1.0);
    });

    it("returns to 0 at t=1", () => {
      expect(MotionCurves.VENTRICULAR_CONTRACTION(1)).toBeCloseTo(0, 1);
    });

    it("output stays in [0, 1] range", () => {
      for (let t = 0; t <= 1; t += 0.02) {
        const val = MotionCurves.VENTRICULAR_CONTRACTION(t);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1.001);
      }
    });
  });

  // ======================== DIASTOLIC RELAXATION CURVE ========================
  describe("DIASTOLIC_RELAXATION", () => {
    it("starts at 1.0 at t=0", () => {
      expect(MotionCurves.DIASTOLIC_RELAXATION(0)).toBeCloseTo(1.0);
    });

    it("remains above 0.7 at t=1 (only 30% movement)", () => {
      expect(MotionCurves.DIASTOLIC_RELAXATION(1)).toBeCloseTo(0.7);
    });

    it("output stays in [0.7, 1.0] range", () => {
      for (let t = 0; t <= 1; t += 0.02) {
        const val = MotionCurves.DIASTOLIC_RELAXATION(t);
        expect(val).toBeGreaterThanOrEqual(0.699);
        expect(val).toBeLessThanOrEqual(1.001);
      }
    });
  });

  // ======================== ALL CURVES: CurveFunction SIGNATURE ========================
  describe("all curves conform to CurveFunction signature", () => {
    const curves = Object.entries(MotionCurves);

    it.each(curves)("%s is a function taking a number", (name, fn) => {
      expect(typeof fn).toBe("function");
      expect(typeof fn(0.5)).toBe("number");
    });

    it.each(curves)("%s returns a finite number", (name, fn) => {
      expect(Number.isFinite(fn(0))).toBe(true);
      expect(Number.isFinite(fn(0.5))).toBe(true);
      expect(Number.isFinite(fn(1))).toBe(true);
    });
  });
});
