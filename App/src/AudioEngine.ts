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
    options?: { volume?: number; pitch?: number },
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

      // Create and configure audio nodes
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      // Set volume (keyframe volume * global volume)
      gainNode.gain.value = (options?.volume ?? 1) * this.globalVolume;

      // Set pitch/playback rate
      source.playbackRate.value = options?.pitch ?? 1;

      // Connect audio graph: source -> gain -> destination
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start();
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
