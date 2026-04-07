/**
 * EKGVisualizer
 *
 * Draws a sweeping real-time EKG strip on a <canvas> element.
 *
 * Signal generation strategy:
 *   - Reads the current rhythm name from RhythmController.
 *   - Looks up the raw template in rhythmTemplates to get precise S1/S2
 *     timestamps (0-1 normalized within a heart-beat cycle).
 *   - Derives canonical EKG wave positions (P, QRS, T) relative to those
 *     timestamps so every rhythm change is automatically reflected.
 *   - Renders murmurs/extra sounds as low-amplitude noise bursts for any
 *     sound event that isn't S1 or S2.
 *   - Uses a left-to-right sweeping pen with a dark erase band just ahead.
 */

import { TimingController } from "./TimingController.js";
import { RhythmController } from "./RhythmController.js";
import {
  rhythmTemplates,
  SoundKey,
} from "./heart/heartRhythms/config/rhythm-templates.js";

// ─── Gaussian helper ────────────────────────────────────────────────────────
function gaussian(
  x: number,
  amplitude: number,
  center: number,
  sigma: number,
): number {
  return amplitude * Math.exp(-((x - center) ** 2) / (2 * sigma ** 2));
}

/**
 * Wraps a value into [-0.5, 0.5] for circular distance on a 0-1 cycle.
 */
function cyclicDelta(probe: number, ref: number): number {
  let d = (probe - ref) % 1.0;
  if (d > 0.5) d -= 1.0;
  if (d < -0.5) d += 1.0;
  return d;
}

// ─── EKG waveform at a given cycle phase ────────────────────────────────────
interface EKGTimes {
  s1: number; // 0-1 normalised time of S1
  s2: number; // 0-1 normalised time of S2
  /** additional sound events to render as murmur noise */
  extras: Array<{ time: number; key: SoundKey }>;
}

/**
 * Build the EKG signal value (arbitrary amplitude units) for `phase` ∈ [0,1).
 */
function ekgSignal(phase: number, times: EKGTimes): number {
  const { s1, s2 } = times;

  // ── P wave: brief atrial depolarisation just before S1 ──────────────
  const pCenter = s1 - 0.12;
  const p = gaussian(cyclicDelta(phase, pCenter), 0.2, 0, 0.018);

  // ── QRS complex around S1 ───────────────────────────────────────────
  const qCenter = s1 - 0.035;
  const rCenter = s1 - 0.01;
  const sCenter = s1 + 0.012;
  const q = gaussian(cyclicDelta(phase, qCenter), -0.15, 0, 0.006);
  const r = gaussian(cyclicDelta(phase, rCenter), 1.0, 0, 0.009);
  const s = gaussian(cyclicDelta(phase, sCenter), -0.25, 0, 0.007);

  // ── T wave: ventricular repolarisation before S2 ────────────────────
  const tCenter = s2 - 0.07;
  const t = gaussian(cyclicDelta(phase, tCenter), 0.3, 0, 0.026);

  // ── Murmur / extra-sound noise bursts ───────────────────────────────
  let noise = 0;
  for (const extra of times.extras) {
    const d = cyclicDelta(phase, extra.time);
    // low-frequency ripple for murmurs, sharper click for Click
    if (extra.key === "Click") {
      noise += gaussian(d, 0.4, 0, 0.006);
    } else if (
      extra.key === "SystolicMurmur" ||
      extra.key === "HolosystolicMurmur" ||
      extra.key === "EarlyDiastolicMurmur"
    ) {
      // ragged oscillation
      const halfWidth = 0.06;
      if (Math.abs(d) < halfWidth) {
        const env = 1 - Math.abs(d) / halfWidth;
        const freq = extra.key === "HolosystolicMurmur" ? 280 : 200;
        noise += env * 0.18 * Math.sin(freq * d * Math.PI * 2);
      }
    } else if (extra.key === "S3" || extra.key === "S4") {
      noise += gaussian(d, 0.18, 0, 0.014);
    }
  }

  return p + q + r + s + t + noise;
}

// ─── Extract timing info from the current rhythm template ───────────────────
function getTimings(): EKGTimes {
  const rhythmName = RhythmController.getInstance().getCurrentRhythmName();
  const template = rhythmTemplates[rhythmName];

  if (!template) {
    return { s1: 0.32, s2: 0.62, extras: [] };
  }

  let s1: number | undefined;
  let s2: number | undefined;
  const extras: Array<{ time: number; key: SoundKey }> = [];

  for (const event of template.sounds) {
    const key = event.soundKey;
    if (key === "S1" && s1 === undefined) {
      s1 = event.time;
    } else if (key === "S2" && s2 === undefined) {
      s2 = event.time;
    } else {
      extras.push({ time: event.time, key });
    }
  }

  return {
    s1: s1 ?? 0.32,
    s2: s2 ?? 0.62,
    extras,
  };
}

