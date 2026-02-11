import { SoundManager } from "../audio/SoundManager";
import { ISoundEmitter } from "../audio/interfaces";

function resetSoundManager(): void {
  (SoundManager as any).instance = undefined;
}

/** Create a mock ISoundEmitter */
function createMockEmitter(id: string, active = false): ISoundEmitter {
  return {
    getId: jest.fn(() => id),
    update: jest.fn(),
    setVolume: jest.fn(),
    getVolume: jest.fn(() => 1),
    isActive: jest.fn(() => active),
    start: jest.fn(),
    stop: jest.fn(),
  };
}

describe("SoundManager", () => {
  beforeEach(() => {
    resetSoundManager();
  });

  // ---------- Singleton ----------
  describe("singleton", () => {
    it("returns the same instance", () => {
      expect(SoundManager.getInstance()).toBe(SoundManager.getInstance());
    });
  });

  // ---------- registerEmitter / unregisterEmitter ----------
  describe("register / unregister", () => {
    it("registers an emitter and retrieves it by ID", () => {
      const mgr = SoundManager.getInstance();
      const emitter = createMockEmitter("heart");
      mgr.registerEmitter(emitter);
      expect(mgr.getEmitter("heart")).toBe(emitter);
    });

    it("replaces an emitter with the same ID (with warning)", () => {
      const mgr = SoundManager.getInstance();
      const spy = jest.spyOn(console, "warn").mockImplementation();

      const orig = createMockEmitter("heart");
      const replacement = createMockEmitter("heart");
      mgr.registerEmitter(orig);
      mgr.registerEmitter(replacement);

      expect(mgr.getEmitter("heart")).toBe(replacement);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it("unregisters an emitter", () => {
      const mgr = SoundManager.getInstance();
      const emitter = createMockEmitter("heart");
      mgr.registerEmitter(emitter);
      mgr.unregisterEmitter("heart");
      expect(mgr.getEmitter("heart")).toBeUndefined();
    });

    it("warns when unregistering a non-existent emitter", () => {
      const mgr = SoundManager.getInstance();
      const spy = jest.spyOn(console, "warn").mockImplementation();
      mgr.unregisterEmitter("nope");
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  // ---------- getAllEmitters ----------
  describe("getAllEmitters()", () => {
    it("returns all registered emitters", () => {
      const mgr = SoundManager.getInstance();
      mgr.registerEmitter(createMockEmitter("a"));
      mgr.registerEmitter(createMockEmitter("b"));
      mgr.registerEmitter(createMockEmitter("c"));
      expect(mgr.getAllEmitters()).toHaveLength(3);
    });

    it("returns empty array when none registered", () => {
      const mgr = SoundManager.getInstance();
      expect(mgr.getAllEmitters()).toEqual([]);
    });
  });

  // ---------- getActiveEmitters ----------
  describe("getActiveEmitters()", () => {
    it("returns only active emitters", () => {
      const mgr = SoundManager.getInstance();
      mgr.registerEmitter(createMockEmitter("a", true));
      mgr.registerEmitter(createMockEmitter("b", false));
      mgr.registerEmitter(createMockEmitter("c", true));

      const active = mgr.getActiveEmitters();
      expect(active).toHaveLength(2);
    });
  });

  // ---------- hasActiveEmitters ----------
  describe("hasActiveEmitters()", () => {
    it("returns true when at least one emitter is active", () => {
      const mgr = SoundManager.getInstance();
      mgr.registerEmitter(createMockEmitter("a", false));
      mgr.registerEmitter(createMockEmitter("b", true));
      expect(mgr.hasActiveEmitters()).toBe(true);
    });

    it("returns false when no emitters are active", () => {
      const mgr = SoundManager.getInstance();
      mgr.registerEmitter(createMockEmitter("a", false));
      expect(mgr.hasActiveEmitters()).toBe(false);
    });

    it("returns false when no emitters registered", () => {
      const mgr = SoundManager.getInstance();
      expect(mgr.hasActiveEmitters()).toBe(false);
    });
  });

  // ---------- updateAll ----------
  describe("updateAll()", () => {
    it("calls update on every emitter with deltaTime", () => {
      const mgr = SoundManager.getInstance();
      const e1 = createMockEmitter("a");
      const e2 = createMockEmitter("b");
      mgr.registerEmitter(e1);
      mgr.registerEmitter(e2);

      mgr.updateAll(0.016);

      expect(e1.update).toHaveBeenCalledWith(0.016);
      expect(e2.update).toHaveBeenCalledWith(0.016);
    });
  });

  // ---------- startAll / stopAll ----------
  describe("startAll() / stopAll()", () => {
    it("calls start on all emitters", () => {
      const mgr = SoundManager.getInstance();
      const e1 = createMockEmitter("a");
      const e2 = createMockEmitter("b");
      mgr.registerEmitter(e1);
      mgr.registerEmitter(e2);

      mgr.startAll();
      expect(e1.start).toHaveBeenCalled();
      expect(e2.start).toHaveBeenCalled();
    });

    it("calls stop on all emitters", () => {
      const mgr = SoundManager.getInstance();
      const e1 = createMockEmitter("a");
      const e2 = createMockEmitter("b");
      mgr.registerEmitter(e1);
      mgr.registerEmitter(e2);

      mgr.stopAll();
      expect(e1.stop).toHaveBeenCalled();
      expect(e2.stop).toHaveBeenCalled();
    });
  });

  // ---------- setAllVolumes ----------
  describe("setAllVolumes()", () => {
    it("calls setVolume on every emitter", () => {
      const mgr = SoundManager.getInstance();
      const e1 = createMockEmitter("a");
      const e2 = createMockEmitter("b");
      mgr.registerEmitter(e1);
      mgr.registerEmitter(e2);

      mgr.setAllVolumes(0.5);
      expect(e1.setVolume).toHaveBeenCalledWith(0.5);
      expect(e2.setVolume).toHaveBeenCalledWith(0.5);
    });
  });

  // ---------- clear ----------
  describe("clear()", () => {
    it("removes all emitters", () => {
      const mgr = SoundManager.getInstance();
      mgr.registerEmitter(createMockEmitter("a"));
      mgr.registerEmitter(createMockEmitter("b"));
      mgr.clear();
      expect(mgr.getAllEmitters()).toHaveLength(0);
    });
  });
});
