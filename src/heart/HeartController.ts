// Initially created with Cursor using claude-4-sonnet
import * as THREE from "three";
import { CurveFunction, MotionCurves } from "../utils/curves.js";
import {
  defaultRhythm,
  AnimationKeyframe,
  SoundKeyframe,
} from "./heartRhythms/Rhythm.js";
import { AudioEngine } from "../AudioEngine.js";
import { AnimationController } from "../AnimationController.js";
import { RhythmController } from "../RhythmController.js";
import { TimingController } from "../TimingController.js";
import { ISoundEmitter } from "../audio/interfaces.js";

/**
 * HeartController - Orchestrator coordinating animation, rhythm, timing, and audio
 * Follows the Single Responsibility Principle by delegating to specialized controllers
 * Implements ISoundEmitter for polymorphic sound management
 */
export class HeartController implements ISoundEmitter {
  private static instance: HeartController;

  // Sound deduplication tracking
  private lastPlayedSounds: Map<string, number> = new Map();

  // Animation curve type
  private motionCurveType: CurveFunction = MotionCurves.BATHTUB;

  // UI element reference
  private rhythmSelect: HTMLSelectElement | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): HeartController {
    if (!HeartController.instance) {
      HeartController.instance = new HeartController();
    }
    return HeartController.instance;
  }

  /**
   * Initialize all controllers
   */
  public initialize(meshes: THREE.Mesh[]): void {
    AnimationController.getInstance().initialize(meshes);
    AudioEngine.getInstance().initialize();
  }

  /**
   * Start heart animation
   */
  public start(): void {
    TimingController.getInstance().start();
    this.lastPlayedSounds.clear();
  }

  /**
   * Stop heart animation
   */
  public stop(): void {
    TimingController.getInstance().stop();
  }

  /**
   * Check if animation is running
   */
  public isAnimating(): boolean {
    return TimingController.getInstance().isAnimating();
  }

  // ============ BPM / Timing Delegation ============

  public setBPM(bpm: number): void {
    TimingController.getInstance().setBPM(bpm);
    this.lastPlayedSounds.clear();
  }

  public getBPM(): number {
    return TimingController.getInstance().getBPM();
  }

  public setCycleDuration(duration: number): void {
    TimingController.getInstance().setCycleDuration(duration);
  }

  public getCycleDuration(): number {
    return TimingController.getInstance().getCycleDuration();
  }

  // ============ Rhythm Delegation ============

  public switchToRhythm(
    rhythm: Parameters<typeof RhythmController.prototype.switchToRhythm>[0],
  ): void {
    RhythmController.getInstance().switchToRhythm(rhythm);
  }

  public getRhythm() {
    return RhythmController.getInstance().getRhythm();
  }

  public getAvailableRhythms() {
    return RhythmController.getInstance().getAvailableRhythms();
  }

  public getCurrentRhythmName(): string {
    return RhythmController.getInstance().getCurrentRhythmName();
  }

  public setAuscultationLocation(
    location: Parameters<
      typeof RhythmController.prototype.setAuscultationLocation
    >[0],
  ): void {
    RhythmController.getInstance().setAuscultationLocation(location);
  }

  // ============ ISoundEmitter Interface ============

  /**
   * Get unique identifier for this emitter
   */
  public getId(): string {
    return "heart";
  }

  /**
   * Set the emitter's volume (implements ISoundEmitter)
   */
  public setVolume(volume: number): void {
    AudioEngine.getInstance().setGlobalVolume(volume);
  }

  /**
   * Get the emitter's current volume (implements ISoundEmitter)
   */
  public getVolume(): number {
    return AudioEngine.getInstance().getGlobalVolume();
  }

  /**
   * Check if emitter is active (implements ISoundEmitter)
   */
  public isActive(): boolean {
    return this.isAnimating();
  }

  // Legacy methods for backward compatibility
  public setSoundVolume(volume: number): void {
    this.setVolume(volume);
  }

  public getSoundVolume(): number {
    return this.getVolume();
  }

  // ============ Motion Curve ============

  public setMotionCurveType(curveType: CurveFunction): void {
    this.motionCurveType = curveType;
  }

  public getMotionCurveType(): CurveFunction {
    return this.motionCurveType;
  }

  // ============ External Blendshapes ============

  public applyExternalBlendshapes(blendshapes: {
    categories: { categoryName: string; score: number }[];
  }): void {
    AnimationController.getInstance().applyExternalBlendshapes(blendshapes);
  }

  // ============ Main Update Loop ============

  /**
   * Update the animation - call every frame
   * @param _deltaTime - Time since last frame (unused, HeartController uses TimingController)
   */
  public update(_deltaTime?: number): void {
    const timing = TimingController.getInstance();
    const animation = AnimationController.getInstance();

    if (!timing.isAnimating()) {
      return;
    }

    timing.tick();
    const cycleProgress = timing.getCycleProgress();

    // Get keyframes from current rhythm
    const rhythm = RhythmController.getInstance().getRhythm();
    const animationKeyframes = rhythm.animation ?? defaultRhythm.animation;
    const soundKeyframes = rhythm.sound ?? defaultRhythm.sound;

    // Reset animation targets
    animation.resetTargets();

    // Process animation keyframes
    if (animationKeyframes) {
      for (const keyframe of animationKeyframes) {
        this.processAnimationKeyframe(keyframe, cycleProgress);
      }
    }

    // Process sound keyframes
    if (soundKeyframes) {
      for (const keyframe of soundKeyframes) {
        this.processSoundKeyframe(keyframe);
      }
    }

    // Apply interpolation and update meshes
    animation.applyLerp(0.1);
    animation.applyToMeshes();
  }

  /**
   * Process an animation keyframe
   */
  private processAnimationKeyframe(
    keyframe: AnimationKeyframe,
    cycleProgress: number,
  ): void {
    const { time, animationEnd, blendshape, value, curveFunction } = keyframe;
    const animation = AnimationController.getInstance();

    if (cycleProgress >= time && cycleProgress <= animationEnd) {
      const keyframeDuration = animationEnd - time;
      const keyframeProgress = (cycleProgress - time) / keyframeDuration;
      const animatedValue = curveFunction(keyframeProgress) * value;

      for (const chamber of blendshape) {
        const chamberName =
          animation.CHAMBER_NAMES[
            chamber as keyof typeof animation.CHAMBER_NAMES
          ];
        if (chamberName) {
          animation.setTargetBlendshape(chamberName, animatedValue);
        }
      }
    }
  }

  /**
   * Process a sound keyframe
   */
  private processSoundKeyframe(keyframe: SoundKeyframe): void {
    const { time, soundPath, volume, pitch, envelope } = keyframe;
    const timing = TimingController.getInstance();

    const currentCycle = timing.getCurrentCycle();
    const beatTime =
      timing.getStartTime() + (currentCycle + time) * timing.getCycleDuration();

    if (
      timing.getPrevTime() < beatTime &&
      timing.getCurrentTime() >= beatTime
    ) {
      // Use soundPath + time as unique key to allow the same sound to play multiple times per cycle
      const uniqueKey = `${soundPath}_${time}`;
      const lastPlayed = this.lastPlayedSounds.get(uniqueKey) || -1;
      if (lastPlayed < currentCycle) {
        AudioEngine.getInstance().playSound(soundPath, {
          volume,
          pitch,
          envelope,
        });
        this.lastPlayedSounds.set(uniqueKey, currentCycle);
      }
    }
  }

  // ============ UI Initialization ============

  public initializeRhythmSelect(selectId: string): void {
    const select = document.getElementById(
      selectId,
    ) as HTMLSelectElement | null;
    if (!select) {
      console.warn("Rhythm select element not found:", selectId);
      return;
    }
    this.rhythmSelect = select;
  }
}
