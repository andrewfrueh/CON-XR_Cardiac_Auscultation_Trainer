// Initially created with Cursor using claude-4-sonnet
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { HeartController } from './HeartController.js';
import { rhythmGroups } from './RhythmOptions.js';

// Global variables 
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls | null = null;
let heart: THREE.Object3D;
let heartGroup: THREE.Group;
let animationId: number | undefined;
let isAnimating: boolean = true; 
let fbxLoader: FBXLoader;
let textureLoader: THREE.TextureLoader;
let heartTexture: THREE.Texture | null = null;
let isDarkMode = true;
const rhythmSelect = document.getElementById('rhythmSelect') as HTMLSelectElement;

// Blendshapes/Morph targets variables for FBX
let morphTargetMeshes: THREE.Mesh[] = [];
let root: THREE.Bone | null = null;

// Heart controller singleton
let heartController: HeartController = HeartController.getInstance();

// Initialize the 3D scene
export function init(): void {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x171717);
    
    // Create camera - get container size for proper aspect ratio
    const container = document.getElementById('container');
    let aspect = window.innerWidth / window.innerHeight;
    if (container) {
        const containerRect = container.getBoundingClientRect();
        aspect = containerRect.width / containerRect.height;
    }
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 6); // Set initial zoom further out
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Size renderer to match container
    if (container) {
        // Size renderer to match container, not full viewport
        const containerRect = container.getBoundingClientRect();
        renderer.setSize(containerRect.width, containerRect.height);
        container.appendChild(renderer.domElement);
    } else {
        // Fallback to window size if container not found
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create controls
    try {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false; // Disable panning
        controls.enableZoom = true; // Enable zoom controls
        controls.minDistance = 4; // Minimum zoom distance
        controls.maxDistance = 10; // Maximum zoom distance
        
    } catch (error) {
        console.error('Error creating OrbitControls:', error);
    }
    
    // Initialize FBX loader and texture loader
    try {
        fbxLoader = new FBXLoader();
        textureLoader = new THREE.TextureLoader();
        
        // Load the heart texture
        loadHeartTexture();
    } catch (error) {
        console.error('Error initializing loaders:', error);
        return;
    }
    
    // Add lighting
    addLighting();
    
    // Load the heart model
    loadHeartModel();
    
    // Start animation loop
    animate();

    selectAuscultationPoint('aortic');
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Initialize blendshapes functionality for FBX models
function initFBXBlendshapes(fbxObject: THREE.Group): void {
    // Reset morph target meshes array
    morphTargetMeshes = [];
    root = null;
    
    // Traverse the FBX object to find bones and morph target meshes
    fbxObject.traverse((object: any) => {
        if (object.isBone && !root) {
            root = object as THREE.Bone;
        }
        
        if (!object.isMesh) return;
        
        const mesh = object as THREE.Mesh;
        if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
        
        morphTargetMeshes.push(mesh);
    });
    
    // Initialize heart controller with morph target meshes
    heartController.initialize(morphTargetMeshes);
    
    // Store morph targets globally for access
    (window as any).morphTargetMeshes = morphTargetMeshes;
    (window as any).updateBlendshapes = (blendshapes: any) => heartController.applyExternalBlendshapes(blendshapes);
}


// Load the shape-keyed heart model and separate into top and bottom halves
function loadHeartModel(): void {
    const loadingElement = document.getElementById('loading');
    
    // Load FBX model
    fbxLoader.load(
        './assets/heart.fbx',
        function (object: THREE.Group) {
            // Successfully loaded the FBX model
            
            // Start with the original object as heart
            heart = object;
            
            // Initialize blendshapes functionality for this FBX model
            initFBXBlendshapes(object);
            
            // Get the original object dimensions before any modifications
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Scale to fit nicely in view
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;
            heart.scale.setScalar(scale);
            
            // Center the heart
            heart.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
            
            // Start heart controller animation
            heartController.start();
            
            // Enable shadows and apply materials for all meshes in the model
            object.traverse(function (child: THREE.Object3D) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Apply heart material with texture if available
                    child.material = createHeartMaterial();
                }
            });
            
            // Create a group for the heart first
            heartGroup = new THREE.Group();
            scene.add(heartGroup);
            
            // Add the heart directly to the scene
            heartGroup.add(object);
            
            // Heart successfully loaded and configured
            
            // Hide loading message
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
        },
        function (xhr: ProgressEvent<EventTarget>) {
            // Loading progress
            if (xhr.lengthComputable && loadingElement) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                loadingElement.innerHTML = `
                    <div class="loading-spinner"></div>
                    Loading... ${percent}%
                `;
            }
        }
    );
}

