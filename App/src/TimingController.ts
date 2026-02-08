/**
 * TimingController - Singleton managing playback clock and BPM
 */
export class TimingController {
  private static instance: TimingController;

  private isRunning: boolean = false;
  private startTime: number = 0;
  private currentTime: number = 0;
  private prevTime: number = 0;
  private cycleDuration: number = 1000; // Default: 60 BPM

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TimingController {
    if (!TimingController.instance) {
      TimingController.instance = new TimingController();
    }
    return TimingController.instance;
  }

  /**
   * Start playback
   */
  public start(): void {
    this.isRunning = true;
    this.startTime = performance.now();
  }

  /**
   * Stop playback
   */
  public stop(): void {
    this.isRunning = false;
  }

  /**
   * Update timing - call each frame
   */
  public tick(): void {
    this.prevTime = this.currentTime;
    this.currentTime = performance.now();
  }

  /**
   * Set heart rate in BPM
   */
  public setBPM(bpm: number): void {
    this.cycleDuration = (60 / bpm) * 1000;
    this.startTime = performance.now();
  }

  /**
   * Get current BPM
   */
  public getBPM(): number {
    return (60 * 1000) / this.cycleDuration;
  }

  /**
   * Set cycle duration in milliseconds
   */
  public setCycleDuration(duration: number): void {
    this.cycleDuration = duration;
    this.startTime = performance.now();
  }

  /**
   * Get cycle duration in milliseconds
   */
  public getCycleDuration(): number {
    return this.cycleDuration;
  }

  /**
   * Get normalized cycle progress (0 to 1)
   */
  public getCycleProgress(): number {
    const elapsed = (this.currentTime - this.startTime) % this.cycleDuration;
    return elapsed / this.cycleDuration;
  }

  /**
   * Get current cycle number
   */
  public getCurrentCycle(): number {
    return Math.floor((this.currentTime - this.startTime) / this.cycleDuration);
  }

  /**
   * Get start time
   */
  public getStartTime(): number {
    return this.startTime;
  }

  /**
   * Get current time
   */
  public getCurrentTime(): number {
    return this.currentTime;
  }

  /**
   * Get previous frame time
   */
  public getPrevTime(): number {
    return this.prevTime;
  }

  /**
   * Check if animation is running
   */
  public isAnimating(): boolean {
    return this.isRunning;
  }
}
