// Initially created with Cursor using claude-4-sonnet
import * as THREE from "three";
import { HeartController } from "./HeartController.js";
import {
  AuscultationLocation,
  availableRhythms,
  Rhythm,
  SelectableRhythm,
  SelectableRhythmName,
} from "./heartRhythms/Rhythm.js";
import { getNewRhythmNames } from "./heartRhythms/config/rhythm-templates.js";
import { FBXLoader, OrbitControls } from "three/examples/jsm/Addons.js";

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
const rhythmSelect = document.getElementById("rhythmSelect") as HTMLSelectElement;

// Blendshapes/Morph targets variables for FBX
let morphTargetMeshes: THREE.Mesh[] = [];
let root: THREE.Bone | null = null;

// Heart controller singleton
let heartController: HeartController = HeartController.getInstance();

type ViewMode = "mannequin" | "heart";

// View state (default mannequin)
let currentView: ViewMode = "mannequin";

// Group for mannequin (will be loaded)
let mannequinGroup: THREE.Group;

// Optional camera presets (tweak numbers after you see it)
const heartCameraPos = new THREE.Vector3(0, 0, 6);
const mannequinCameraPos = new THREE.Vector3(0, 0, 8);
const buttons = [
  { element: document.getElementById("aortic-but"), position: new THREE.Vector3(-0.4, 1.5, 1.25) },
  { element: document.getElementById("pulmonic-but"), position: new THREE.Vector3(0.25, 1.5, 1.25) },
  { element: document.getElementById("tricuspid-but"), position: new THREE.Vector3(0.25, 0.75, 1.5) },
  { element: document.getElementById("mitral-but"), position: new THREE.Vector3(0.75, 0, 1.25) },
];

// Initialize the 3D scene
export async function init(): Promise<void> {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x171717);

  // Create camera - get container size for proper aspect ratio
  const container = document.getElementById("container");
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
    
    // Allow slight horizontal and very slight vertical rotation
    controls.enableRotate = true;
    // VERTICAL
    controls.minPolarAngle = Math.PI * 0.35; // Allow slight up tilt
    controls.maxPolarAngle = Math.PI * 0.60; // Allow slight down tilt
    // HORIZONTAL
    controls.minAzimuthAngle = -Math.PI * 0.3; // Allow ~54 degrees left/right
    controls.maxAzimuthAngle = Math.PI * 0.3;
  } catch (error) {
    console.error("Error creating OrbitControls:", error);
  }

  // Initialize FBX loader and texture loader
  try {
    await loadHeartTexture(); // wait till its done
    fbxLoader = new FBXLoader();
    textureLoader = new THREE.TextureLoader();
  } catch (error) {
    console.error("Error initializing loaders:", error);
    return;
  }

  // Add lighting
  addLighting();

  // Create groups
  heartGroup = new THREE.Group();
  scene.add(heartGroup);

  mannequinGroup = new THREE.Group();
  scene.add(mannequinGroup);

  // Default view on load
  applyViewState(false);

  // Load models
  loadMannequinModel(); // mannequin should be default visible
  loadHeartModel(); // heart starts hidden by default

  // Start animation loop
  animate();

  if (rhythmSelect) {
    rhythmSelect.innerHTML = "";
    const newRhythms = getNewRhythmNames();
    Object.entries(SelectableRhythmName).forEach(([key, name]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = name as string;
      if (newRhythms.has(key as any)) {
        option.dataset.isNew = "true";
      }
      rhythmSelect.appendChild(option);
    });
  }

  selectAuscultationPoint("Aortic");

  // Handle window resize
  window.addEventListener("resize", onWindowResize);
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
  const loadingElement = document.getElementById("loading");

  // Load FBX model
  fbxLoader.load(
    "./assets/heart.fbx",
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
      heart.position.set(-center.x * scale, -center.y * scale + 0.2, -center.z * scale);

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

      // Add the heart directly to the scene
      heartGroup.add(object);

      // Heart successfully loaded and configured

      // Hide loading message
      if (loadingElement) {
        loadingElement.style.display = "none";
      }
    },
    function (xhr: ProgressEvent<EventTarget>) {
      // Loading progress
      if (xhr.lengthComputable && loadingElement) {
        const percent = ((xhr.loaded / xhr.total) * 100).toFixed(0);
        loadingElement.innerHTML = `
                    <div class="loading-spinner"></div>
                    Loading... ${percent}%
                `;
      }
    },
  );
}

