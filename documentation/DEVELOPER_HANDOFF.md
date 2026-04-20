# Developer Handoff – Cardiac Auscultation Trainer

## 1. Project Summary
The Cardiac Auscultation Trainer is a browser-based educational tool that helps users learn heart sounds and auscultation points through an interactive 3D heart visualization and synchronized audio playback.

### Primary goals
- Help users identify auscultation locations
- Play heart sounds associated with selected rhythms/locations
- Provide an interactive visual model to support learning
- Support future expansion of rhythms, sounds, and instructional modes

## 2. Current Tech Stack
- TypeScript
- Three.js
- Vite
- Jest
- Web-based asset loading for sounds and 3D resources

## 3. Repository Structure
- `src/` – main application source code
- `sounds/` – heart sound audio files
- `public/assets/` – static assets used by the app
- `documentation/` – supporting documentation and handoff materials
- `package.json` – scripts and dependencies
- `vite.config.js` – Vite configuration
- `jest.config.ts` – test configuration
- `index.html` – app entry page

## 4. How to Run the Project
### Local development
1. Install dependencies
   - `npm install`
2. Start the dev server
   - `npm run dev`

### Production build
- `npm run build`

### Tests
- `npm test`

## 5. Current Functional Areas
The current system is centered around:
- Rendering the heart visualization
- Loading and presenting sound assets
- Supporting user interaction with the interface
- Managing project assets and rhythm-related content

## 6. Known Strengths
- Clear separation between source code, documentation, and media assets
- Modern front-end setup using TypeScript and Vite
- Existing documentation already started
- Test framework is present, which gives the next team a base for regression testing

## 7. Handoff Notes for Sponsor / Next Team
The project has a solid foundation for an educational cardiac audio/visual trainer, but the next team should begin by reconciling documentation with the actual implementation before extending features. The highest-value short-term work is improving maintainability, validating the current workflow, and then building on top of the verified baseline.

## 8. Recommended Feature Improvements (High Priority)

Based on user testing goals (especially for nursing students), the following improvements should be prioritized by the next team:

### 1. Simplify Heart Sound Selection (UX Improvement)
The current list of heart sounds should be condensed to improve usability during testing scenarios.

#### Proposed primary (default) list:
- Normal Sinus Rhythm
- First Degree AV Block
- Second Degree AV Block (Type I & Type II)
- Third Degree AV Block
- Atrial Fibrillation (AFib)
- Supraventricular Tachycardia (SVT)
- Ventricular Tachycardia
- Ventricular Fibrillation (VFib)
- Asystole

#### Additional requirement:
- All other heart sounds should be placed under a **“Show More”** or expandable section
- Goal: reduce cognitive overload and make the interface more intuitive for nurses during timed or realistic training scenarios