// ─── Main class ─────────────────────────────────────────────────────────────
export class EKGVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private running = false;
  private rafId = 0;

  /** px/s - how fast the sweep scrolls horizontally */
  private sweepSpeed = 180;

  /** cached timings, refreshed every time the rhythm name changes */
  private cachedRhythm = "";
  private cachedTimings: EKGTimes = { s1: 0.32, s2: 0.62, extras: [] };

  constructor(canvasId: string) {
    const el = document.getElementById(canvasId);
    if (!el || el.tagName !== "CANVAS") {
      throw new Error(`EKGVisualizer: no <canvas id="${canvasId}"> found`);
    }
    this.canvas = el as HTMLCanvasElement;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("EKGVisualizer: could not get 2D context");
    this.ctx = ctx;

    this.resize();
    window.addEventListener("resize", this.resize.bind(this));
  }

  // ── Public API ────────────────────────────────────────────────────────

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.reset();
    this.rafId = requestAnimationFrame(this.tick);
  }

  public stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  // ── Internals ─────────────────────────────────────────────────────────

  private reset(): void {
    this.ctx.fillStyle = "rgba(10, 5, 5, 0.95)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
  }

  private resize = (): void => {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    // Read the *CSS* size (parent box) and use it as pixel resolution
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (this.canvas.width === w && this.canvas.height === h) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.reset();
  };

  private drawGrid(): void {
    const { width, height } = this.canvas;
    this.ctx.strokeStyle = "rgba(231, 76, 60, 0.1)";
    this.ctx.lineWidth = 1;

    const cellW = this.sweepSpeed * 0.2; // 200 ms minor grid
    const cellH = height / 5;

    this.ctx.beginPath();
    for (let x = 0; x <= width; x += cellW) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += cellH) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
    }
    this.ctx.stroke();

    // baseline
    this.ctx.strokeStyle = "rgba(231, 76, 60, 0.25)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height * 0.65);
    this.ctx.lineTo(width, height * 0.65);
    this.ctx.stroke();
  }

  private prevX = -1;
  private prevY = -1;

  private tick = (): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.tick);

    const timing = TimingController.getInstance();
    if (!timing.isAnimating()) return;

    const { width, height } = this.canvas;

    // ── Update timings cache if rhythm changed ──────────────────────
    const rhythmName = RhythmController.getInstance().getCurrentRhythmName();
    if (rhythmName !== this.cachedRhythm) {
      this.cachedRhythm = rhythmName;
      this.cachedTimings = getTimings();
      // Redraw grid on rhythm change
      this.reset();
      this.prevX = -1;
    }

    // ── Current sweep position ──────────────────────────────────────
    const nowMs = timing.getCurrentTime();
    const cycleDuration = timing.getCycleDuration(); // in ms
    const startMs = timing.getStartTime();

    // x scrolls continuously; wraps at canvas width
    const elapsedSec = (nowMs - startMs) / 1000;
    const x = (elapsedSec * this.sweepSpeed) % width;

    // ── EKG signal value ───────────────────────────────────────────
    const cycleProgress = timing.getCycleProgress();
    const signalVal = ekgSignal(cycleProgress, this.cachedTimings);

    // Map signal to canvas Y.  signal range roughly [-0.5, 1.1]
    const baseline = height * 0.65;
    const amplitude = height * 0.38;
    const y = baseline - signalVal * amplitude;

    // ── Erase band just ahead of the pen ──────────────────────────
    const eraseW = 28;
    this.ctx.fillStyle = "rgba(10, 5, 5, 0.97)";
    this.ctx.fillRect((x + 1) % width, 0, eraseW, height);
    // redraw grid lines inside erase band
    this.drawGridBand((x + 1) % width, eraseW);

    // ── Draw trace segment ────────────────────────────────────────
    if (this.prevX >= 0 && Math.abs(x - this.prevX) < width / 2) {
      // glow effect: wider, dimmer stroke behind the main line
      this.ctx.beginPath();
      this.ctx.strokeStyle = "rgba(231, 76, 60, 0.2)";
      this.ctx.lineWidth = 0;
      this.ctx.lineCap = "round";
      this.ctx.moveTo(this.prevX, this.prevY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      // main bright line
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#e74c3c";
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = "round";
      this.ctx.moveTo(this.prevX, this.prevY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }

    this.prevX = x;
    this.prevY = y;
  };

  /** Re-draw grid lines only within a vertical strip (for the erase band). */
  private drawGridBand(xStart: number, bandW: number): void {
    const { height } = this.canvas;
    this.ctx.strokeStyle = "rgba(231, 76, 60, 0.1)";
    this.ctx.lineWidth = 1;

    const cellW = this.sweepSpeed * 0.2;
    const cellH = height / 5;

    this.ctx.beginPath();
    // vertical grid within band
    const firstX = Math.ceil(xStart / cellW) * cellW;
    for (let gx = firstX; gx <= xStart + bandW; gx += cellW) {
      this.ctx.moveTo(gx, 0);
      this.ctx.lineTo(gx, height);
    }
    // horizontal grid across full width (cheaper to just redraw all)
    for (let gy = 0; gy <= height; gy += cellH) {
      this.ctx.moveTo(xStart, gy);
      this.ctx.lineTo(xStart + bandW, gy);
    }
    this.ctx.stroke();

    // baseline
    this.ctx.strokeStyle = "rgba(231, 76, 60, 0.25)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(xStart, height * 0.65);
    this.ctx.lineTo(xStart + bandW, height * 0.65);
    this.ctx.stroke();
  }
}
