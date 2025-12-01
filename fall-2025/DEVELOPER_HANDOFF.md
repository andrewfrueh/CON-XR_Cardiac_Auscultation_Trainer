# Developer Handoff Document - Interactive 3D Heart Visualization

**Last Updated**: November 2025  
**Project Type**: Medical Education Web Application  
**Tech Stack**: TypeScript, Three.js, Docker, Web Audio API

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Architecture Overview](#architecture-overview)
4. [Development Workflow](#development-workflow)
5. [Key Files and Their Responsibilities](#key-files-and-their-responsibilities)
6. [Common Development Tasks](#common-development-tasks)
7. [Adding New Heart Rhythms](#adding-new-heart-rhythms)
8. [Debugging Guide](#debugging-guide)
9. [Important Gotchas](#important-gotchas)
10. [Production Deployment](#production-deployment)
11. [Code Standards](#code-standards)

---

## Project Overview

### What This Application Does
This is an interactive medical education tool that visualizes a 3D beating heart with synchronized audio. Users can:
- View a realistic 3D heart model with animated chambers
- Select different auscultation points (Aortic, Pulmonic, Tricuspid, Mitral)
- Adjust heart rate (BPM) and sound volume
- Rotate/zoom the 3D model

### Target Audience
- Medical students learning cardiac auscultation
- Nursing students
- Healthcare educators
- Patients seeking to understand their conditions

### Key Technologies
- **Three.js 0.158**: 3D rendering with WebGL
- **TypeScript 5.3**: Type-safe development
- **FBX Format**: 3D model with morph targets (blendshapes)
- **Web Audio API**: Precise audio timing and playback
- **Docker**: Development environment containerization
- **No Bundler**: Uses native ES modules + import maps

---

## Getting Started

### Prerequisites
- Docker Desktop installed and running
- Basic understanding of TypeScript and Three.js

### First-Time Setup

```bash
# 1. Navigate to project directory
cd fall-2025

# 2. Start Docker container
docker compose up -d

# 3. Enter the container (Alpine uses 'sh', not 'bash')
docker compose exec dev sh

# 4. Inside container: Install dependencies
yarn install

# 5. Build the project
yarn build

# 6. Start development server
yarn dev
```

**Access the app**: Open `http://localhost:3000` in your browser

### Development Commands

```bash
# Watch mode (auto-rebuild + serve)
yarn dev

# Build only
yarn build

# Type check without building
yarn type-check

# Clean build directory
yarn clean

# Serve already-built files
yarn serve
```

### File Watching with Nodemon
The `yarn dev` command uses nodemon to watch for TypeScript changes. Configuration is in `nodemon.json`:
- Watches `src/**/*.ts`
- Ignores `docs/` and `node_modules/`
- Automatically rebuilds on file changes

---

## Architecture Overview

### High-Level Structure

```
User Interaction (HTML/CSS)
         ↓
    App.ts (Entry Point)
         ↓
    ┌────┴────┐
    ↓         ↓
heart.ts    controls-manager.ts
(3D Scene)  (UI Logic)
    ↓
HeartController (Singleton)
    ↓
    ├── Blendshape Animation
    ├── Sound Playback
    ├── Rhythm Management
    └── Timing/BPM Control
```

### Key Design Patterns

#### 1. Singleton Pattern - HeartController
```typescript
// Only one instance manages all heart state
const controller = HeartController.getInstance();
```
**Why**: Ensures consistent state across the application. The heart should only have one "brain" controlling its behavior.

#### 2. Keyframe-Based Animation System
```typescript
type AnimationKeyframe = {
    time: number;              // When in cycle (0-1)
    animationEnd: number;      // When animation ends (0-1)
    blendshape: string[];      // Which chambers (LA, RA, LV, RV)
    value: number;             // Target value (0-1)
    curveFunction: Function;   // Easing function
}
```
**Why**: Allows precise, customizable animations that can be defined declaratively in rhythm files.

#### 3. Cycle-Based Timing
- Continuous clock runs from `startTime`
- Each cycle = one heartbeat
- Cycle duration = `(60 / BPM) * 1000` milliseconds
- Sounds play at exact moments within each cycle

**Why**: Maintains perfect synchronization between visuals and audio at any BPM.

### Data Flow

```
User adjusts BPM slider
         ↓
window.setHeartBPM(bpm) called
         ↓
HeartController.setBPM(bpm)
         ↓
Recalculates cycleDuration
         ↓
animate() loop runs every frame
         ↓
HeartController.update()
         ↓
    ┌───┴───┐
    ↓       ↓
Animation   Sound
Keyframes   Keyframes
    ↓       ↓
Blendshapes Audio
Applied     Plays
```

---

## Key Files and Their Responsibilities

### Entry Point & Setup

#### `index.html`
- Main HTML structure
- Control panel UI (sliders, buttons, dropdowns)
- Import map for Three.js
- Auscultation panel modal
**Touch this when**: Adding new UI controls or modifying layout

#### `src/App.ts`
- Application entry point
- Initializes controls manager
- Calls `init()` from `heart.ts`
**Touch this when**: Adding new initialization logic or global event handlers

### Core 3D Visualization

#### `src/heart/heart.ts` (~540 lines)
**Responsibilities**:
- Three.js scene setup (camera, renderer, lights)
- FBX model loading and texture application
- OrbitControls configuration
- Animation loop
- Window functions (resetCamera, toggleAnimation, etc.)

**Key Functions**:
- `init()`: Sets up entire 3D scene
- `loadHeartModel()`: Loads FBX with progress tracking
- `initFBXBlendshapes()`: Finds meshes with morph targets
- `addLighting()`: Creates 8 lights for proper illumination
- `animate()`: Main render loop (calls `HeartController.update()`)

**Touch this when**: 
- Modifying visual appearance (materials, lighting, camera)
- Changing 3D model loading logic
- Adding new global window functions

### Heart Animation Controller

#### `src/heart/HeartController.ts` (~425 lines)
**Responsibilities**:
- Singleton managing all heart animation state
- Blendshape interpolation with lerp
- Sound loading and playback with Web Audio API
- Cycle timing and BPM calculations
- Rhythm pattern management

**Key Properties**:
```typescript
private isRunning: boolean;           // Animation state
private cycleDuration: number;        // Ms per heartbeat
private currentTime / prevTime: number; // For sound timing
private morphTargetMeshes: THREE.Mesh[]; // Meshes to animate
private soundBuffers: Map;            // Cached audio
private currentBlendshapes: Map;      // Smooth interpolation
private targetBlendshapes: Map;       // Target values
```

**Key Methods**:
- `initialize(meshes)`: Called once with morph target meshes
- `update()`: Called every frame to update animation
- `setBPM(bpm)` / `setCycleDuration(ms)`: Control timing
- `switchToRhythmByName(name)`: Change active rhythm
- `processAnimationKeyframe()`: Applies curve functions
- `processSoundKeyframe()`: Triggers sounds at exact times
- `playSound()`: Web Audio API playback with caching

**Touch this when**:
- Modifying animation behavior or timing
- Adding new control methods
- Changing blendshape interpolation logic
- Debugging sound playback issues

### Rhythm Definitions

#### `src/heart/heartRhythms/Rhythm.ts`
**Responsibilities**:
- Type definitions for rhythms
- Registry of all available rhythms
- Imports all rhythm files

**Structure**:
```typescript
export type Rhythm = {
    name: string;
    animation?: AnimationKeyframe[];
    sound?: SoundKeyframe[];
    location: "Aortic" | "Pulmonic" | "Tricuspid" | "Mitral";
};

export const availableRhythms: Rhythm[] = [
    mitralNormalS1S2Rhythm,
    // ... more rhythms
];
```

**Touch this when**: Adding or removing rhythms from the application

#### `src/heart/heartRhythms/{Location}/{RhythmName}.ts`
**Example**: `Mitral/NormalS1S2.ts`, `Aortic/S3Gallop.ts`

**Responsibilities**:
- Define specific rhythm pattern
- Specify animation keyframes for chamber movement
- Specify sound keyframes for audio playback

**Typical Structure**:
```typescript
import { Rhythm } from "../Rhythm.js";
import { MotionCurves } from "../../utils/curves.js";

export const mitralNormalS1S2Rhythm: Rhythm = {
    name: "Apex Normal S1 S2",
    location: "Mitral",
    animation: [
        // Atrial contraction
        {
            time: 0.0,
            animationEnd: 0.1,
            blendshape: ["LA", "RA"],
            value: 1.0,
            curveFunction: MotionCurves.ATRIAL_CONTRACTION
        },
        // Ventricular contraction
        {
            time: 0.1,
            animationEnd: 0.4,
            blendshape: ["LV", "RV"],
            value: 1.0,
            curveFunction: MotionCurves.VENTRICULAR_CONTRACTION
        }
    ],
    sound: [
        {
            time: 0.0,
            soundPath: "./assets/sounds/heart-normal-S1.wav",
            volume: 1.0,
            pitch: 1.0
        },
        {
            time: 0.35,
            soundPath: "./assets/sounds/heart-normal-S2.wav",
            volume: 0.8,
            pitch: 1.0
        }
    ]
};
```

**Touch this when**: Creating new rhythms or modifying existing ones

### Utility Modules

#### `src/utils/curves.ts`
**Responsibilities**:
- Easing/curve functions for natural motion
- Physiologically-based cardiac curves

**Available Curves**:
```typescript
export const MotionCurves = {
    BELL,                      // Smooth acceleration/deceleration
    BATHTUB,                   // Fast-slow-fast
    LERP,                      // Linear
    HEART_CONTRACTION,         // General cardiac contraction
    ATRIAL_CONTRACTION,        // Gentler atrial motion
    VENTRICULAR_CONTRACTION,   // Powerful ventricular motion
    DIASTOLIC_RELAXATION       // Gradual filling
};
```

**Touch this when**: Creating new animation curves or modifying existing ones

#### `src/utils/controls-manager.ts`
**Responsibilities**:
- Collapsible control panel toggle
- Triggers window resize after panel animation

**Touch this when**: Modifying control panel behavior

### Assets

#### `src/assets/heart.fbx`
- 3D heart model with 4 morph targets: LA, RA, LV, RV
- Includes UV mapping for texture
- **Don't modify** without understanding FBX format and blendshapes

#### `src/assets/corazon_atropellado.jpg`
- Heart texture (2048x2048 recommended)
- Applied to all meshes in the model

#### `src/assets/sounds/*.wav`
- 14 WAV files for different heart sounds
- Format: WAV, 16-bit or 24-bit, 44.1kHz recommended
- Normalized for consistent volume

#### `src/assets/styles/`
- `main.css`: Global styles, layout, loading screen
- `controls.css`: Control panel, buttons, sliders, auscultation panel

---

## Development Workflow

### Typical Development Session

```bash
# 1. Start Docker (if not running)
docker compose up -d

# 2. Enter container
docker compose exec dev sh

# 3. Start watch mode
yarn dev

# 4. Edit files in your IDE
# Files are auto-compiled on save (nodemon watches src/)

# 5. Refresh browser to see changes
# No hot module reload - manual refresh required

# 6. Check browser console for errors
# Most issues show up here (TypeScript errors, loading failures, etc.)

# 7. When done, exit container
exit

# 8. Stop Docker
docker compose down
```

### TypeScript Compilation

**Input**: `src/**/*.ts`  
**Output**: `docs/**/*.js` + `.js.map` + `.d.ts` + `.d.ts.map`

**Important**: 
- Import statements in `.ts` files must end with `.js` (not `.ts`)
- This is because they reference the compiled output
- Example: `import { init } from './heart/heart.js';`

**tsconfig.json Key Settings**:
```json
{
  "target": "ES2020",
  "module": "ES2020",
  "moduleResolution": "node",
  "outDir": "./docs",
  "declaration": true,
  "declarationMap": true,
  "sourceMap": true
}
```

### Asset Copying

The build process copies assets:
```bash
yarn copy-assets
# Runs: cp -r src/assets docs/ && cp index.html docs/
```

**Result**: `docs/` contains everything needed to run the app

---

## Common Development Tasks

### Task 1: Change Default Heart Rate

**File**: `src/heart/HeartController.ts`

```typescript
// Find this line (around line 26):
private cycleDuration: number = 1000; // 60 BPM

// Change to:
private cycleDuration: number = 800; // 75 BPM
// Formula: (60 / BPM) * 1000
```

**Also update**: `index.html` slider default value
```html
<input type="range" id="bpmSlider" min="30" max="180" step="5" value="75">
<span id="bpmValue" class="slider-value">75</span>
```

### Task 2: Add a New Button to UI

**File**: `index.html`

```html
<!-- Add to .icon-buttons section -->
<button class="control-btn icon-btn" id="my-new-btn" onclick="myNewFunction()" aria-label="My Action" title="My Action">
    <span class="icon">🎯</span>
</button>
```

**File**: `src/heart/heart.ts`

```typescript
// Add function
function myNewFunction(): void {
    console.log('Button clicked!');
    // Your logic here
}

// Make it globally accessible
declare global {
    interface Window {
        myNewFunction: () => void;
    }
}

window.myNewFunction = myNewFunction;
```

### Task 3: Change Camera Default Position

**File**: `src/heart/heart.ts`

```typescript
// In init() function (around line 42):
camera.position.set(0, 0, 6); // Change these values

// Also update resetCamera() function (around line 325):
function resetCamera(): void {
    camera.position.set(0, 0, 6); // Match the init value
    if (controls && controls.reset) {
        controls.reset();
    }
}
```

### Task 4: Modify Light Intensity

**File**: `src/heart/heart.ts`, function `addLighting()`

```typescript
// Find this line (around line 249):
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//                                           color     intensity

// Change intensity (0.0 to ~3.0):
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
```

### Task 5: Add a New Sound File

```bash
# 1. Add WAV file to src/assets/sounds/
cp my-new-sound.wav src/assets/sounds/

# 2. Reference in rhythm file
{
    time: 0.5,
    soundPath: "./assets/sounds/my-new-sound.wav",
    volume: 1.0,
    pitch: 1.0
}

# 3. Rebuild to copy assets
yarn build
```

---

## Adding New Heart Rhythms

### Step-by-Step Process

#### Step 1: Create the Rhythm File

**Location**: `src/heart/heartRhythms/{Location}/{RhythmName}.ts`

**Choose location**: Aortic, Pulmonic, Tricuspid, or Mitral

**Example**: Adding "Mitral S4 with Ejection Click"

```bash
# Create file
touch src/heart/heartRhythms/Mitral/S4WithEjectionClick.ts
```

#### Step 2: Define the Rhythm

```typescript
import { Rhythm } from "../Rhythm.js";
import { MotionCurves } from "../../utils/curves.js";

export const mitralS4WithEjectionClickRhythm: Rhythm = {
    name: "Mitral S4 with Ejection Click",
    location: "Mitral",
    
    animation: [
        // S4: Late diastolic atrial contraction
        {
            time: 0.85,           // Near end of previous cycle
            animationEnd: 0.95,
            blendshape: ["LA", "RA"],
            value: 1.0,
            curveFunction: MotionCurves.ATRIAL_CONTRACTION
        },
        // Ventricular systole
        {
            time: 0.0,
            animationEnd: 0.35,
            blendshape: ["LV", "RV"],
            value: 1.0,
            curveFunction: MotionCurves.VENTRICULAR_CONTRACTION
        }
    ],
    
    sound: [
        // S4 sound (just before S1)
        {
            time: 0.9,
            soundPath: "./assets/sounds/s4.wav",
            volume: 0.6,
            pitch: 1.0
        },
        // S1
        {
            time: 0.0,
            soundPath: "./assets/sounds/heart-normal-S1.wav",
            volume: 1.0
        },
        // Ejection click (early systole)
        {
            time: 0.1,
            soundPath: "./assets/sounds/click.wav",
            volume: 0.8
        },
        // S2
        {
            time: 0.35,
            soundPath: "./assets/sounds/heart-normal-S2.wav",
            volume: 0.8
        }
    ]
};
```

#### Step 3: Register in Rhythm.ts

**File**: `src/heart/heartRhythms/Rhythm.ts`

```typescript
// Add import at top
import { mitralS4WithEjectionClickRhythm } from "./Mitral/S4WithEjectionClick.js";

// Add to availableRhythms array
export const availableRhythms: Rhythm[] = [
    mitralNormalS1S2Rhythm,
    mitralS3GallopRhythm,
    // ... existing rhythms ...
    mitralS4WithEjectionClickRhythm, // <-- Add here
];
```

#### Step 4: Add to UI Dropdown

**File**: `index.html`

```html
<select id="rhythmSelect" onchange="switchHeartRhythm(this.value)">
    <!-- Existing options -->
    <option value="Mitral S4 with Ejection Click">Mitral S4 with Ejection Click</option>
</select>
```

**Note**: The `value` must exactly match the `name` in your rhythm definition.

#### Step 5: Test

```bash
# Rebuild
yarn build

# Refresh browser
# Select your new rhythm from dropdown
# Listen and watch for proper timing
```

### Rhythm Timing Guidelines

**Cardiac Cycle Phases**:
- **0.0 - 0.1**: Isovolumetric contraction (S1 sound)
- **0.1 - 0.35**: Ventricular ejection (systole)
- **0.35 - 0.4**: Start of relaxation (S2 sound)
- **0.4 - 1.0**: Diastole (filling phase)
- **0.85 - 0.95**: Atrial kick (S4 if present)

**Sound Timing Tips**:
- S1: Usually at `time: 0.0` (mitral/tricuspid valve closure)
- S2: Usually at `time: 0.3-0.35` (aortic/pulmonic valve closure)
- S3: Early diastole `time: 0.45-0.5`
- S4: Late diastole `time: 0.85-0.9`
- Systolic murmurs: Between S1 and S2 (`0.05-0.3`)
- Diastolic murmurs: Between S2 and S1 (`0.4-0.95`)

**Animation Timing Tips**:
- Atria contract before ventricles (~0.1s delay)
- Ventricular contraction is longer and stronger
- Use appropriate curve functions for realistic motion
- `animationEnd` should be when chamber returns to neutral

---

## Debugging Guide

### Browser Console Debugging

```javascript
// Access the heart controller
window.heartController

// Check current rhythm
window.heartController.getCurrentRhythmName()

// List all rhythms
window.getAvailableHeartRhythms()

// Check BPM
window.heartController.getBPM()

// Access morph target meshes
window.morphTargetMeshes

// Check morph target names
window.morphTargetMeshes[0].morphTargetDictionary
// Should show: { LA: 0, RA: 1, LV: 2, RV: 3 }

// Manually set BPM
window.setHeartBPM(90)

// Switch rhythm
window.switchHeartRhythm('Apex Normal S1 S2')
```

### Common Issues & Solutions

#### Issue: "Cannot find module" errors

**Symptom**: TypeScript compilation errors about missing modules

**Solution**:
```typescript
// Wrong:
import { init } from './heart/heart';
import { init } from './heart/heart.ts';

// Correct:
import { init } from './heart/heart.js';
```
Remember: Import the `.js` extension even though you're editing `.ts` files.

#### Issue: Heart model doesn't load

**Check**:
1. Browser console for 404 errors
2. File exists: `docs/assets/heart.fbx`
3. Build copied assets: `yarn build` runs `copy-assets` script

**Debug**:
```javascript
// In heart.ts, add console.logs to loadHeartModel():
console.log('Starting FBX load...');
// ... in success callback:
console.log('FBX loaded successfully:', object);
// ... in error callback (add one):
function(error) {
    console.error('FBX load error:', error);
}
```

#### Issue: Sounds don't play

**Check**:
1. Audio context initialized (requires user interaction first)
2. Sound files exist in `docs/assets/sounds/`
3. Sound volume not set to 0
4. Browser console for audio errors

**Debug**:
```javascript
// Check audio context
window.heartController.audioContext
// Should be: AudioContext {...}

// Check sound buffers
window.heartController.soundBuffers
// Should be: Map with loaded sounds

// Check volume
window.heartController.getSoundVolume()
```

**Common Fix**: Click anywhere on the page to activate audio context

#### Issue: Blendshapes not animating

**Check**:
1. Morph targets exist: `window.morphTargetMeshes`
2. Animation is running: `window.heartController.isAnimating()`
3. Chamber names match: LA, RA, LV, RV (case-sensitive)

**Debug**:
```javascript
// Check morph target influences
const mesh = window.morphTargetMeshes[0];
console.log(mesh.morphTargetInfluences);
// Should be array of numbers [0.2, 0.1, 0.5, 0.4]

// Manually set a blendshape
mesh.morphTargetInfluences[0] = 1.0; // LA fully contracted
```

#### Issue: TypeScript errors after adding new code

**Solution**:
```bash
# Check for errors
yarn type-check

# Common fixes:
# 1. Add return type annotations
function myFunc(): void { }

# 2. Add proper types for parameters
function setVolume(vol: number): void { }

# 3. Check imports have .js extension
```

#### Issue: Changes not showing in browser

**Checklist**:
1. ✅ Did you save the file?
2. ✅ Did TypeScript compile? (Check terminal for errors)
3. ✅ Did you hard refresh? (Cmd+Shift+R / Ctrl+Shift+R)
4. ✅ Is nodemon watching? (Should see "restarting" in terminal)
5. ✅ Check browser cache (try incognito mode)

### Performance Debugging

```javascript
// Check FPS in browser console
// Chrome: Cmd+Shift+P -> "Show FPS"
// Firefox: F12 -> Performance tab

// Check render times
// In animate() function, add:
const startTime = performance.now();
renderer.render(scene, camera);
console.log('Render time:', performance.now() - startTime, 'ms');
// Should be < 16ms for 60fps
```

---

## Important Gotchas

### 1. Import Extensions Must Be .js

Even though you're writing `.ts` files, imports must reference `.js`:

```typescript
// ❌ Wrong - won't compile
import { HeartController } from './HeartController';
import { HeartController } from './HeartController.ts';

// ✅ Correct
import { HeartController } from './HeartController.js';
```

**Why**: TypeScript compiles to `.js`, and the imports in the output must be valid.

### 2. Audio Context Requires User Interaction

Web Audio API requires a user gesture before playing sounds:

```typescript
// This won't work on page load
this.audioContext = new AudioContext();
source.start(); // ❌ Blocked by browser

// Must happen after user clicks/taps something
```

**Current solution**: Audio starts when user interacts with any control.

### 3. Blendshape Names Are Case-Sensitive

```typescript
// ❌ Won't work
blendshape: ["la", "ra"]
blendshape: ["La", "Ra"]

// ✅ Must match exactly
blendshape: ["LA", "RA"]
```

Check the FBX model's morph target names in Blender/Maya if unsure.

### 4. Animation Keyframe Time Range is 0-1

```typescript
// ❌ Wrong - time is 0-1, not 0-100
time: 50,  // This means time 50.0, way past end of cycle

// ✅ Correct - decimal between 0 and 1
time: 0.5, // Halfway through cycle
```

### 5. Sound Timing Needs Previous/Current Time Check

Sounds play when crossing the exact time boundary:

```typescript
if (this.prevTime < beatTime && this.currentTime >= beatTime) {
    this.playSound(...);
}
```

**Without this**: Sounds may play multiple times or be skipped.

### 6. Docker Uses Alpine (sh not bash)

```bash
# ❌ Won't work
docker compose exec dev bash

# ✅ Correct
docker compose exec dev sh
```

Alpine Linux uses `sh`, not `bash`.

### 7. No Hot Module Reload

Unlike modern frameworks, this project doesn't have HMR:

```bash
# After changing TypeScript:
# 1. Save file (TypeScript auto-compiles)
# 2. Manually refresh browser
```

Consider adding HMR if this becomes tedious.

### 8. Assets Must Be Copied After Changes

```bash
# Changed a sound file or CSS?
yarn build  # This copies assets to docs/
```

Nodemon only watches `.ts` files, not assets.

---

## Production Deployment

### Building for Production

```bash
# Clean previous build
yarn clean

# Build everything
yarn build

# Test production build locally
yarn serve
# Visit http://localhost:3000
```

### Deployment Checklist

- [ ] Run `yarn type-check` (no errors)
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify all sounds load and play
- [ ] Verify 3D model loads correctly
- [ ] Check all rhythms work
- [ ] Test auscultation point switching
- [ ] Verify responsive layout
- [ ] Check browser console for warnings/errors

### What to Deploy

**Deploy the `docs/` directory only**:
```
docs/
├── index.html
├── App.js (+ .map, .d.ts, .d.ts.map)
├── heart/
├── utils/
└── assets/
```

This is a static site - no server-side code needed.

### Hosting Options

**GitHub Pages**:
```bash
# The docs/ folder is already configured for GitHub Pages
# In repo settings: Pages > Source > docs folder
```

**Netlify/Vercel**:
```bash
# Build command: yarn build
# Publish directory: docs
```

**AWS S3 + CloudFront**:
```bash
aws s3 sync docs/ s3://your-bucket/ --delete
# Configure CloudFront with S3 origin
```

### Environment Considerations

- **HTTPS Required**: For audio context in some browsers
- **CORS**: Not needed (no external API calls)
- **Compression**: Enable gzip for `.js`, `.css`, `.html` files
- **Cache Headers**: 
  - HTML: `Cache-Control: no-cache`
  - JS/CSS: `Cache-Control: max-age=31536000` (with versioning)
  - Assets: `Cache-Control: max-age=31536000`

---

## Code Standards

### TypeScript Style

```typescript
// Use explicit return types
function calculateBPM(cycleDuration: number): number {
    return (60 * 1000) / cycleDuration;
}

// Use const for non-reassigned variables
const mesh = object as THREE.Mesh;

// Use interfaces for complex types
interface SoundOptions {
    volume?: number;
    pitch?: number;
}

// Use descriptive variable names
const currentAnimationTime = performance.now();
// Not: const t = performance.now();

// Add JSDoc comments for public methods
/**
 * Sets the heart rate in beats per minute
 * @param bpm - Beats per minute (30-180)
 */
public setBPM(bpm: number): void {
    // ...
}
```

### File Naming

- TypeScript files: PascalCase for classes, camelCase for utilities
  - `HeartController.ts` ✅
  - `controls-manager.ts` ✅
- Rhythm files: Match their location
  - `Mitral/NormalS1S2.ts` ✅
  - `Aortic/S4Gallop.ts` ✅

### Git Commit Messages

```bash
# Use conventional commits format
git commit -m "feat: add new mitral regurgitation rhythm"
git commit -m "fix: correct S2 timing in aortic stenosis"
git commit -m "docs: update rhythm creation guide"
git commit -m "refactor: extract sound loading to separate method"
git commit -m "style: format HeartController with prettier"
```

### Code Organization

- Keep files focused (single responsibility)
- Group related functionality
- Extract magic numbers to named constants
- Avoid deep nesting (max 3 levels)
- Prefer pure functions when possible

---

## Quick Reference

### Essential Files Cheat Sheet

| File | Purpose | Edit When... |
|------|---------|-------------|
| `index.html` | UI structure | Adding controls, buttons, panels |
| `src/App.ts` | Entry point | Adding global initialization |
| `src/heart/heart.ts` | 3D scene | Changing visuals, camera, lighting |
| `src/heart/HeartController.ts` | Animation engine | Changing animation logic, timing |
| `src/heart/heartRhythms/Rhythm.ts` | Rhythm registry | Adding/removing rhythms |
| `src/heart/heartRhythms/{Location}/*.ts` | Individual rhythms | Creating new rhythm patterns |
| `src/utils/curves.ts` | Easing functions | Creating new motion curves |
| `src/utils/controls-manager.ts` | Control panel | Changing panel behavior |
| `src/assets/styles/main.css` | Global styles | Changing layout, colors |
| `src/assets/styles/controls.css` | Control styles | Changing buttons, sliders |

### Command Cheat Sheet

```bash
# Docker
docker compose up -d              # Start container
docker compose exec dev sh        # Enter container
docker compose down               # Stop container
docker compose logs dev           # View logs

# Development
yarn install                      # Install dependencies
yarn dev                          # Build + watch + serve
yarn build                        # Build once
yarn type-check                   # Check types only
yarn clean                        # Clean docs/
yarn serve                        # Serve docs/ (no build)

# Inside container
exit                              # Leave container shell
```

### Browser Console Commands

```javascript
// Rhythm control
window.switchHeartRhythm('Apex Normal S1 S2')
window.getAvailableHeartRhythms()
window.heartController.getCurrentRhythmName()

// Timing control
window.setHeartBPM(75)
window.heartController.getCycleDuration()

// Audio control
window.setHeartSoundVolume(0.5)
window.heartController.getSoundVolume()

// Animation control
window.toggleAnimation()
window.heartController.start()
window.heartController.stop()

// Camera control
window.resetCamera()

// Debug
window.heartController
window.morphTargetMeshes
```

---

## Contact & Resources

### Documentation
- **README.md**: User-facing documentation and features
- **DEVELOPER_HANDOFF.md**: This document (developer guide)
- **Code comments**: JSDoc comments throughout codebase

### External Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [FBX Format Specification](https://code.blender.org/2013/08/fbx-binary-file-format-specification/)

### Medical References
- Cardiac auscultation guides (consult medical textbooks)
- Heart sound databases for reference recordings
- Anatomical diagrams for chamber relationships

---

## Conclusion

This project is well-structured and maintainable. The key to success is understanding:

1. **The animation system** (keyframes → blendshapes)
2. **The timing system** (cycle-based with precise sound triggers)
3. **The singleton pattern** (one controller to rule them all)

Take time to explore the code, experiment in the browser console, and don't hesitate to add debug logging. The codebase is designed to be extensible - adding new rhythms should be straightforward once you understand the pattern.

**Happy coding! 🫀**

---

*Last updated: November 2025*  
*Created with Cursor + Claude Sonnet 4*
