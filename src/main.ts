// Main application entry point
import { init } from "./heart/heart.js";
import { initializeControls } from "./utils/controls-manager.js";
import { EKGVisualizer } from "./EKGVisualizer.js";
import { SelectableRhythmName } from "./heart/heartRhythms/Rhythm.js";

// Initialize controls manager
initializeControls();

// Initialize the application when the page loads
window.addEventListener("load", () => {
  init();
  const ekg = new EKGVisualizer("ekgCanvas");
  ekg.start();
  (window as any).ekgVisualizer = ekg;
  (window as any).ekgRhythmNames = SelectableRhythmName;
});
