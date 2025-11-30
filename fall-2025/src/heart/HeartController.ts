// Initially created with Cursor using claude-4-sonnet
import * as THREE from 'three';
import { CurveFunction, MotionCurves } from '../utils/curves.js';
import { defaultRhythm, Rhythm, availableRhythms } from './heartRhythms/Rhythm.js';
import { AnimationKeyframe, SoundKeyframe } from './heartRhythms/Rhythm.js';
import { rhythmGroups } from "./heartRhythms/rhythmOptions.js";

interface BlendshapeCategory {
    categoryName: string;
    score: number;
}

interface BlendshapeData {
    categories: BlendshapeCategory[];
}

/**
 * Singleton HeartController manages heart animation using blendshapes
 * with a continuous clock system and lerp-based transitions
 */
export class HeartController {
    private static instance: HeartController;
    
    // Animation state
    private isRunning: boolean = false;
    private startTime: number = 0;
    private cycleDuration: number = 1000;
    private currentTime: number = 0;
    private prevTime: number = 0;
    private motionCurveType: CurveFunction = MotionCurves.BATHTUB;
    private rhythm: Rhythm = defaultRhythm;
    
    // Sound management
    private audioContext: AudioContext | null = null;
    private soundBuffers: Map<string, AudioBuffer> = new Map();
    private lastPlayedSounds: Map<string, number> = new Map();
    private soundVolume: number = 0.7; // Default volume
    
    // Blendshapes
    private morphTargetMeshes: THREE.Mesh[] = [];
    private currentBlendshapes: Map<string, number> = new Map();
    private targetBlendshapes: Map<string, number> = new Map();

    //Rhythm Options
    private rhythmSelect: HTMLSelectElement | null = null;

    // Heart chamber names mapping from rhythm names to actual blendshape names
    private readonly CHAMBER_NAMES = {
        LA: 'LA',
        RA: 'RA', 
        LV: 'LV',
        RV: 'RV'
    };
    
    private constructor() {
        // Initialize default blendshape values
        Object.values(this.CHAMBER_NAMES).forEach(name => {
            this.currentBlendshapes.set(name, 0);
            this.targetBlendshapes.set(name, 0);
        });
    }
    
    /**
     * Get the singleton instance
     */
    public static getInstance(): HeartController {
        if (!HeartController.instance) {
            HeartController.instance = new HeartController();
        }
        return HeartController.instance;
    }
    
    /**
     * Initialize the controller with morph target meshes
     */
    public initialize(meshes: THREE.Mesh[]): void {
        this.morphTargetMeshes = meshes;
        this.initializeAudio();
    }
    
