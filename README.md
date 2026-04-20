# CON-XR Cardiac Auscultation Trainer

An interactive, web-based cardiac auscultation training tool built with **Three.js** and **TypeScript**. Students can explore a 3D chest and heart model, select anatomical auscultation points, listen to clinically accurate heart sounds, and observe real-time EKG waveforms — all in the browser.

> **Live Demo →** Deployed automatically to GitHub Pages on every push to `main`.

---

## Features

### 🫀 3D Anatomical Models
- **Chest View** — FBX mannequin with four interactive auscultation points overlaid at their anatomical positions.
- **Heart View** — Detailed 3D heart model with real-time contraction animation driven by the selected rhythm.
- Toggle between views at any time; the audio engine and EKG continue uninterrupted.

### 🩺 Auscultation Points
Four standard cardiac exam locations, each with location-specific sound modifications:

| Point | Landmark |
|-------|----------|
| **Aortic** | 2nd ICS, Right Sternal Border |
| **Pulmonic** | 2nd ICS, Left Sternal Border |
| **Tricuspid** | 4th ICS, Left Sternal Border |
| **Mitral (Apex)** | 5th ICS, Midclavicular Line |

### 🎵 Heart Rhythms
Selectable rhythms with a searchable dropdown

Sounds are sourced from the [University of Michigan Heart Sound & Murmur Library](https://open.umich.edu/find/open-educational-resources/medical/heart-sound-murmur-library) (Mitral location) and procedurally generated for the remaining locations with clinically informed rules (see [`documentation/HeartRhythms.txt`](documentation/HeartRhythms.txt)).

### 📈 EKG Visualizer
- Canvas-based real-time EKG waveform synchronized to the active rhythm and BPM.
- Collapsible and resizable panel with drag handle.

### 🎛️ Controls
- **BPM Slider** — Adjustable from 30 to 180 BPM.
- **Volume Slider** — Master heart sound volume.
- **Play / Pause** — Start or stop the cardiac cycle.
- **Reset View** — Return the 3D camera to its default position.
- **Dark / Light Mode** — Toggle background theme.

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ and `npm` (or `yarn`)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/andrewfrueh/CON-XR_Cardiac_Auscultation_Trainer.git
cd CON-XR_Cardiac_Auscultation_Trainer

# Install dependencies
npm install        # or: yarn install

# Start the dev server (opens on http://localhost:5173)
npm run dev        # or: yarn dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production (outputs to `docs/`) |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate a test coverage report |

---

## Project Structure

```
CON-XR_Cardiac_Auscultation_Trainer/
├── index.html                    # App shell — layout, controls, EKG panel
├── vite.config.js                # Vite config (base path for GitHub Pages)
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
├── jest.config.ts                # Jest test configuration
│
├── src/                          # Application source (TypeScript)
│   ├── main.ts                   # Entry point — bootstraps all systems
│   ├── heart/
│   │   ├── heart.ts              # Three.js scene, models, camera, lighting
│   │   ├── HeartController.ts    # Singleton orchestrator (animation + audio + timing)
│   │   ├── RhythmOptions.ts      # Rhythm enum / option list
│   │   └── heartRhythms/
│   │       ├── Rhythm.ts         # Rhythm type definitions & defaults
│   │       └── config/
│   │           ├── rhythm-templates.ts    # Sound & animation keyframe data
│   │           ├── rhythm-factory.ts      # Builds rhythm objects from templates
│   │           ├── animation-keyframes.ts # Shared animation keyframe helpers
│   │           ├── location-modifiers.ts  # Per-auscultation-point sound rules
│   │           └── index.ts               # Config barrel export
│   ├── AudioEngine.ts            # Web Audio API playback & envelope control
│   ├── AnimationController.ts    # Blendshape interpolation for heart mesh
│   ├── TimingController.ts       # Global BPM clock & cycle tracking
│   ├── RhythmController.ts       # Rhythm switching & auscultation location
│   ├── EKGVisualizer.ts          # Canvas-based EKG waveform renderer
│   ├── audio/
│   │   ├── SoundManager.ts       # Sound asset loading & caching
│   │   └── interfaces.ts         # ISoundEmitter interface
│   ├── utils/
│   │   ├── controls-manager.ts   # UI control wiring
│   │   └── curves.ts             # Motion / easing curve functions
│   └── __tests__/                # Unit tests (15 test files)
│
├── public/
│   └── assets/
│       ├── heart.fbx             # 3D heart model
│       ├── chest.fbx             # 3D chest mannequin model
│       ├── chest.png             # Chest texture
│       ├── favicon.png           # App favicon
│       ├── rhythm-dropdown.js    # Custom searchable dropdown widget
│       ├── styles/
│       │   ├── main.css          # Global styles
│       │   └── controls.css      # Control panel & EKG styles
│       └── sounds/               # Heart sound MP3 assets
│
├── sounds/                       # Extended sound library (89 MP3s)
├── documentation/
│   ├── HeartRhythms.txt          # Rhythm catalog & procedural generation rules
│   └── DEVELOPER_HANDOFF.md      # Full developer handoff documentation
├── docs/                         # Production build output (GitHub Pages)
└── .github/workflows/
    └── pages2.yml                # CI/CD — auto-deploy to GitHub Pages
```

---

## Architecture

The application follows a **singleton orchestrator** pattern:

```
HeartController (orchestrator)
├── TimingController    — Global BPM clock, cycle progress
├── AnimationController — Blendshape targets, mesh interpolation
├── RhythmController    — Active rhythm, auscultation location
└── AudioEngine         — Web Audio playback, envelopes, volume
```

Each controller is a singleton accessed via `getInstance()`. The `HeartController` drives the per-frame update loop: it reads cycle progress from `TimingController`, processes animation and sound keyframes from the current `Rhythm`, and delegates to the appropriate controller.

The **EKG Visualizer** runs independently on its own canvas, synchronized to the same `TimingController` clock.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | TypeScript 5.3+ targeting ES2020 |
| **3D Rendering** | Three.js 0.158 (via importmap CDN) |
| **Bundler** | Vite 7 |
| **Testing** | Jest 30 + ts-jest + jsdom |
| **Deployment** | GitHub Actions → GitHub Pages |
| **Audio** | Web Audio API |

---

## Deployment

The project auto-deploys to **GitHub Pages** via the `.github/workflows/pages2.yml` workflow on every push to `main`.

The production build outputs to the `docs/` directory with a base path of `/CON-XR_Cardiac_Auscultation_Trainer/`.

To build manually:

```bash
npm run build
```

---

## Testing

The project includes 15 unit test files covering all major controllers and utilities:

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Sound Library

Heart sounds are sourced from the **University of Michigan Heart Sound & Murmur Library** (open educational resource). The `sounds/` directory contains 89 MP3 files spanning:

- Normal heart sounds (S1, S2 variants)
- Gallops (S3, S4, summation)
- Murmurs (aortic stenosis/regurgitation, mitral stenosis/regurgitation, etc.)
- Clicks (mid-systolic, ejection)
- Congenital defects (ASD, VSD, PDA, Tetralogy of Fallot, etc.)
- Lung sounds (wheezes, crackles, rales, stridor, pleural rubs)