// Load the heart texture
function loadHeartTexture(): void {
    textureLoader.load(
        './assets/corazon_atropellado.jpg',
        function (texture: THREE.Texture) {
            // Successfully loaded texture
            heartTexture = texture;
            
            // Configure texture properties
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.flipY = true; // Flip Y axis for proper FBX texture alignment
        },
        function (_progress: ProgressEvent<EventTarget>) {
            // Loading progress - optional
        },
        function (error: unknown) {
            console.error('Error loading heart texture:', error);
            // Continue without texture - will use default material
        }
    );
}

// Create a heart material with texture if available
function createHeartMaterial(): THREE.MeshPhongMaterial {
    const materialConfig: any = {
        shininess: 80,
        transparent: false,
        side: THREE.DoubleSide, // Ensure both sides are visible
    };
    
    if (heartTexture) {
        // Use the loaded texture
        materialConfig.map = heartTexture;
        materialConfig.color = 0xffffff; // White to show texture colors properly
        materialConfig.emissive = 0x221111; // Subtle red glow
    } else {
        // Fallback to solid red color
        materialConfig.color = 0xff4466;
        materialConfig.emissive = 0x882222;
    }
    
    return new THREE.MeshPhongMaterial(materialConfig);
}

// Add lighting to the scene
function addLighting(): void {
    // Ambient light - much brighter for overall scene illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased from 0.6 to 0.8
    scene.add(ambientLight);
    
    // Directional light (main light source) - brighter and more intense
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // Increased from 1.2 to 2.0
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Additional directional light from opposite side - brighter
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5); // Increased from 0.8 to 1.5
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    // Additional directional light from above - new light source
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight3.position.set(0, 10, 0);
    scene.add(directionalLight3);
    
    // Additional directional light from below - new light source
    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight4.position.set(0, -10, 0);
    scene.add(directionalLight4);
    
    // Point light for dramatic effect - brighter and closer
    const pointLight = new THREE.PointLight(0xff0066, 1.0, 50); // Increased from 0.5 to 1.0, reduced range
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);
    
    // Additional warm point light for better heart visibility
    const warmLight = new THREE.PointLight(0xffaa44, 0.8, 30);
    warmLight.position.set(3, 0, 0);
    scene.add(warmLight);
    
    // Additional cool point light for balance
    const coolLight = new THREE.PointLight(0x4488ff, 0.6, 30);
    coolLight.position.set(-3, 0, 0);
    scene.add(coolLight);
}