    /**
     * Initialize audio context for sound playback
     */
    private initializeAudio(): void {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    
    /**
     * Start the heart animation
     */
    public start(): void {
        this.isRunning = true;
        this.startTime = performance.now();
        this.lastPlayedSounds.clear();
    }
    
    /**
     * Stop the heart animation
     */
    public stop(): void {
        this.isRunning = false;
    }
    
    /**
     * Set the heart cycle duration in milliseconds
     */
    public setCycleDuration(duration: number): void {
        this.cycleDuration = duration;
        this.startTime = performance.now(); // Reset timing
    }
    
    /**
     * Set the heart rate in beats per minute (BPM)
     */
    public setBPM(bpm: number): void {
        // Convert BPM to milliseconds per beat
        // 60 BPM = 1 beat per second = 1000ms per beat
        this.cycleDuration = (60 / bpm) * 1000;
        this.startTime = performance.now();
        this.lastPlayedSounds.clear();
    }
    
    /**
     * Get current BPM
     */
    public getBPM(): number {
        // Convert milliseconds per beat back to BPM
        return (60 * 1000) / this.cycleDuration;
    }
    
    /**
     * Get current cycle duration
     */
    public getCycleDuration(): number {
        return this.cycleDuration;
    }
    
    /**
     * Set the motion curve type for heart animations
     */
    public setMotionCurveType(curveType: CurveFunction): void {
        this.motionCurveType = curveType;
    }
    
    /**
     * Set the heart rhythm pattern
     */
    public setRhythm(rhythm: Rhythm): void {
        this.rhythm = rhythm;
    }
    
    /**
     * Get the current rhythm
     */
    public getRhythm(): Rhythm {
        return this.rhythm;
    }
    
    /**
     * Switch to a different rhythm pattern
     */
    public switchToRhythm(rhythm: Rhythm): void {
        this.setRhythm(rhythm);
    }
    
    /**
     * Get all available rhythm patterns
     */
    public getAvailableRhythms(): Rhythm[] {
        return availableRhythms;
    }
    
    /**
     * Switch to rhythm by name
     */
    public switchToRhythmByName(name: string): boolean {
        const rhythm = availableRhythms.find(r => r.name === name);
        if (rhythm) {
            this.switchToRhythm(rhythm);
            return true;
        }
        console.warn(`Rhythm "${name}" not found`);
        return false;
    }
    
    /**
     * Get current rhythm name
     */
    public getCurrentRhythmName(): string {
        return this.rhythm.name;
    }
    
    /**
     * Set sound volume (0.0 to 1.0)
     */
    public setSoundVolume(volume: number): void {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Get current sound volume
     */
    public getSoundVolume(): number {
        return this.soundVolume;
    }
    
    /**
     * Get the current motion curve type
     */
    public getMotionCurveType(): CurveFunction {
        return this.motionCurveType;
    }
    
    /**
     * Check if animation is running
     */
    public isAnimating(): boolean {
        return this.isRunning;
    }
    
    /**
     * Update the animation - call this every frame
     */
    public update(): void {
        if (!this.isRunning || this.morphTargetMeshes.length === 0) {
            return;
        }
        this.prevTime = this.currentTime;
        this.currentTime = performance.now();
        this.updateHeartCycle();
        this.applyBlendshapes();
    }
    
    /**
     * Apply external blendshape data (e.g., from MediaPipe)
     */
    public applyExternalBlendshapes(blendshapes: BlendshapeData): void {
        const coefsMap = new Map<string, number>();
        
        // Build coefficients map from categories
        for (const category of blendshapes.categories) {
            coefsMap.set(category.categoryName, category.score);
        }
        
        // Apply coefficients to all morph target meshes
        for (const mesh of this.morphTargetMeshes) {
            if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
                continue;
            }
            
            for (const [name, value] of coefsMap) {
                if (!Object.keys(mesh.morphTargetDictionary).includes(name)) {
                    continue;
                }
                
                const idx = mesh.morphTargetDictionary[name];
                if (typeof idx === 'number' && mesh.morphTargetInfluences) {
                    mesh.morphTargetInfluences[idx] = value;
                }
            }
        }
    }
    
    /**
     * Update the heart cycle animation based on the current rhythm
     */
    // Generated with Cursor using claude-4-sonnet
    private updateHeartCycle(): void {
        // Calculate progress within the current cycle (0 to 1)
        const elapsed = (this.currentTime - this.startTime) % this.cycleDuration;
        const cycleProgress = elapsed / this.cycleDuration;
        
        // Get the animation and sound keyframes from the current rhythm
        const animationKeyframes = this.rhythm.animation ?? defaultRhythm.animation;
        const soundKeyframes = this.rhythm.sound ?? defaultRhythm.sound;
        
        // Reset all target values to 0
        for (const chamberName of Object.values(this.CHAMBER_NAMES)) {
            this.targetBlendshapes.set(chamberName, 0);
        }
        
        // Process animation keyframes from the rhythm
        if (animationKeyframes) {
            for (const keyframe of animationKeyframes) {
                this.processAnimationKeyframe(keyframe, cycleProgress);
            }
        }
        
        // Process sound keyframes from the rhythm
        if (soundKeyframes) {
            for (const keyframe of soundKeyframes) {
                this.processSoundKeyframe(keyframe);
            }
        }
        
        // Use smooth transitions between current and target values
        const lerpFactor = 0.1; // Smooth interpolation factor
        
        for (const [name, target] of this.targetBlendshapes) {
            const current = this.currentBlendshapes.get(name) || 0;
            const newValue = this.lerp(current, target, lerpFactor);
            this.currentBlendshapes.set(name, newValue);
        }
    }
    
    /**
     * Apply current blendshape values to the meshes
     */
    private applyBlendshapes(): void {
        for (const mesh of this.morphTargetMeshes) {
            if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
                continue;
            }
            
            for (const [name, value] of this.currentBlendshapes) {
                if (!Object.keys(mesh.morphTargetDictionary).includes(name)) {
                    continue;
                }
                
                const idx = mesh.morphTargetDictionary[name];
                if (typeof idx === 'number' && mesh.morphTargetInfluences) {
                    mesh.morphTargetInfluences[idx] = value;
                }
            }
        }
    }
    
    
    /**
     * Process an animation keyframe based on cycle progress
     */
    private processAnimationKeyframe(keyframe: AnimationKeyframe, cycleProgress: number): void {
        const { time, animationEnd, blendshape, value, curveFunction } = keyframe;
        
        // Check if we're within the keyframe's time range
        if (cycleProgress >= time && cycleProgress <= animationEnd) {
            // Calculate progress within this keyframe (0 to 1)
            const keyframeDuration = animationEnd - time;
            const keyframeProgress = (cycleProgress - time) / keyframeDuration;
            
            // Apply the curve function to get the animated value
            const animatedValue = curveFunction(keyframeProgress) * value;
            
            // Apply to all specified blendshapes
            for (const chamber of blendshape) {
                const chamberName = this.CHAMBER_NAMES[chamber as keyof typeof this.CHAMBER_NAMES];
                if (chamberName) {
                    this.targetBlendshapes.set(chamberName, animatedValue);
                }
            }
        }
    }
    
