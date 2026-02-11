/**
 * AudioEngine unit tests
 *
 * Because AudioEngine depends on the Web Audio API, we mock AudioContext and
 * its nodes (GainNode, BiquadFilterNode, AudioBufferSourceNode) via jsdom globals.
 */

import { AudioEngine, MurmurEnvelope } from "../AudioEngine";

// ---- Helpers to build a minimal mock AudioContext ----

function createMockAudioBuffer(): AudioBuffer {
  return {
    duration: 1,
    length: 44100,
    numberOfChannels: 1,
    sampleRate: 44100,
    getChannelData: jest.fn(),
    copyFromChannel: jest.fn(),
    copyToChannel: jest.fn(),
  } as unknown as AudioBuffer;
}

function createMockGainNode() {
  return {
    gain: {
      value: 1,
      setValueAtTime: jest.fn(),
      linearRampToValueAtTime: jest.fn(),
    },
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
}

function createMockBiquadFilterNode() {
  return {
    type: "lowpass",
    frequency: { value: 350 },
    Q: { value: 1 },
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
}

function createMockBufferSource() {
  return {
    buffer: null as AudioBuffer | null,
    playbackRate: { value: 1 },
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    disconnect: jest.fn(),
  };
}

function createMockAudioContext() {
  const ctx = {
    currentTime: 0,
    destination: {},
    createGain: jest.fn(() => createMockGainNode()),
    createBiquadFilter: jest.fn(() => createMockBiquadFilterNode()),
    createBufferSource: jest.fn(() => createMockBufferSource()),
    decodeAudioData: jest.fn(),
  };
  return ctx;
}

// ---- Reset singleton between tests ----

function resetAudioEngine(): void {
  // Access the private static field to reset the singleton
  (AudioEngine as any).instance = undefined;
}

// ---- Tests ----

describe("AudioEngine", () => {
  let mockCtx: ReturnType<typeof createMockAudioContext>;

  beforeEach(() => {
    resetAudioEngine();
    mockCtx = createMockAudioContext();

    // Mock the global AudioContext constructor
    (globalThis as any).AudioContext = jest.fn(() => mockCtx);
    (globalThis as any).webkitAudioContext = undefined;

    // Mock fetch
    (globalThis as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ---------- Singleton ----------
  describe("singleton", () => {
    it("returns the same instance", () => {
      const a = AudioEngine.getInstance();
      const b = AudioEngine.getInstance();
      expect(a).toBe(b);
    });
  });

  // ---------- Initialization ----------
  describe("initialize()", () => {
    it("creates an AudioContext on first call", () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();
      expect(globalThis.AudioContext).toHaveBeenCalledTimes(1);
    });

    it("does not create a second AudioContext on repeated calls", () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();
      engine.initialize();
      expect(globalThis.AudioContext).toHaveBeenCalledTimes(1);
    });

    it("falls back to webkitAudioContext when AudioContext is missing", () => {
      (globalThis as any).AudioContext = undefined;
      (globalThis as any).webkitAudioContext = jest.fn(() => mockCtx);

      const engine = AudioEngine.getInstance();
      engine.initialize();
      expect((globalThis as any).webkitAudioContext).toHaveBeenCalled();
    });
  });

  // ---------- Volume ----------
  describe("volume", () => {
    it("defaults to 0.7", () => {
      const engine = AudioEngine.getInstance();
      expect(engine.getGlobalVolume()).toBe(0.7);
    });

    it("clamps to [0, 1]", () => {
      const engine = AudioEngine.getInstance();
      engine.setGlobalVolume(-0.5);
      expect(engine.getGlobalVolume()).toBe(0);
      engine.setGlobalVolume(2);
      expect(engine.getGlobalVolume()).toBe(1);
    });

    it("sets volume within range", () => {
      const engine = AudioEngine.getInstance();
      engine.setGlobalVolume(0.5);
      expect(engine.getGlobalVolume()).toBe(0.5);
    });
  });

  // ---------- loadSound ----------
  describe("loadSound()", () => {
    it("returns null when audioContext not initialized", async () => {
      const engine = AudioEngine.getInstance();
      const result = await engine.loadSound("test.wav");
      expect(result).toBeNull();
    });

    it("fetches, decodes and caches the buffer", async () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();

      const mockBuffer = createMockAudioBuffer();
      const arrayBuf = new ArrayBuffer(8);

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        arrayBuffer: () => Promise.resolve(arrayBuf),
      });
      mockCtx.decodeAudioData.mockResolvedValue(mockBuffer);

      const buffer = await engine.loadSound("assets/sounds/s1.wav");
      expect(buffer).toBe(mockBuffer);
      expect(globalThis.fetch).toHaveBeenCalledWith("assets/sounds/s1.wav");
    });

    it("returns cached buffer on second call", async () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();

      const mockBuffer = createMockAudioBuffer();
      const arrayBuf = new ArrayBuffer(8);

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        arrayBuffer: () => Promise.resolve(arrayBuf),
      });
      mockCtx.decodeAudioData.mockResolvedValue(mockBuffer);

      await engine.loadSound("s1.wav");
      const second = await engine.loadSound("s1.wav");

      expect(second).toBe(mockBuffer);
      // fetch should only be called once - second call uses cache
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    it("returns null when fetch fails", async () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();

      (globalThis.fetch as jest.Mock).mockRejectedValue(
        new Error("network error"),
      );

      const result = await engine.loadSound("bad.wav");
      expect(result).toBeNull();
    });
  });

  // ---------- playSound ----------
  describe("playSound()", () => {
    it("does nothing when audioContext is not initialized", async () => {
      const engine = AudioEngine.getInstance();
      // Should not throw
      await engine.playSound("test.wav");
    });

    it("creates a source, gain node, and plays (standard path)", async () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();

      const mockBuffer = createMockAudioBuffer();
      const arrayBuf = new ArrayBuffer(8);

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        arrayBuffer: () => Promise.resolve(arrayBuf),
      });
      mockCtx.decodeAudioData.mockResolvedValue(mockBuffer);

      await engine.playSound("s1.wav", { volume: 0.8, pitch: 1.2 });

      expect(mockCtx.createBufferSource).toHaveBeenCalled();
      expect(mockCtx.createGain).toHaveBeenCalled();
    });

    it("applies envelope path with filters for murmur sounds", async () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();

      const mockBuffer = createMockAudioBuffer();
      const arrayBuf = new ArrayBuffer(8);

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        arrayBuffer: () => Promise.resolve(arrayBuf),
      });
      mockCtx.decodeAudioData.mockResolvedValue(mockBuffer);

      const envelope: MurmurEnvelope = {
        attack: 0.1,
        sustain: 0.2,
        decay: 0.1,
        peakGain: 0.8,
        hpFreq: 100,
        lpFreq: 4000,
      };

      await engine.playSound("murmur.wav", { envelope });

      // Should create biquad filters for hp and lp
      expect(mockCtx.createBiquadFilter).toHaveBeenCalledTimes(2);
      expect(mockCtx.createGain).toHaveBeenCalled();
    });

    it("skips highpass filter when hpFreq is <= 20", async () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();

      const mockBuffer = createMockAudioBuffer();
      const arrayBuf = new ArrayBuffer(8);

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        arrayBuffer: () => Promise.resolve(arrayBuf),
      });
      mockCtx.decodeAudioData.mockResolvedValue(mockBuffer);

      const envelope: MurmurEnvelope = {
        attack: 0.1,
        sustain: 0.2,
        decay: 0.1,
        peakGain: 0.8,
        hpFreq: 15,
        lpFreq: 4000,
      };

      await engine.playSound("murmur.wav", { envelope });
      // Only lowpass filter created
      expect(mockCtx.createBiquadFilter).toHaveBeenCalledTimes(1);
    });

    it("skips lowpass filter when lpFreq is >= 20000", async () => {
      const engine = AudioEngine.getInstance();
      engine.initialize();

      const mockBuffer = createMockAudioBuffer();
      const arrayBuf = new ArrayBuffer(8);

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        arrayBuffer: () => Promise.resolve(arrayBuf),
      });
      mockCtx.decodeAudioData.mockResolvedValue(mockBuffer);

      const envelope: MurmurEnvelope = {
        attack: 0.1,
        sustain: 0.2,
        decay: 0.1,
        peakGain: 0.8,
        hpFreq: 100,
        lpFreq: 22000,
      };

      await engine.playSound("murmur.wav", { envelope });
      // Only highpass filter created
      expect(mockCtx.createBiquadFilter).toHaveBeenCalledTimes(1);
    });
  });
});
