// Main application entry point
import { init } from './heart/heart.js';
import { initializeControls } from './utils/controls-manager.js';

// Initialize controls manager
initializeControls();

// Initialize the application when the page loads
window.addEventListener('load', init);
