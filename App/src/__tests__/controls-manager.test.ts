/**
 * Tests for controls-manager.ts
 *
 * This module interacts with the DOM, so we test it in jsdom environment.
 */

// Must set up DOM elements before importing the module
beforeAll(() => {
  // Create a mock heartControls element
  const controls = document.createElement("div");
  controls.id = "heartControls";
  document.body.appendChild(controls);
});

describe("controls-manager", () => {
  describe("initializeControls()", () => {
    it("sets window.toggleControls as a function", async () => {
      // Dynamically import to trigger module side-effects
      const { initializeControls } = await import(
        "../utils/controls-manager"
      );
      initializeControls();
      expect(typeof (window as any).toggleControls).toBe("function");
    });
  });

  describe("toggleControls()", () => {
    it("toggles the 'expanded' class on heartControls element", async () => {
      const { initializeControls } = await import(
        "../utils/controls-manager"
      );
      initializeControls();

      const controls = document.getElementById("heartControls")!;
      expect(controls.classList.contains("expanded")).toBe(false);

      (window as any).toggleControls();
      expect(controls.classList.contains("expanded")).toBe(true);

      (window as any).toggleControls();
      expect(controls.classList.contains("expanded")).toBe(false);
    });

    it("dispatches a resize event after toggling", async () => {
      jest.useFakeTimers();

      const { initializeControls } = await import(
        "../utils/controls-manager"
      );
      initializeControls();

      const resizeSpy = jest.fn();
      window.addEventListener("resize", resizeSpy);

      (window as any).toggleControls();

      // Fast-forward past the 350ms setTimeout
      jest.advanceTimersByTime(400);

      expect(resizeSpy).toHaveBeenCalled();

      window.removeEventListener("resize", resizeSpy);
      jest.useRealTimers();
    });
  });
});
