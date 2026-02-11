/**
 * Tests for main.ts entry point
 *
 * main.ts imports heart.ts which depends on Three.js ESM modules (FBXLoader, etc.)
 * that Jest cannot natively parse. We mock the modules to isolate the wiring logic.
 */

// Mock heart.ts and controls-manager to avoid Three.js ESM imports
jest.mock("../heart/heart", () => ({
  init: jest.fn(),
}));

jest.mock("../utils/controls-manager", () => ({
  initializeControls: jest.fn(),
}));

describe("main.ts", () => {
  let addEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(window, "addEventListener");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("registers a 'load' event listener on window", async () => {
    // Import main to trigger its side-effects
    await import("../main");

    const loadCalls = addEventListenerSpy.mock.calls.filter(
      (call: any[]) => call[0] === "load",
    );
    expect(loadCalls.length).toBeGreaterThan(0);
  });

  it("calls initializeControls on import", async () => {
    const { initializeControls } = await import("../utils/controls-manager");
    await import("../main");
    expect(initializeControls).toHaveBeenCalled();
  });
});
