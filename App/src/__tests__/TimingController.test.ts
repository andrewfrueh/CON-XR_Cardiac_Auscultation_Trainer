import { TimingController } from "../TimingController";

function resetTimingController(): void {
  (TimingController as any).instance = undefined;
}

describe("TimingController", () => {
  beforeEach(() => {
    resetTimingController();
    // Provide a deterministic performance.now()
    jest.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ---------- Singleton ----------
  describe("singleton", () => {
    it("returns the same instance", () => {
      expect(TimingController.getInstance()).toBe(
        TimingController.getInstance(),
      );
    });
  });

  // ---------- Start / Stop ----------
  describe("start() / stop()", () => {
    it("sets isAnimating to true after start", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start();
      expect(ctrl.isAnimating()).toBe(true);
    });

    it("sets isAnimating to false after stop", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start();
      ctrl.stop();
      expect(ctrl.isAnimating()).toBe(false);
    });

    it("defaults to not animating", () => {
      const ctrl = TimingController.getInstance();
      expect(ctrl.isAnimating()).toBe(false);
    });
  });

  // ---------- BPM ----------
  describe("BPM", () => {
    it("defaults to 60 BPM (cycleDuration = 1000ms)", () => {
      const ctrl = TimingController.getInstance();
      expect(ctrl.getBPM()).toBe(60);
      expect(ctrl.getCycleDuration()).toBe(1000);
    });

    it("sets BPM correctly", () => {
      const ctrl = TimingController.getInstance();
      ctrl.setBPM(120);
      expect(ctrl.getBPM()).toBe(120);
      expect(ctrl.getCycleDuration()).toBe(500);
    });

    it("setBPM resets startTime", () => {
      const ctrl = TimingController.getInstance();
      jest.spyOn(performance, "now").mockReturnValue(5000);
      ctrl.setBPM(80);
      expect(ctrl.getStartTime()).toBe(5000);
    });
  });

  // ---------- Cycle Duration ----------
  describe("cycle duration", () => {
    it("sets cycle duration directly", () => {
      const ctrl = TimingController.getInstance();
      ctrl.setCycleDuration(2000);
      expect(ctrl.getCycleDuration()).toBe(2000);
      expect(ctrl.getBPM()).toBe(30);
    });

    it("setCycleDuration resets startTime", () => {
      const ctrl = TimingController.getInstance();
      jest.spyOn(performance, "now").mockReturnValue(3000);
      ctrl.setCycleDuration(500);
      expect(ctrl.getStartTime()).toBe(3000);
    });
  });

  // ---------- Tick ----------
  describe("tick()", () => {
    it("updates currentTime and prevTime", () => {
      const ctrl = TimingController.getInstance();
      jest.spyOn(performance, "now").mockReturnValue(100);
      ctrl.tick();
      expect(ctrl.getCurrentTime()).toBe(100);
      expect(ctrl.getPrevTime()).toBe(0);

      jest.spyOn(performance, "now").mockReturnValue(200);
      ctrl.tick();
      expect(ctrl.getCurrentTime()).toBe(200);
      expect(ctrl.getPrevTime()).toBe(100);
    });
  });

  // ---------- Cycle Progress ----------
  describe("getCycleProgress()", () => {
    it("returns 0 at the start of a cycle", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start(); // startTime = 0
      jest.spyOn(performance, "now").mockReturnValue(0);
      ctrl.tick();
      expect(ctrl.getCycleProgress()).toBe(0);
    });

    it("returns 0.5 at half cycle (default 1000ms)", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start();
      jest.spyOn(performance, "now").mockReturnValue(500);
      ctrl.tick();
      expect(ctrl.getCycleProgress()).toBeCloseTo(0.5);
    });

    it("wraps around at the end of a cycle", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start();
      jest.spyOn(performance, "now").mockReturnValue(1000);
      ctrl.tick();
      // 1000 % 1000 = 0
      expect(ctrl.getCycleProgress()).toBeCloseTo(0);
    });

    it("returns correct progress mid-second cycle", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start();
      jest.spyOn(performance, "now").mockReturnValue(1250);
      ctrl.tick();
      expect(ctrl.getCycleProgress()).toBeCloseTo(0.25);
    });
  });

  // ---------- Current Cycle ----------
  describe("getCurrentCycle()", () => {
    it("returns 0 at the start", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start();
      jest.spyOn(performance, "now").mockReturnValue(0);
      ctrl.tick();
      expect(ctrl.getCurrentCycle()).toBe(0);
    });

    it("increments after a full cycle", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start();
      jest.spyOn(performance, "now").mockReturnValue(1500);
      ctrl.tick();
      expect(ctrl.getCurrentCycle()).toBe(1);
    });

    it("tracks multiple cycles", () => {
      const ctrl = TimingController.getInstance();
      ctrl.start();
      jest.spyOn(performance, "now").mockReturnValue(3200);
      ctrl.tick();
      expect(ctrl.getCurrentCycle()).toBe(3);
    });
  });
});