    /**
     * Process a sound keyframe based on cycle progress
     */
    private processSoundKeyframe(keyframe: SoundKeyframe): void {
        const { time, soundPath, volume, pitch } = keyframe;
        const currentCycle = Math.floor((this.currentTime - this.startTime) / this.cycleDuration);
        
        // Gets the exact moment the sound should be played within the current cycle
        const beatTime = this.startTime + (currentCycle + time) * this.cycleDuration;

        // This checks to make sure we have passed the exact time when the sound should play
        if (this.prevTime < beatTime && this.currentTime >= beatTime) {
            const lastPlayed = this.lastPlayedSounds.get(soundPath) || -1;
            // Only play sound if it wasn't played during the current cycle (every keyframe sound only plays once during the cycle)
            if (lastPlayed < currentCycle) {
                this.playSound(soundPath, volume, pitch);
                this.lastPlayedSounds.set(soundPath, currentCycle);
            }
        }
    }
    
    /**
     * Play a sound from the given path
     */
    private async playSound(soundPath: string, volume?: number, pitch?: number): Promise<void> {
        if (!this.audioContext) {
            console.warn('Audio context not available');
            return;
        }
        
        try {
            // Check if we already have the buffer cached
            let buffer = this.soundBuffers.get(soundPath);
            
            if (!buffer) {
                // Load the sound file
                const response = await fetch(soundPath);
                const arrayBuffer = await response.arrayBuffer();
                buffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.soundBuffers.set(soundPath, buffer);
            }
            
            // Create and play the sound with volume control
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            // Set volume
            gainNode.gain.value = (volume ?? 1) * this.soundVolume;
            
            // Add subtle pitch variation for realism (±3%)
            //const pitchVariation = 1 + (Math.random() - 0.5) * 0.06; // ±3%
            source.playbackRate.value = pitch || 1;
            
            // Connect audio nodes
            source.buffer = buffer;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start();
            
        } catch (error) {
            console.warn(`Failed to play sound ${soundPath}:`, error);
        }
    }
    
    /**
     * Lerp function for more natural transitions
     */
    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
    public initializeRhythmSelect(selectId: string): void {
        const select = document.getElementById(selectId) as HTMLSelectElement | null;
        if (!select) {
            console.warn("Rhythm select element not found:", selectId);
            return;
        }
        this.rhythmSelect = select;
    }

/*
    public loadRhythmOptions(location: string): void {
        if (!this.rhythmSelect) {
            console.warn("Rhythm select element not initialized");
            return;
        }

        const group = rhythmGroups[location];
        if (!group) {
            console.warn("No rhythm group for:", location);
            this.rhythmSelect.innerHTML = "";
            return;
        }

        // Clear existing options
        this.rhythmSelect.innerHTML = "";

        // Populate new options
        for (const opt of group) {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.label;
            this.rhythmSelect.appendChild(option);
        }

        // Auto-switch to the first rhythm
        const first = group[0];
        if (first) {
            this.switchToRhythmByName(first.value);
        }
    }
*/
}


