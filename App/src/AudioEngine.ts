/**
 * Murmur envelope configuration for gain automation + filtering
 * Used to shape a single source file into different murmur variants
 */
export type MurmurEnvelope = {
  /** Time in seconds to ramp from silence to peakGain */
  attack: number;
  /** Time in seconds to hold at peakGain */
  sustain: number;
  /** Time in seconds to ramp from peakGain to silence */
  decay: number;
  /** Peak gain multiplier (0.0 - 1.0+) */
  peakGain: number;
  /** High-pass filter frequency in Hz (removes low rumble) */
  hpFreq?: number;
  /** Low-pass filter frequency in Hz (removes high hiss) */
  lpFreq?: number;
};

/**
 * AudioEngine - Singleton class for managing audio playback
 * Handles AudioContext initialization, buffer loading/caching, and sound playback
 */
export class AudioEngine {
  private static instance: AudioEngine;

  private audioContext: AudioContext | null = null;
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private globalVolume: number = 0.7;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /**
   * Initialize the AudioContext
   * Should be called after a user gesture for browser autoplay policy compliance
   */
  public initialize(): void {
    if (this.audioContext) {
      return;
    }
    try {
      this.audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  /**
   * Load a sound file and cache its buffer
   * @param path - Path to the audio file
   * @returns The loaded AudioBuffer, or null if loading failed
   */
  public async loadSound(path: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) {
      console.warn("Audio context not initialized");
      return null;
    }

    // Return cached buffer if available
    const cached = this.soundBuffers.get(path);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.soundBuffers.set(path, buffer);
      return buffer;
    } catch (error) {
      console.warn(`Failed to load sound ${path}:`, error);
      return null;
    }
  }

  /**
   * Play a sound from the given path
   * @param path - Path to the audio file
   * @param options - Optional playback options (volume, pitch)
   */
  public async playSound(
    path: string,
    options?: { volume?: number; pitch?: number; envelope?: MurmurEnvelope },
  ): Promise<void> {
    if (!this.audioContext) {
      console.warn("Audio context not available");
      return;
    }

    try {
      // Load or retrieve cached buffer
      let buffer = this.soundBuffers.get(path);

      if (!buffer) {
        buffer = await this.loadSound(path);
        if (!buffer) {
          return;
        }
      }

      // Create source
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = options?.pitch ?? 1;

      const baseVolume = (options?.volume ?? 1) * this.globalVolume;

      if (options?.envelope) {
        // ---- Envelope-based playback (murmur modulation) ----
        const env = options.envelope;
        const now = this.audioContext.currentTime;
        const totalDur = env.attack + env.sustain + env.decay;

        // Build chain: source → highpass → lowpass → envelope gain → destination
        let lastNode: AudioNode = source;

        // High-pass filter
        if (env.hpFreq && env.hpFreq > 20) {
          const hp = this.audioContext.createBiquadFilter();
          hp.type = "highpass";
          hp.frequency.value = env.hpFreq;
          hp.Q.value = 0.7;
          lastNode.connect(hp);
          lastNode = hp;
        }

        // Low-pass filter
        if (env.lpFreq && env.lpFreq < 20000) {
          const lp = this.audioContext.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.value = env.lpFreq;
          lp.Q.value = 0.7;
          lastNode.connect(lp);
          lastNode = lp;
        }

        // Gain envelope (attack → sustain → decay)
        const envGain = this.audioContext.createGain();
        envGain.gain.setValueAtTime(0.001, now);

        if (env.attack > 0) {
          envGain.gain.linearRampToValueAtTime(
            env.peakGain * baseVolume,
            now + env.attack,
          );
        } else {
          envGain.gain.setValueAtTime(env.peakGain * baseVolume, now);
        }

        // Hold at peak through sustain
        envGain.gain.setValueAtTime(
          env.peakGain * baseVolume,
          now + env.attack + env.sustain,
        );

        // Decay to silence
        envGain.gain.linearRampToValueAtTime(0.001, now + totalDur);

        lastNode.connect(envGain);
        envGain.connect(this.audioContext.destination);

        source.start(now);
        source.stop(now + totalDur + 0.05);
      } else {
        // ---- Standard playback (no envelope) ----
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = baseVolume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.warn(`Failed to play sound ${path}:`, error);
    }
  }

  /**
   * Set the global volume for all sounds
   * @param value - Volume level (0.0 to 1.0)
   */
  public setGlobalVolume(value: number): void {
    this.globalVolume = Math.max(0, Math.min(1, value));
  }

  /**
   * Get the current global volume
   */
  public getGlobalVolume(): number {
    return this.globalVolume;
  }
}
