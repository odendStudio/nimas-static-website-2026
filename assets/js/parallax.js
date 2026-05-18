document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis for Smooth Scroll
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            autoLenis: true,
            smoothWheel: true,
            lerp: 0.12, // Tighter smoothness
            wheelMultiplier: 0.85, // 15% smaller scroll steps
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true }); // Force GPU acceleration where possible

    // 2. Hero Section Parallax
    const heroSection = document.getElementById("hero-section");
    const blobs = document.querySelectorAll(".nz-parallax-blob");

    if (heroSection) {

        // 2.1 Mesh Blobs Subtle Scale/Shift
        blobs.forEach((blob, i) => {
            gsap.to(blob, {
                scale: 1.2,
                y: i % 2 === 0 ? 50 : -50,
                ease: "none",
                scrollTrigger: {
                    trigger: heroSection,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // 2.2 Scroll Parallax for Hero Text
        const heroText = heroSection.querySelector("#hero-text-side");
        if (heroText) {
            gsap.set(heroText, { willChange: "transform, opacity" });
            gsap.to(heroText, {
                y: -180,
                opacity: 0,
                scale: 0.95,
                ease: "none",
                scrollTrigger: {
                    trigger: heroSection,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // 2.3 Scroll Parallax for Hero Illustration
        const heroImg = heroSection.querySelector("#hero-illustration-side");
        if (heroImg) {
            gsap.set(heroImg, { willChange: "transform" });
            gsap.to(heroImg, {
                y: -100,
                scale: 1.05,
                ease: "none",
                scrollTrigger: {
                    trigger: heroSection,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // 2.4 Scroll Indicator Fade Out & Smooth Scroll Click
        const scrollIndicator = document.getElementById("nz-scroll-indicator");
        if (scrollIndicator) {
            // Click handler for smooth scrolling using Lenis if available
            scrollIndicator.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = scrollIndicator.getAttribute("href");
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    if (lenis) {
                        lenis.scrollTo(targetElement, {
                            duration: 1.8,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium easeOutExpo
                            offset: 0
                        });
                    } else {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });

            gsap.to(scrollIndicator, {
                opacity: 0,
                y: 20,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: heroSection,
                    start: "top top",
                    end: "10% top",
                    scrub: true
                }
            });
        }
    }

    // 3. About Section (Dark Section)
    const aboutSection = document.getElementById("uiux");
    if (aboutSection) {
        // Redesigned: Gentle scale-down of the whole section while scrolling through it
        gsap.fromTo(aboutSection,
            { scale: 1.05 },
            {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );

        const line1 = aboutSection.querySelector(".nz-parallax-line-1");
        const line2 = aboutSection.querySelector(".nz-parallax-line-2");
        const line3 = aboutSection.querySelector(".nz-parallax-line-3");

        if (line1 && line2 && line3) {
            gsap.set([line1, line2, line3], { willChange: "transform, opacity" });

            // Line 1: Premium Apple-style kinetic reveal. Enters from bottom-left, scales and slides into place.
            gsap.fromTo(line1,
                { y: 50, x: -30, scale: 0.95, opacity: 0 },
                {
                    y: 0,
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    force3D: true,
                    willChange: "transform, opacity",
                    ease: "power2.out", // Cushioned ease-out decelerates beautifully into the center
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 95%",
                        end: "center center", // Completes 100% exactly in the middle of the screen
                        scrub: true
                    }
                }
            );

            // Line 2: Premium Apple-style kinetic reveal. Enters straight from bottom, scales and slides into place.
            gsap.fromTo(line2,
                { y: 50, scale: 0.95, opacity: 0 },
                {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    force3D: true,
                    willChange: "transform, opacity",
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 95%",
                        end: "center center", // Completes 100% exactly in the middle of the screen
                        scrub: true
                    }
                }
            );

            // Line 3: Premium Apple-style kinetic reveal. Enters from bottom-right, scales and slides into place.
            gsap.fromTo(line3,
                { y: 50, x: 30, scale: 0.95, opacity: 0 },
                {
                    y: 0,
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    force3D: true,
                    willChange: "transform, opacity",
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 95%",
                        end: "center center", // Completes 100% exactly in the middle of the screen
                        scrub: true
                    }
                }
            );
        }

        // 3D Architectural Modern Office Blueprint Wireframe Engine (Line Drawing Concept)
        const canvas = document.getElementById("nz-3d-canvas");
        if (canvas) {
            const ctx = canvas.getContext("2d");
            let width = canvas.clientWidth;
            let height = canvas.clientHeight;

            // 3D Kinetic Wave Fabric requires no static precompiled geometry
            
            // Interactive mouse input tracking
            const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, active: false };
            let currentTiltX = 0;
            let currentTiltY = 0;

            // Canvas resize with retina scaling
            const resizeCanvas = () => {
                width = canvas.clientWidth || 500;
                height = canvas.clientHeight || 500;
                canvas.width = width * window.devicePixelRatio;
                canvas.height = height * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            };
            resizeCanvas();

            // Coordinate listeners on parent section for unblocked user experience
            aboutSection.addEventListener("mousemove", (e) => {
                const rect = aboutSection.getBoundingClientRect();
                mouse.targetX = e.clientX - rect.left;
                mouse.targetY = e.clientY - rect.top;
                mouse.active = true;
            });

            aboutSection.addEventListener("mouseleave", () => {
                mouse.active = false;
                mouse.targetX = width / 2;
                mouse.targetY = height / 2;
            });

            // Touch support for iPad / mobile response
            aboutSection.addEventListener("touchmove", (e) => {
                if (e.touches.length > 0) {
                    const rect = aboutSection.getBoundingClientRect();
                    mouse.targetX = e.touches[0].clientX - rect.left;
                    mouse.targetY = e.touches[0].clientY - rect.top;
                    mouse.active = true;
                }
            }, { passive: true });

            aboutSection.addEventListener("touchend", () => {
                mouse.active = false;
                mouse.targetX = width / 2;
                mouse.targetY = height / 2;
            });

            // Scroll mapping controlled via GSAP ScrollTrigger
            const scrollProgress = { value: 0 };
            gsap.to(scrollProgress, {
                value: 1.0,
                ease: "none",
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Viewport Optimizer: Canvas updates freeze completely when offscreen
            let isInViewport = false;
            ScrollTrigger.create({
                trigger: aboutSection,
                start: "top bottom",
                end: "bottom top",
                onToggle: self => {
                    isInViewport = self.isActive;
                }
            });

            window.addEventListener("resize", resizeCanvas);

            // 3D Matrix Rotation Helper
            const rotatePoint = (pt, rx, ry, rz) => {
                const cosX = Math.cos(rx), sinX = Math.sin(rx);
                const cosY = Math.cos(ry), sinY = Math.sin(ry);
                const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

                // X-axis (pitch)
                let y1 = pt[1] * cosX - pt[2] * sinX;
                let z1 = pt[1] * sinX + pt[2] * cosX;

                // Y-axis (yaw)
                let x2 = pt[0] * cosY + z1 * sinY;
                let z2 = -pt[0] * sinY + z1 * cosY;

                // Z-axis (roll)
                let x3 = x2 * cosZ - y1 * sinZ;
                let y3 = x2 * sinZ + y1 * cosZ;

                return [x3, y3, z2];
            };

            // Master render function for the 3D Wireframe scene
            function drawScene(time) {
                ctx.clearRect(0, 0, width, height);

                const fov = Math.max(width, height) * 1.5;

                // 3D Perspective Projection relative to screen center
                const project = (pos) => {
                    const dz = pos[2];
                    const scaleFactor = fov / Math.max(10, fov + dz);
                    return {
                        x: pos[0] * scaleFactor + width / 2,
                        y: pos[1] * scaleFactor + height / 2
                    };
                };

                const p = scrollProgress.value;

                // Quadratic ease-in-out interpolation for organic scroll zooming & snapping
                const interpolate = (progress, val0, val1, val2) => {
                    if (progress < 0.5) {
                        const t = progress / 0.5;
                        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                        return val0 + (val1 - val0) * ease;
                    } else {
                        const t = (progress - 0.5) / 0.5;
                        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                        return val1 + (val2 - val1) * ease;
                    }
                };

                // Dynamic scroll-driven zoom factor: increased by exactly 5% to make the ribbon slightly larger and bolder
                const zoom = interpolate(p, 8.925, 7.875, 5.04);

                // 1. Central Position Offsets when focused in the middle (p = 0.5)
                // Adjust these to shift the ribbon's position behind the text:
                // - centerXOffset: positive to shift right, negative to shift left
                // - centerYOffset: positive to shift down, negative to shift up
                const centerXOffset = 0; // Perfectly centered horizontally
                const centerYOffset = height * 0.10; // Shifted 10% of screen height down to frame the tagline beautifully

                // 2. Central Rotation Angles when focused in the middle (p = 0.5)
                // Adjust these to rotate the ribbon's angle behind the text:
                // - centerRx: pitch / vertical tilt (tilt forward/backward)
                // - centerRy: yaw / horizontal spin (spin left/right)
                // - centerRz: roll / sideways tilt (tilt clockwise/counter-clockwise)
                const centerRx = 0.52; // Vertical incline
                const centerRy = -0.65; // Horizontal spin yaw angle
                const centerRz = 0.0; // Upright roll angle

                // Dynamic scroll-driven camera rotation angles (orbit flight path)
                // Interpolating to your custom middle rotation angles at p = 0.5
                const rx = interpolate(p, 0.35, centerRx, 0.70);
                const ry = interpolate(p, 1.20, centerRy, -2.50);
                const rz = interpolate(p, -0.15, centerRz, 0.15);

                // Dynamic scroll-driven lateral shifting (focused at center offsets at p = 0.5)
                const tx = interpolate(p, width * 0.10, centerXOffset, -width * 0.15);
                const ty = interpolate(p, height * 0.05, centerYOffset, -height * 0.10);

                // Interpolated mouse hover camera tilt for holographic parallax (increased sensitivity to 0.45)
                const targetTiltX = mouse.active ? ((mouse.y / height) - 0.5) * 0.45 : 0;
                const targetTiltY = mouse.active ? ((mouse.x / width) - 0.5) * -0.45 : 0;
                currentTiltX += (targetTiltX - currentTiltX) * 0.08;
                currentTiltY += (targetTiltY - currentTiltY) * 0.08;

                // Total compound rotation angles (purely scroll-driven and mouse-hover responsive, zero auto-rotation)
                const finalRx = rx + currentTiltX;
                const finalRy = ry + currentTiltY;

                // Abstract 3D Minimalist Closed Mobius Loop (Single Gold/Pink/Cyan, static geometry, connected endpoints forming a seamless loop, Variant F - Elegant 3D Ribbon Knot)
                const steps = 800; // Ultra-high resolution to completely eliminate stepped gradient transitions (pele-pele)
                const turns = 2.0; // Exactly 2 complete turns to close the loop with mathematical perfection
                const maxPhi = turns * Math.PI * 2;

                const points = [];
                const rotated = [];
                const projected = [];

                for (let i = 0; i <= steps; i++) {
                    const phi = (i / steps) * maxPhi;
                    
                    // Super elongated panoramic horizontal scale to make the ribbon shape longer
                    const rX = 220;
                    const rY = 75;
                    
                    // Slender figure-eight crossing loop stretched horizontally even further (panoramic)
                    const x = rX * Math.cos(phi);
                    const y = rY * Math.sin(phi * 2.0) * 0.55;
                    
                    // Waving height offset so the ribbon loops pass gracefully above and below each other in 3D space
                    const zVal = Math.sin(phi * 1.0) * 35 + Math.cos(phi * 2.0) * 12;

                    // Rotate point in 3D
                    const rPt = rotatePoint([x, y, zVal], finalRx, finalRy, rz);
                    // Scale by zoom
                    const sPt = [rPt[0] * zoom, rPt[1] * zoom, rPt[2] * zoom];
                    // Project to 2D screen space
                    const pPt = project(sPt);

                    points.push([x, y, zVal]);
                    rotated.push(sPt);
                    projected.push(pPt);
                }

                // 3. Find the screen-space bounding box of the projected shape to map our seamless gradient
                let minX = Infinity, maxX = -Infinity;
                for (let i = 0; i <= steps; i++) {
                    const pt = projected[i];
                    const screenX = pt.x + tx;
                    if (screenX < minX) minX = screenX;
                    if (screenX > maxX) maxX = screenX;
                }

                // Ensure we have a valid bounding box before drawing
                if (minX !== Infinity && maxX !== -Infinity && maxX > minX) {
                    // Create a single seamless widescreen gradient that spans the entire width of the ribbon using Nima's authentic Hero Section mesh colors:
                    // Lighter Cyan (#67E8F9), Soft Pink (#F9A8D4), Lighter Purple (#A855F7), and Soft Blue (#60A5FA)
                    const grad = ctx.createLinearGradient(minX, 0, maxX, 0);
                    grad.addColorStop(0.0, '#67E8F9');  // Lighter Cyan (Hero Blob 1)
                    grad.addColorStop(0.25, '#F9A8D4'); // Soft Pink (Hero Blob 2)
                    grad.addColorStop(0.50, '#A855F7'); // Lighter Purple (Hero Blob 5)
                    grad.addColorStop(0.75, '#60A5FA'); // Soft Blue (Hero Blob 3)
                    grad.addColorStop(1.0, '#67E8F9');  // Seamlessly back to Lighter Cyan

                    // 1. Draw the soft volumetric glow aura underneath as a single continuous piece (zero dotted overlaps!)
                    ctx.beginPath();
                    ctx.moveTo(projected[0].x + tx, projected[0].y + ty);
                    for (let i = 1; i <= steps; i++) {
                        ctx.lineTo(projected[i].x + tx, projected[i].y + ty);
                    }
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 14.0; // Wide glow radius
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.globalAlpha = 0.18; // Soft uniform glowing opacity
                    ctx.stroke();

                    // 2. Draw the sharp, bold core neon line on top as a single continuous piece (zero dotted overlaps!)
                    ctx.beginPath();
                    ctx.moveTo(projected[0].x + tx, projected[0].y + ty);
                    for (let i = 1; i <= steps; i++) {
                        ctx.lineTo(projected[i].x + tx, projected[i].y + ty);
                    }
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 3.5; // Bold core stroke
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.globalAlpha = 0.95; // Crisp core opacity
                    ctx.stroke();

                    // Reset global alpha back to full opacity for other canvas elements
                    ctx.globalAlpha = 1.0;
                }
            }

            // Real-time animation loops
            let lastTime = 0;
            const animate = (timestamp) => {
                if (isInViewport) {
                    if (!lastTime) lastTime = timestamp;
                    
                    // Lerp cursor target values smoothly
                    mouse.x += (mouse.targetX - mouse.x) * 0.08;
                    mouse.y += (mouse.targetY - mouse.y) * 0.08;
                    
                    drawScene(timestamp * 0.001);
                } else {
                    lastTime = 0;
                }
                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        }
    }

    // 4. Process Section (Yellow Section)
    const processSection = document.getElementById("process-section");
    if (processSection) {
        const processImg = processSection.querySelector("div.lg\\:w-1\\/2:first-child");
        const processText = processSection.querySelector("div.lg\\:w-1\\/2:last-child");

        if (processImg && processText && window.innerWidth > 1024) {
            gsap.fromTo(processImg,
                { y: 150 },
                {
                    y: -150,
                    ease: "none",
                    scrollTrigger: {
                        trigger: processSection,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );

            gsap.fromTo(processText,
                { y: 30 },
                {
                    y: -30,
                    ease: "none",
                    scrollTrigger: {
                        trigger: processSection,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );
        }
    }

    // 5. Portfolio Section
    const portfolioSection = document.getElementById("portfolio-section");
    if (portfolioSection) {
        // 5.1 Media Parallax (inside videos)
        const videos = portfolioSection.querySelectorAll("video");
        videos.forEach(video => {
            // Using a scale of 1.2 provides a 10% buffer at the top and bottom.
            // Animating yPercent from -10% to 10% ensures that the video always
            // covers the container perfectly, never exposing the background color.
            gsap.set(video, { scale: 1.2, transformOrigin: "center center", willChange: "transform" });
            gsap.fromTo(video,
                { yPercent: -10 },
                {
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: video.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        });

        // 5.2 Scrub Reveal for portfolio items
        const gridItems = portfolioSection.querySelectorAll(".grid > div");
        if (gridItems.length > 0) {
            gridItems.forEach(item => {
                gsap.set(item, { willChange: "transform, opacity" });
                gsap.fromTo(item,
                    { opacity: 0, y: 80 },
                    {
                        opacity: 1,
                        y: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 95%",
                            end: "top 65%",
                            scrub: true
                        }
                    }
                );
            });
        }
    }

    // 6. Let's Talk CTA Section Uncover Effect
    const ctaSection = document.getElementById("cta-section");
    if (ctaSection) {
        // Uncover effect
        gsap.fromTo(ctaSection,
            { yPercent: -40 },
            {
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: portfolioSection,
                    start: "bottom bottom",
                    endTrigger: "footer",
                    end: "bottom bottom",
                    scrub: true
                }
            }
        );

        // Stagger inner elements
        const ctaTexts = ctaSection.querySelectorAll("p, h2, .group");
        gsap.fromTo(ctaTexts,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ctaSection,
                    start: "top 75%",
                }
            }
        );

        // Trigger the ambient wave animation with a 2-second delay after entering viewport (using seamless transitions)
        const waveContainer = ctaSection.querySelector(".nz-cta-wave-container");
        if (waveContainer) {
            let ctaTimeout = null;
            let ctaInterval = null;

            const startAmbientCycle = () => {
                stopAmbientCycle(); // Reset any existing active timers
                // First pop up after a 2-second delay
                ctaTimeout = setTimeout(() => {
                    waveContainer.classList.add("nz-ambient-pop");
                    ctaTimeout = setTimeout(() => {
                        waveContainer.classList.remove("nz-ambient-pop");
                    }, 2500);

                    // Then infinitely loop every 12 seconds
                    ctaInterval = setInterval(() => {
                        waveContainer.classList.add("nz-ambient-pop");
                        ctaTimeout = setTimeout(() => {
                            waveContainer.classList.remove("nz-ambient-pop");
                        }, 2500);
                    }, 12000);
                }, 2000);
            };

            const stopAmbientCycle = () => {
                if (ctaTimeout) clearTimeout(ctaTimeout);
                if (ctaInterval) clearInterval(ctaInterval);
                waveContainer.classList.remove("nz-ambient-pop");
            };

            ScrollTrigger.create({
                trigger: ctaSection,
                start: "top 75%",
                onEnter: startAmbientCycle,
                onLeave: stopAmbientCycle,
                onEnterBack: startAmbientCycle,
                onLeaveBack: stopAmbientCycle
            });
        }
    }

    // 7. Say Hi Top Navigation Waving Emoji Trigger (2s delay after visible, periodic)
    const sayHiEmoji = document.querySelector(".nz-wave-emoji");
    if (sayHiEmoji) {
        const sayHiButton = sayHiEmoji.closest("a");
        let sayHiTimeout = null;
        let sayHiInterval = null;
        let isHovered = false;

        const startSayHiAmbient = () => {
            stopSayHiAmbient();
            if (isHovered) return; // Do not start if currently hovered

            // Initial pop up after 2 seconds
            sayHiTimeout = setTimeout(() => {
                if (isHovered) return;
                sayHiEmoji.classList.add("nz-animate");
                sayHiTimeout = setTimeout(() => {
                    sayHiEmoji.classList.remove("nz-animate");
                }, 2500);

                // Periodic pop up every 15 seconds
                sayHiInterval = setInterval(() => {
                    if (isHovered) return;
                    sayHiEmoji.classList.add("nz-animate");
                    sayHiTimeout = setTimeout(() => {
                        sayHiEmoji.classList.remove("nz-animate");
                    }, 2500);
                }, 15000);
            }, 2000);
        };

        const stopSayHiAmbient = () => {
            if (sayHiTimeout) clearTimeout(sayHiTimeout);
            if (sayHiInterval) clearInterval(sayHiInterval);
            sayHiEmoji.classList.remove("nz-animate");
        };

        // Add mouseenter/mouseleave listeners to handle instant override when hovered
        if (sayHiButton) {
            sayHiButton.addEventListener("mouseenter", () => {
                isHovered = true;
                stopSayHiAmbient();
            });

            sayHiButton.addEventListener("mouseleave", () => {
                isHovered = false;
                startSayHiAmbient();
            });
        }

        ScrollTrigger.create({
            trigger: sayHiEmoji,
            start: "top bottom",
            onEnter: startSayHiAmbient,
            onLeave: stopSayHiAmbient,
            onEnterBack: startSayHiAmbient,
            onLeaveBack: stopSayHiAmbient
        });
    }
});
