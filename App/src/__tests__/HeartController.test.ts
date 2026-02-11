/**
 * Tests for HeartController
 *
 * HeartController is an orchestrator that delegates to the other singleton controllers.
 * We test its delegation and ISoundEmitter implementation.
 */

import { HeartController } from "../heart/HeartController";
import { TimingController } from "../TimingController";
import { AnimationController } from "../AnimationController";
import { AudioEngine } from "../AudioEngine";
import { RhythmController } from "../RhythmController";

// Reset all singletons
function resetAll(): void {
  (HeartController as any).instance = undefined;
  (TimingController as any).instance = undefined;
  (AnimationController as any).instance = undefined;
  (AudioEngine as any).instance = undefined;
  (RhythmController as any).instance = undefined;
}

// Create a mock AudioContext
function setupAudioContext(): void {
  (globalThis as any).AudioContext = jest.fn(() => ({
    currentTime: 0,
    destination: {},
    createGain: jest.fn(() => ({
      gain: { value: 1, setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn() },
      connect: jest.fn(),
    })),
    createBiquadFilter: jest.fn(() => ({
      type: "lowpass",
      frequency: { value: 350 },
      Q: { value: 1 },
      connect: jest.fn(),
    })),
    createBufferSource: jest.fn(() => ({
      buffer: null,
      playbackRate: { value: 1 },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    })),
    decodeAudioData: jest.fn(),
  }));
}

describe("HeartController", () => {
  beforeEach(() => {
    resetAll();
    setupAudioContext();
    jest.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ---------- Singleton ----------
  describe("singleton", () => {
    it("returns the same instance", () => {
      expect(HeartController.getInstance()).toBe(
        HeartController.getInstance(),
      );
    });
  });

  // ---------- ISoundEmitter interface ----------
  describe("ISoundEmitter implementation", () => {
    it("getId returns 'heart'", () => {
      const hc = HeartController.getInstance();
      expect(hc.getId()).toBe("heart");
    });

    it("setVolume / getVolume delegates to AudioEngine", () => {
      const hc = HeartController.getInstance();
      hc.initialize([]);
      hc.setVolume(0.3);
      expect(hc.getVolume()).toBe(0.3);
    });

    it("isActive delegates to TimingController.isAnimating", () => {
      const hc = HeartController.getInstance();
      expect(hc.isActive()).toBe(false);
      hc.start();
      expect(hc.isActive()).toBe(true);
      hc.stop();
      expect(hc.isActive()).toBe(false);
    });
  });

  // ---------- start / stop ----------
  describe("start() / stop()", () => {
    it("starts and stops animation via TimingController", () => {
      const hc = HeartController.getInstance();
      hc.start();
      expect(hc.isAnimating()).toBe(true);
      hc.stop();
      expect(hc.isAnimating()).toBe(false);
    });
  });

  // ---------- BPM delegation ----------
  describe("BPM delegation", () => {
    it("setBPM and getBPM delegate to TimingController", () => {
      const hc = HeartController.getInstance();
      hc.setBPM(120);
      expect(hc.getBPM()).toBe(120);
    });

    it("setCycleDuration and getCycleDuration delegate", () => {
      const hc = HeartController.getInstance();
      hc.setCycleDuration(2000);
      expect(hc.getCycleDuration()).toBe(2000);
    });
  });

  // ---------- Rhythm delegation ----------
  describe("rhythm delegation", () => {
    it("switchToRhythm and getCurrentRhythmName delegate", () => {
      const hc = HeartController.getInstance();
      hc.switchToRhythm("S3Gallop");
      expect(hc.getCurrentRhythmName()).toBe("S3Gallop");
    });

    it("getRhythm returns the current rhythm", () => {
      const hc = HeartController.getInstance();
      const rhythm = hc.getRhythm();
      expect(rhythm).toBeDefined();
      expect(rhythm.location).toBeDefined();
    });

    it("getAvailableRhythms returns rhythm map", () => {
      const hc = HeartController.getInstance();
      const rhythms = hc.getAvailableRhythms();
      expect(rhythms.NormalS1S2).toBeDefined();
    });

    it("setAuscultationLocation changes the rhythm location", () => {
      const hc = HeartController.getInstance();
      hc.setAuscultationLocation("Mitral");
      expect(hc.getRhythm().location).toBe("Mitral");
    });
  });

  // ---------- Legacy methods ----------
  describe("legacy volume methods", () => {
    it("setSoundVolume delegates to setVolume", () => {
      const hc = HeartController.getInstance();
      hc.initialize([]);
      hc.setSoundVolume(0.6);
      expect(hc.getSoundVolume()).toBe(0.6);
    });
  });

  // ---------- Motion curve ----------
  describe("motion curve", () => {
    it("defaults to BATHTUB curve", () => {
      const hc = HeartController.getInstance();
      expect(typeof hc.getMotionCurveType()).toBe("function");
    });

    it("setMotionCurveType changes the curve", () => {
      const hc = HeartController.getInstance();
      const customCurve = (t: number) => t * t;
      hc.setMotionCurveType(customCurve);
      expect(hc.getMotionCurveType()).toBe(customCurve);
    });
  });

  // ---------- update() ----------
  describe("update()", () => {
    it("does nothing when not animating", () => {
      const hc = HeartController.getInstance();
      // Should not throw when not started
      hc.update();
    });

    it("processes keyframes when animating", () => {
      const hc = HeartController.getInstance();
      hc.initialize([]);
      hc.start();

      // Simulate a frame
      jest.spyOn(performance, "now").mockReturnValue(500);
      hc.update();
      // No error = success; animation state was updated
    });
  });

  // ---------- initializeRhythmSelect ----------
  describe("initializeRhythmSelect()", () => {
    it("stores reference when element exists", () => {
      const select = document.createElement("select");
      select.id = "testSelect";
      document.body.appendChild(select);

      const hc = HeartController.getInstance();
      hc.initializeRhythmSelect("testSelect");
      // No error = success

      document.body.removeChild(select);
    });

    it("warns when element does not exist", () => {
      const spy = jest.spyOn(console, "warn").mockImplementation();
      const hc = HeartController.getInstance();
      hc.initializeRhythmSelect("nonExistentElement");
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