function loadMannequinModel(): void {
  updateButtonPositions();
  fbxLoader.load(
    "./assets/chest.fbx",
    function (object: THREE.Group) {
      // Apply matte material to reduce shininess
      object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          // child.castShadow = true;
          // child.receiveShadow = true;
          child.material = new THREE.MeshPhongMaterial({
            // ignoring the other material
            // color: (child.material as THREE.MeshPhongMaterial).color,
            color: new THREE.Color().setHex(0xb88e79),
            shininess: 10, // Low shininess for matte appearance
            side: THREE.DoubleSide,
          });
        }
      });

      // Scale/center similar to heart
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 6 / maxDim; // tweak if needed
      object.scale.setScalar(scale);

      object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      mannequinGroup.add(object);

      // Make sure visibility matches currentView (in case load finishes later)
      applyViewState(false);
    },
    undefined,
    (error) => console.error("Error loading mannequin model:", error),
  );
}

function updateButtonPositions() {
  buttons.forEach((btn) => {
    if (!mannequinGroup) return;

    // Project the buttons 3d location to the 2d screen
    const pos = btn.position.clone();
    mannequinGroup.localToWorld(pos);
    pos.project(camera);

    // Position the buttons on the screen
    const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;

    btn.element.style.left = x + "px";
    btn.element.style.top = y + "px";
  });
}

function applyViewState(updateCamera: boolean = true): void {
  const showMannequin = currentView === "mannequin";
  const showHeart = currentView === "heart";
  const auscultationBtns = document.getElementsByClassName("auscultation-point");

  if (mannequinGroup) mannequinGroup.visible = showMannequin;
  if (heartGroup) heartGroup.visible = showHeart;

  // Pause/resume heart animation appropriately
  if (!showHeart) {

    for (let i = 0; i < auscultationBtns.length; i++) {
      const btn = auscultationBtns[i] as HTMLButtonElement;
      btn.disabled = false;
    }
  } else {

    for (let i = 0; i < auscultationBtns.length; i++) {
      const btn = auscultationBtns[i] as HTMLButtonElement;
      btn.disabled = true;
    }
  }

  if (updateCamera) {
    camera.position.copy(showHeart ? heartCameraPos : mannequinCameraPos);
    if (controls) controls.update();
  }
}

function toggleView(): void {
  const toggleButton = document.getElementById("toggle-view") as HTMLButtonElement;

  const iconSpan = toggleButton?.querySelector(".icon") as HTMLElement;

  // Flip state
  currentView = currentView === "mannequin" ? "heart" : "mannequin";

  // Apply scene visibility + camera logic
  applyViewState(true);

  // Update icon
  if (iconSpan) {
    if (currentView === "mannequin") {
      iconSpan.textContent = "❤️"; // mannequin/chest icon
    } else {
      iconSpan.textContent = "👤"; // heart icon
    }
  }
}

// Load the heart texture
async function loadHeartTexture(): Promise<void> {
  // to simulate delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const loader = new THREE.TextureLoader();
  heartTexture = await loader.loadAsync("./assets/corazon_atropellado.jpg");
}

