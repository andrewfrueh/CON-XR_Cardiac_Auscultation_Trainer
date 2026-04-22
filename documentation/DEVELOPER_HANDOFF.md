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

### 4. Integrate SME feedback

## SME Feedback Summary

### Target Users & Context
- Designed for **first-year nursing students**
- Focus on **foundational cardiac assessment**
  - Vital signs
  - Common abnormal heart sounds
- Used to help students **practice pulse counting and build confidence**

---

### Audio & Sound Improvements
- S3 and S4 heart sounds are **too quiet for classroom use**
  - Increase volume to match murmur levels
- Pulmonic auscultation sound:
  - Currently too muffled
  - Should be **clearer and slightly higher pitched**
  - S2 should be **more prominent than S1**

---

### Rhythm & Feature Requests
- Add **Atrial Fibrillation (AFib)** option
  - Enables practice of **irregular pulse detection**
- *(Optional)* Add **visual atrial quivering** during AFib

---

### Clinical Accuracy Fixes
- Auscultation landmarks are **positioned too high**
- Correct placements:
  - **Aortic:** 2nd intercostal space, right sternal border  
  - **Pulmonic:** 2nd intercostal space, left sternal border  
  - **Tricuspid:** 4th intercostal space, left sternal border  
  - **Mitral:** 5th intercostal space, midclavicular line  

---

### System Issues / Bugs
- **EKG display is glitchy**
  - Shows incorrect/random waveforms (e.g., unexpected p-waves/PVCs)
- **Exercise mode is not functioning correctly**
  - Does not increase heart rate as expected

---

### Feature Priority / Scope Notes
- EKG feature is **not critical for first-year students**
  - May be simplified or removed unless required
- Advanced heart sounds are **lower priority**
  - Focus on **common, clinically relevant rhythms**

---

### Overall Takeaways
- Tool is **valuable and improves student confidence**
- Priorities moving forward:
  - Usability
  - Audio clarity
  - Clinical accuracy
  - Core rhythm training

---

> Feedback was translated into backlog items to guide future development and align with first-year nursing education needs.