// Animation loop
function animate(): void {
    animationId = requestAnimationFrame(animate);
    
    // Update heart controller
    heartController.update();
    
    // Update controls
    if (controls && controls.update) {
        controls.update();
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize(): void {
    const container = document.getElementById('container');
    if (container) {
        const containerRect = container.getBoundingClientRect();
        camera.aspect = containerRect.width / containerRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRect.width, containerRect.height);
    } else {
        // Fallback to window size
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Reset camera to default position
function resetCamera(): void {
    camera.position.set(0, 0, 4); // Match the initial zoom position
    if (controls && controls.reset) {
        controls.reset();
    }
}

// Toggle heart animation
function toggleAnimation(): void {
    isAnimating = !isAnimating;
    
    // Update both play buttons (expanded and collapsed versions)
    const btnExpanded = document.getElementById('playPauseBtn') as HTMLButtonElement;
    const btnCollapsed = document.getElementById('playPauseBtnCollapsed') as HTMLButtonElement;
    
    const newIcon = isAnimating ? '⏸' : '▶';
    const newTitle = isAnimating ? 'Pause' : 'Play';
    
    [btnExpanded, btnCollapsed].forEach(btn => {
        if (btn) {
            const icon = btn.querySelector('.icon');
            if (icon) {
                icon.textContent = newIcon;
            }
            btn.setAttribute('title', newTitle);
        }
    });
    
    // Control heart controller
    if (isAnimating) {
        heartController.start();
    } else {
        heartController.stop();
    }
    
    // Resume animation if it was paused
    if (isAnimating && !animationId) {
        animate();
    }
}

// Set heart cycle duration directly (in milliseconds)
function setHeartCycleDuration(duration: number): void {
    heartController.setCycleDuration(duration);
}

// Set heart rate in BPM
function setHeartBPM(bpm: number): void {
    heartController.setBPM(bpm);
}

// Auscultation point type
type AuscultationPoint = 'aortic' | 'pulmonic' | 'tricuspid' | 'mitral';

// Current selected auscultation point
let currentAuscultationPoint: AuscultationPoint | null = 'aortic';

// Callback function for auscultation point selection
let auscultationCallback: ((point: AuscultationPoint) => void) | null = null;

// Make functions globally accessible for HTML buttons
declare global {
    interface Window {
        resetCamera: () => void;
        toggleAnimation: () => void;
        setHeartCycleDuration: (duration: number) => void;
        setHeartBPM: (bpm: number) => void;
        updateBlendshapes: (blendshapes: any) => void;
        heartController: HeartController;
        morphTargetMeshes: THREE.Mesh[];
        heartMorphTargets: any;
        switchHeartRhythm: (rhythmName: string) => void;
        setHeartSoundVolume: (volume: number) => void;
        toggleHeartSoundVariations: () => void;
        getAvailableHeartRhythms: () => string[];
        toggleMode: () => void;
        toggleAuscultationPanel: () => void;
        selectAuscultationPoint: (point: string) => void;
        setAuscultationCallback: (callback: (point: AuscultationPoint) => void) => void;
        getCurrentAuscultationPoint: () => AuscultationPoint | null;
    }
}

// Heart rhythm control functions
function switchHeartRhythm(rhythmName: string): void {
    const success = heartController.switchToRhythmByName(rhythmName);
    if (success) {
        // console.log(`Switched to heart rhythm: ${rhythmName}`);
    }
}

function setHeartSoundVolume(volume: number): void {
    heartController.setSoundVolume(volume);
    // console.log(`Heart sound volume set to: ${(volume * 100).toFixed(0)}%`);
}

function getAvailableHeartRhythms(): string[] {
    return heartController.getAvailableRhythms().map(rhythm => rhythm.name);
}

function toggleMode(): void {
    const modeButton = document.getElementById("change-mode") as HTMLButtonElement;
    const iconSpan = modeButton.querySelector(".icon") as HTMLElement;

    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        scene.background = new THREE.Color(0x171717); // dark background
        document.body.classList.remove('light-mode');
        if (iconSpan) iconSpan.textContent = '🌙';      // moon icon for dark mode
    } else {
        scene.background = new THREE.Color(0xffffff); // light background
        document.body.classList.add('light-mode');
        if (iconSpan) iconSpan.textContent = '🌞';      // sun icon for light mode
    }
}

// Auscultation point management functions
function toggleAuscultationPanel(): void {
    const panel = document.getElementById('auscultationPanel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

function selectAuscultationPoint(point: string): void {
    updateRhythmOptions(point);
    const validPoints: AuscultationPoint[] = ['aortic', 'pulmonic', 'tricuspid', 'mitral'];
    
    if (!validPoints.includes(point as AuscultationPoint)) {
        console.error(`Invalid auscultation point: ${point}`);
        return;
    }
    
    const auscultationPoint = point as AuscultationPoint;
    currentAuscultationPoint = auscultationPoint;
    
    // Update UI to show selected point
    const currentPointElement = document.getElementById('currentPoint');
    if (currentPointElement) {
        currentPointElement.textContent = point.charAt(0).toUpperCase() + point.slice(1);
    }

    const auscultationButton = document.getElementById('auscultation-btn') as HTMLButtonElement;
    if (auscultationButton) {
        const iconSpan = auscultationButton.querySelector('.icon') as HTMLElement;
        if (iconSpan) {
            iconSpan.textContent = point.charAt(0).toUpperCase() + point.charAt(1);
        }
    }
    
    // Remove active class from all points
    const allPoints = document.querySelectorAll('.auscultation-point');
    allPoints.forEach(p => p.classList.remove('active'));
    
    // Add active class to selected point
    const selectedPoint = document.querySelector(`.auscultation-point.${point}`);
    if (selectedPoint) {
        selectedPoint.classList.add('active');
    }
    
    const normalRhythmValue = `${point.charAt(0).toUpperCase() + point.slice(1)} Normal S1 S2`;

    // Automatically switch to appropriate rhythm based on auscultation point
    switchRhythmForAuscultationPoint(auscultationPoint);
    heartController.switchToRhythmByName(normalRhythmValue);
    // Call the callback if one is registered
    if (auscultationCallback) {
        auscultationCallback(auscultationPoint);
    }
    
    // console.log(`Selected auscultation point: ${auscultationPoint}`);
}

function switchRhythmForAuscultationPoint(point: AuscultationPoint): void {
    // Map auscultation points to default rhythms
    const rhythmMap: Record<AuscultationPoint, string> = {
        'aortic': 'Aortic Normal S1 S2',
        'pulmonic': 'Pulmonic Normal S1 S2',
        'tricuspid': 'Tricuspid Normal S1 S2',
        'mitral': 'Apex Normal S1 S2'
    };
    
    const rhythmName = rhythmMap[point];
    
    // Update the rhythm select dropdown
    const rhythmSelect = document.getElementById('rhythmSelect') as HTMLSelectElement;
    if (rhythmSelect) {
        rhythmSelect.value = rhythmName;
    }
    
    // Switch to the rhythm
    heartController.switchToRhythmByName(rhythmName);
}

function setAuscultationCallback(callback: (point: AuscultationPoint) => void): void {
    auscultationCallback = callback;
}

function getCurrentAuscultationPoint(): AuscultationPoint | null {
    return currentAuscultationPoint;
}

function updateRhythmOptions(point: string): void {
    // Clear current options
    rhythmSelect.innerHTML = '';

    // Get rhythms for selected point
    const options = rhythmGroups[point] || [];

    // Add new options
    options.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.value;
        optionEl.textContent = opt.label;
        rhythmSelect.appendChild(optionEl);
    });
}


window.resetCamera = resetCamera;
window.toggleAnimation = toggleAnimation;
window.setHeartCycleDuration = setHeartCycleDuration;
window.setHeartBPM = setHeartBPM;
window.updateBlendshapes = (blendshapes: any) => heartController.applyExternalBlendshapes(blendshapes);
window.heartController = heartController;
window.switchHeartRhythm = switchHeartRhythm;
window.setHeartSoundVolume = setHeartSoundVolume;
window.getAvailableHeartRhythms = getAvailableHeartRhythms;
window.toggleMode = toggleMode;
window.toggleAuscultationPanel = toggleAuscultationPanel;
window.selectAuscultationPoint = selectAuscultationPoint;
window.setAuscultationCallback = setAuscultationCallback;
window.getCurrentAuscultationPoint = getCurrentAuscultationPoint;