// Create a heart material with texture if available
function createHeartMaterial(): THREE.MeshPhongMaterial {
  const materialConfig: any = {
    shininess: 80,
    transparent: false,
    side: THREE.DoubleSide, // Ensure both sides are visible
  };

  // Use the loaded texture
  materialConfig.map = heartTexture;
  materialConfig.color = 0xffffff; // white to show texture colors properly
  materialConfig.emissive = 0x221111; // subtle red glow
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

  if (mannequinGroup.visible) {
    updateButtonPositions();
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize(): void {
  const container = document.getElementById("container");
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
  const btnExpanded = document.getElementById("playPauseBtn") as HTMLButtonElement;
  const btnCollapsed = document.getElementById("playPauseBtnCollapsed") as HTMLButtonElement;

  const newIcon = isAnimating ? "⏸" : "▶";
  const newTitle = isAnimating ? "Pause" : "Play";

  [btnExpanded, btnCollapsed].forEach((btn) => {
    if (btn) {
      const icon = btn.querySelector(".icon");
      if (icon) {
        icon.textContent = newIcon;
      }
      btn.setAttribute("title", newTitle);
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

// Current selected auscultation point
let currentAuscultationPoint: AuscultationLocation | null = "Aortic";

// Callback function for auscultation point selection
let auscultationCallback: ((point: AuscultationLocation) => void) | null = null;

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
    switchHeartRhythm: (rhythm: SelectableRhythm) => void;
    setHeartSoundVolume: (volume: number) => void;
    toggleHeartSoundVariations: () => void;
    getAvailableHeartRhythms: () => string[];
    toggleMode: () => void;
    toggleView: () => void;
    selectAuscultationPoint: (point: AuscultationLocation) => void;
    setAuscultationCallback: (callback: (point: AuscultationLocation) => void) => void;
    getCurrentAuscultationPoint: () => AuscultationLocation | null;
  }
}

// Heart rhythm control functions
function switchHeartRhythm(rhythm: SelectableRhythm): void {
  heartController.switchToRhythm(rhythm);
}

function setHeartSoundVolume(volume: number): void {
  heartController.setSoundVolume(volume);
  // console.log(`Heart sound volume set to: ${(volume * 100).toFixed(0)}%`);
}

function toggleMode(): void {
  const modeButton = document.getElementById("change-mode") as HTMLButtonElement;
  const iconSpan = modeButton.querySelector(".icon") as HTMLElement;

  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    scene.background = new THREE.Color(0x171717); // dark background
    document.body.classList.remove("light-mode");
    if (iconSpan) iconSpan.textContent = "🌙"; // moon icon for dark mode
  } else {
    scene.background = new THREE.Color(0xffffff); // light background
    document.body.classList.add("light-mode");
    if (iconSpan) iconSpan.textContent = "🔆"; // sun icon for light mode
  }
}

// Auscultation point management functions

function selectAuscultationPoint(point: AuscultationLocation): void {
  const validPoints: AuscultationLocation[] = ["Aortic", "Pulmonic", "Tricuspid", "Mitral"];

  if (!validPoints.includes(point as AuscultationLocation)) {
    console.error(`Invalid auscultation point: ${point}`);
    return;
  }

  currentAuscultationPoint = point;
  // Update UI to show selected point
  const currentPointElement = document.getElementById("currentPoint");
  if (currentPointElement) {
    currentPointElement.textContent = point.charAt(0).toUpperCase() + point.slice(1);
  }

  // Remove active class from all points
  const allPoints = document.querySelectorAll(".auscultation-point");
  allPoints.forEach((p) => p.classList.remove("active"));

  // Add active class to selected point
  const selectedPoint = document.querySelector(`.auscultation-point.${point.toLowerCase()}`);
  if (selectedPoint) {
    selectedPoint.classList.add("active");
  }

  // Automatically switch to appropriate rhythm based on auscultation point
  heartController.setAuscultationLocation(point);
  // Call the callback if one is registered
  if (auscultationCallback) {
    auscultationCallback(point);
  }

  // console.log(`Selected auscultation point: ${auscultationPoint}`);
}

function setAuscultationCallback(callback: (point: AuscultationLocation) => void): void {
  auscultationCallback = callback;
}

function getCurrentAuscultationPoint(): AuscultationLocation | null {
  return currentAuscultationPoint;
}

window.resetCamera = resetCamera;
window.toggleAnimation = toggleAnimation;
window.setHeartCycleDuration = setHeartCycleDuration;
window.setHeartBPM = setHeartBPM;
window.updateBlendshapes = (blendshapes: any) => heartController.applyExternalBlendshapes(blendshapes);
window.heartController = heartController;
window.selectAuscultationPoint = selectAuscultationPoint;
window.setHeartSoundVolume = setHeartSoundVolume;
window.toggleMode = toggleMode;
window.setAuscultationCallback = setAuscultationCallback;
window.getCurrentAuscultationPoint = getCurrentAuscultationPoint;
window.switchHeartRhythm = switchHeartRhythm;
window.toggleView = toggleView;
