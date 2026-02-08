import * as THREE from "three";

interface BlendshapeCategory {
  categoryName: string;
  score: number;
}

interface BlendshapeData {
  categories: BlendshapeCategory[];
}

/**
 * AnimationController - Singleton managing blendshape animation on 3D meshes
 * Handles morph target interpolation and application
 */
export class AnimationController {
  private static instance: AnimationController;

  private morphTargetMeshes: THREE.Mesh[] = [];
  private currentBlendshapes: Map<string, number> = new Map();
  private targetBlendshapes: Map<string, number> = new Map();

  // Heart chamber names mapping
  public readonly CHAMBER_NAMES = {
    LA: "LA",
    RA: "RA",
    LV: "LV",
    RV: "RV",
  };

  private constructor() {
    // Initialize default blendshape values
    Object.values(this.CHAMBER_NAMES).forEach((name) => {
      this.currentBlendshapes.set(name, 0);
      this.targetBlendshapes.set(name, 0);
    });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AnimationController {
    if (!AnimationController.instance) {
      AnimationController.instance = new AnimationController();
    }
    return AnimationController.instance;
  }

  /**
   * Initialize with morph target meshes
   */
  public initialize(meshes: THREE.Mesh[]): void {
    this.morphTargetMeshes = meshes;
  }

  /**
   * Set target blendshape value for interpolation
   */
  public setTargetBlendshape(name: string, value: number): void {
    this.targetBlendshapes.set(name, value);
  }

  /**
   * Reset all target blendshapes to 0
   */
  public resetTargets(): void {
    for (const chamberName of Object.values(this.CHAMBER_NAMES)) {
      this.targetBlendshapes.set(chamberName, 0);
    }
  }

  /**
   * Interpolate current values toward target values
   */
  public applyLerp(factor: number): void {
    for (const [name, target] of this.targetBlendshapes) {
      const current = this.currentBlendshapes.get(name) || 0;
      const newValue = this.lerp(current, target, factor);
      this.currentBlendshapes.set(name, newValue);
    }
  }

  /**
   * Apply current blendshape values to meshes
   */
  public applyToMeshes(): void {
    for (const mesh of this.morphTargetMeshes) {
      if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
        continue;
      }

      for (const [name, value] of this.currentBlendshapes) {
        if (!Object.keys(mesh.morphTargetDictionary).includes(name)) {
          continue;
        }

        const idx = mesh.morphTargetDictionary[name];
        if (typeof idx === "number" && mesh.morphTargetInfluences) {
          mesh.morphTargetInfluences[idx] = value;
        }
      }
    }
  }

  /**
   * Apply external blendshape data (e.g., from MediaPipe)
   */
  public applyExternalBlendshapes(blendshapes: BlendshapeData): void {
    const coefsMap = new Map<string, number>();

    for (const category of blendshapes.categories) {
      coefsMap.set(category.categoryName, category.score);
    }

    for (const mesh of this.morphTargetMeshes) {
      if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
        continue;
      }

      for (const [name, value] of coefsMap) {
        if (!Object.keys(mesh.morphTargetDictionary).includes(name)) {
          continue;
        }

        const idx = mesh.morphTargetDictionary[name];
        if (typeof idx === "number" && mesh.morphTargetInfluences) {
          mesh.morphTargetInfluences[idx] = value;
        }
      }
    }
  }

  /**
   * Linear interpolation helper
   */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
}
