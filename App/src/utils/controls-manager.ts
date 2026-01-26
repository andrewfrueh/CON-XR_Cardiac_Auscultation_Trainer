/**
 * Controls Manager - Handles collapsible control panel
 * Toggles controls and triggers window resize for Three.js canvas
 */

export function initializeControls(): void {
    // Make toggle function available globally
    (window as any).toggleControls = toggleControls;
    
    console.log('✅ Controls manager initialized');
}

function toggleControls(): void {
    const controls = document.getElementById('heartControls');
    if (controls) {
        controls.classList.toggle('expanded');
        
        // Trigger window resize after animation completes
        // This allows the Three.js renderer to adjust to new container size
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 350); // Match CSS transition time (0.3s + buffer)
    }
}

// Initialize when module is loaded
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeControls);
    } else {
        initializeControls();
    }
}

