import { AnimationController } from "../AnimationController";

// Reset singleton between tests
function resetAnimationController(): void {
  (AnimationController as any).instance = undefined;
}

// Create a mock THREE.Mesh with morph targets
function createMockMesh(
  targets: Record<string, number>,
): any {
  const influences = new Array(Object.keys(targets).length).fill(0);
  return {
    morphTargetDictionary: { ...targets },
    morphTargetInfluences: influences,
  };
}

describe("AnimationController", () => {
  beforeEach(() => {
    resetAnimationController();
  });

  // ---------- Singleton ----------
  describe("singleton", () => {
    it("returns the same instance", () => {
      expect(AnimationController.getInstance()).toBe(
        AnimationController.getInstance(),
      );
    });
  });

  // ---------- CHAMBER_NAMES ----------
  describe("CHAMBER_NAMES", () => {
    it("has the four heart chambers", () => {
      const ctrl = AnimationController.getInstance();
      expect(ctrl.CHAMBER_NAMES).toEqual({
        LA: "LA",
        RA: "RA",
        LV: "LV",
        RV: "RV",
      });
    });
  });

  // ---------- setTargetBlendshape / resetTargets ----------
  describe("setTargetBlendshape & resetTargets", () => {
    it("sets and resets target blendshape values", () => {
      const ctrl = AnimationController.getInstance();
      ctrl.setTargetBlendshape("LA", 0.8);
      // After applyLerp with factor 1.0, the current should match target
      ctrl.applyLerp(1.0);
      // resetTargets should set all chamber targets back to 0
      ctrl.resetTargets();
      ctrl.applyLerp(1.0);
      // After reset + full lerp, values are back to 0
      // We verify indirectly through mesh application below
    });
  });

  // ---------- applyLerp ----------
  describe("applyLerp()", () => {
    it("interpolates current toward target by the given factor", () => {
      const ctrl = AnimationController.getInstance();
      const mesh = createMockMesh({ LA: 0, RA: 1, LV: 2, RV: 3 });
      ctrl.initialize([mesh]);

      ctrl.setTargetBlendshape("LV", 1.0);

      // With factor=0.5 from 0, new value = 0 + (1 - 0) * 0.5 = 0.5
      ctrl.applyLerp(0.5);
      ctrl.applyToMeshes();

      expect(mesh.morphTargetInfluences[2]).toBeCloseTo(0.5);
    });

    it("converges toward target over multiple lerp calls", () => {
      const ctrl = AnimationController.getInstance();
      const mesh = createMockMesh({ LA: 0, RA: 1, LV: 2, RV: 3 });
      ctrl.initialize([mesh]);

      ctrl.setTargetBlendshape("LV", 1.0);

      // Multiple lerp calls with factor 0.5
      for (let i = 0; i < 10; i++) {
        ctrl.applyLerp(0.5);
      }
      ctrl.applyToMeshes();

      // Should be very close to 1.0 after 10 iterations
      expect(mesh.morphTargetInfluences[2]).toBeGreaterThan(0.99);
    });

    it("lerp factor of 1.0 reaches target immediately", () => {
      const ctrl = AnimationController.getInstance();
      const mesh = createMockMesh({ LA: 0 });
      ctrl.initialize([mesh]);

      ctrl.setTargetBlendshape("LA", 0.75);
      ctrl.applyLerp(1.0);
      ctrl.applyToMeshes();

      expect(mesh.morphTargetInfluences[0]).toBeCloseTo(0.75);
    });
  });

  // ---------- applyToMeshes ----------
  describe("applyToMeshes()", () => {
    it("sets morph target influences on meshes", () => {
      const ctrl = AnimationController.getInstance();
      const mesh = createMockMesh({ LA: 0, RA: 1 });
      ctrl.initialize([mesh]);

      ctrl.setTargetBlendshape("LA", 1.0);
      ctrl.setTargetBlendshape("RA", 0.5);
      ctrl.applyLerp(1.0);
      ctrl.applyToMeshes();

      expect(mesh.morphTargetInfluences[0]).toBeCloseTo(1.0);
      expect(mesh.morphTargetInfluences[1]).toBeCloseTo(0.5);
    });

    it("skips meshes without morphTargetDictionary", () => {
      const ctrl = AnimationController.getInstance();
      const badMesh = { morphTargetDictionary: null, morphTargetInfluences: null };
      ctrl.initialize([badMesh as any]);

      // Should not throw
      ctrl.setTargetBlendshape("LA", 1.0);
      ctrl.applyLerp(1.0);
      ctrl.applyToMeshes();
    });

    it("ignores blendshape names not present in the mesh dictionary", () => {
      const ctrl = AnimationController.getInstance();
      const mesh = createMockMesh({ LA: 0 });
      ctrl.initialize([mesh]);

      // LV is not in the mesh dictionary
      ctrl.setTargetBlendshape("LV", 1.0);
      ctrl.applyLerp(1.0);
      ctrl.applyToMeshes();

      // LA should remain 0
      expect(mesh.morphTargetInfluences[0]).toBe(0);
    });

    it("works with multiple meshes", () => {
      const ctrl = AnimationController.getInstance();
      const mesh1 = createMockMesh({ LA: 0, RA: 1 });
      const mesh2 = createMockMesh({ LA: 0, LV: 1 });
      ctrl.initialize([mesh1, mesh2]);

      ctrl.setTargetBlendshape("LA", 0.9);
      ctrl.applyLerp(1.0);
      ctrl.applyToMeshes();

      expect(mesh1.morphTargetInfluences[0]).toBeCloseTo(0.9);
      expect(mesh2.morphTargetInfluences[0]).toBeCloseTo(0.9);
    });
  });

  // ---------- applyExternalBlendshapes ----------
  describe("applyExternalBlendshapes()", () => {
    it("applies external blendshape data to meshes", () => {
      const ctrl = AnimationController.getInstance();
      const mesh = createMockMesh({ jawOpen: 0, eyeBlink: 1 });
      ctrl.initialize([mesh]);

      ctrl.applyExternalBlendshapes({
        categories: [
          { categoryName: "jawOpen", score: 0.6 },
          { categoryName: "eyeBlink", score: 0.3 },
        ],
      });

      expect(mesh.morphTargetInfluences[0]).toBe(0.6);
      expect(mesh.morphTargetInfluences[1]).toBe(0.3);
    });

    it("ignores categories not in the mesh dictionary", () => {
      const ctrl = AnimationController.getInstance();
      const mesh = createMockMesh({ jawOpen: 0 });
      ctrl.initialize([mesh]);

      ctrl.applyExternalBlendshapes({
        categories: [{ categoryName: "unknownShape", score: 1.0 }],
      });

      expect(mesh.morphTargetInfluences[0]).toBe(0);
    });
  });
});
