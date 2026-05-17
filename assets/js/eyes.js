// State variables
let currentX = 0;
let targetX = 0;
let isIdle = false;
let idleTimer;
const eyes = document.querySelectorAll('#left-eye, #right-eye');

// Configuration
const movementRadius = 15;
const smoothingFactor = 0.05; // Lowered for more "weight" and stronger easing
const idleTimeoutDuration = 2500; // Time before idle starts

// Start the continuous animation loop
function startLoop() {
    function update() {
        // --- Idle Logic ---
        let blinkScale = 1;

        if (isIdle) {
            const now = Date.now();

            // Cycle segments (ms):
            // 0 -> 1500: Target Right (Hold ~0.5s)
            // 1500 -> 3000: Target Center (Hold ~0.5s)
            // 3000 -> 4500: Target Left (Hold ~0.5s)
            // 4500 -> 8500: Target Center (Move + Wait ~3s)
            // 8500 -> 8650: Blink Right Eye
            // 8650 -> 11500: Target Center (Wait ~3s)
            const cycleDuration = 11500;
            const cycleTime = now % cycleDuration;

            if (cycleTime < 1500) {
                targetX = movementRadius; // Right
            } else if (cycleTime < 3000) {
                targetX = 0; // Center
            } else if (cycleTime < 4500) {
                targetX = -movementRadius; // Left
            } else {
                targetX = 0; // Center (Long pause)

                // Blink Logic (Right Eye, ~8500ms mark)
                if (cycleTime > 8500 && cycleTime < 8650) {
                    blinkScale = 0.1; // Flag for blinking
                }
            }
        }

        // --- Smoothing (LERP) ---
        // Move currentX towards targetX
        const diff = targetX - currentX;
        if (Math.abs(diff) < 0.01) {
            currentX = targetX;
        } else {
            currentX += diff * smoothingFactor;
        }

        // --- Render ---
        const y = 0; // Horizontal only

        // Render Pupils
        if (eyes.length > 0) {
            eyes.forEach(eye => {
                eye.style.transformBox = 'fill-box';
                eye.style.transformOrigin = 'center';
                eye.style.transform = `translate(${currentX}px, ${y}px)`;
            });
        }

        // Render Blink (Stroke + Mask)
        const rightMask = document.getElementById('right-eyelid');
        const rightUpper = document.getElementById('right-lid-upper');
        const rightLower = document.getElementById('right-lid-lower');

        if (rightMask && rightUpper) {
            // Apply easing
            rightMask.style.transition = 'transform 0.1s';
            rightUpper.style.transition = 'transform 0.1s';

            // Set origins
            rightMask.style.transformBox = 'fill-box';
            rightMask.style.transformOrigin = 'bottom'; // Anchor at bottom so it shrinks from top down

            rightUpper.style.transformBox = 'fill-box';
            rightUpper.style.transformOrigin = 'center';

            if (blinkScale === 0.1) {
                // BLINKING (Closed)
                // 1. Squash the mask to hide the pupil (from top down)
                rightMask.style.transform = `scaleY(0.15)`;

                // 2. Move the upper lid down to meet the lower lid
                // The gap is roughly 357 (bottom) - 333 (top) = 24px.
                // Moving down ~12px should close it if bottom moves up, or ~20px if bottom stays.
                // Let's try moving upper lid down significantly.
                rightUpper.style.transform = `translateY(12px)`;
            } else {
                // OPEN
                rightMask.style.transform = `scaleY(1)`;
                rightUpper.style.transform = `translateY(0)`;
            }
        }

        requestAnimationFrame(update);
    }
    update();
}

// Handle Mouse Movement
function handleMouseMove(e) {
    if (eyes.length === 0) return;

    // Reset idle state
    isIdle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        isIdle = true;
    }, idleTimeoutDuration);

    // --- Calculate Target X ---
    // Calculate face center (approximate)
    // We can cache this, but calculating on move handles resizing roughly ideally
    let totalX = 0;
    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        totalX += rect.left + rect.width / 2;
    });
    const centerX = totalX / eyes.length;

    const dx = e.clientX - centerX;
    const maxDist = window.innerWidth / 2;

    // Calculate raw target based on mouse position
    let rawTarget = (dx / maxDist) * movementRadius * 3;

    // Clamp
    targetX = Math.max(-movementRadius, Math.min(movementRadius, rawTarget));
}

// Initialize
if (eyes.length > 0) {
    document.addEventListener('mousemove', handleMouseMove);

    // Start idle initally
    idleTimer = setTimeout(() => {
        isIdle = true;
    }, idleTimeoutDuration);

    startLoop();
}
