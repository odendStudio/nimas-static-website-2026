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

            // Line 1: Enters from bottom-left, shifts upwards with balanced speed
            gsap.fromTo(line1,
                { y: "80%", x: -35, opacity: 0 },
                {
                    y: "0%",
                    x: 0,
                    opacity: 1,
                    force3D: true,
                    willChange: "transform, opacity",
                    ease: "none",
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 90%",
                        end: "top 55%",
                        scrub: true
                    }
                }
            );

            // Line 2: Enters straight from bottom, shifts upwards with balanced speed
            gsap.fromTo(line2,
                { y: "80%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    force3D: true,
                    willChange: "transform, opacity",
                    ease: "none",
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 90%",
                        end: "top 55%",
                        scrub: true
                    }
                }
            );

            // Line 3: Enters from bottom-right, shifts diagonally upwards with balanced speed
            gsap.fromTo(line3,
                { y: "80%", x: 35, opacity: 0 },
                {
                    y: "0%",
                    x: 0,
                    opacity: 1,
                    force3D: true,
                    willChange: "transform, opacity",
                    ease: "none",
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 90%",
                        end: "top 55%",
                        scrub: true
                    }
                }
            );
        }

        // 3D Wireframe Canvas Background Parallax
        const canvas = document.getElementById("nz-3d-canvas");
        if (canvas) {
            const ctx = canvas.getContext("2d");
            let width = canvas.clientWidth;
            let height = canvas.clientHeight;

            // Generate Möbius Loop points (Infinite Twisted Ribbon - symbolizing endless creative thinking)
            const steps = 180; // Perfectly optimized steps for fluid, high-definition curves
            const points = [];

            // Adjust to retina / high-DPI displays
            const resizeCanvas = () => {
                width = canvas.clientWidth || 500;
                height = canvas.clientHeight || 500;
                canvas.width = width * window.devicePixelRatio;
                canvas.height = height * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            };
            resizeCanvas();

            const generateKnot = () => {
                points.length = 0; // Clear existing points
                const baseScale = Math.min(width, height) * 0.8; // Significantly scaled up for a majestic, giant presence
                for (let i = 0; i < steps; i++) {
                    // Loop from 0 to 4*PI to perfectly complete the 180-degree Möbius half-twist edge loop!
                    const theta = (i / steps) * Math.PI * 4;
                    const r = 1 + 0.38 * Math.cos(theta / 2);
                    // Stretch vertically (boland) by 1.62 and horizontally by 1.25 for a majestic widescreen presence
                    const x = Math.cos(theta) * r * baseScale * 1.25;
                    const y = Math.sin(theta) * r * baseScale * 1.62; // Tall, prestigious footprint
                    const z = 0.38 * Math.sin(theta / 2) * baseScale * 1.3;
                    points.push({ x, y, z });
                }
            };
            generateKnot();

            // Rotation state (controlled by scroll scrub)
            const rotationState = { rx: 0.3, ry: 0.5, rz: 0.1 };

            // Debounce canvas draw with requestAnimationFrame to ensure high-performance, stutter-free scrolling
            let drawRequested = false;
            const requestDrawKnot = () => {
                if (!drawRequested) {
                    drawRequested = true;
                    requestAnimationFrame(() => {
                        drawKnot();
                        drawRequested = false;
                    });
                }
            };

            // Link 3D rotation variables directly to scroll
            gsap.to(rotationState, {
                rx: 3.5,
                ry: 4.8,
                rz: 2.2,
                ease: "none",
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    onUpdate: requestDrawKnot
                }
            });

            // Handle Resize
            window.addEventListener("resize", () => {
                resizeCanvas();
                generateKnot();
                drawKnot();
            });

            function drawKnot() {
                ctx.clearRect(0, 0, width, height);

                const fov = Math.max(width, height) * 2.5; // Dynamic FOV scales proportionally to prevent clipping on large screens
                const centerX = width / 2;
                const centerY = height / 2;

                const cosX = Math.cos(rotationState.rx), sinX = Math.sin(rotationState.rx);
                const cosY = Math.cos(rotationState.ry), sinY = Math.sin(rotationState.ry);
                const cosZ = Math.cos(rotationState.rz), sinZ = Math.sin(rotationState.rz);

                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                ctx.shadowBlur = 0; // Disable heavy Gaussian blur shadows

                // Project all 3D points to 2D screen coordinates
                const projected = points.map(pt => {
                    // X-axis rotation
                    let y1 = pt.y * cosX - pt.z * sinX;
                    let z1 = pt.y * sinX + pt.z * cosX;

                    // Y-axis rotation
                    let x2 = pt.x * cosY + z1 * sinY;
                    let z2 = -pt.x * sinY + z1 * cosY;

                    // Z-axis rotation
                    let x3 = x2 * cosZ - y1 * sinZ;
                    let y3 = x2 * sinZ + y1 * cosZ;

                    // Safe perspective projection calculation (prevents division by zero or negative clipping values)
                    const scaleFactor = fov / Math.max(15, fov + z2);
                    const px = x3 * scaleFactor + centerX;
                    const py = y3 * scaleFactor + centerY;

                    return { x: px, y: py };
                });

                if (projected.length > 0) {
                    // Draw 1: Thick glowing translucent outline (Hardware Accelerated)
                    ctx.beginPath();
                    ctx.lineWidth = 10.0; // Thick, premium glow outline

                    const gradGlow = ctx.createLinearGradient(0, 0, width, height);
                    gradGlow.addColorStop(0, "rgba(250, 207, 63, 0.32)");   // Gold (#FACF3F)
                    gradGlow.addColorStop(0.3, "rgba(103, 232, 249, 0.32)"); // Cyan (#67E8F9)
                    gradGlow.addColorStop(0.6, "rgba(168, 85, 247, 0.32)");  // Purple (#A855F7)
                    gradGlow.addColorStop(0.85, "rgba(249, 168, 212, 0.32)"); // Pink (#F9A8D4)
                    gradGlow.addColorStop(1, "rgba(250, 207, 63, 0.32)");   // Gold Loop
                    ctx.strokeStyle = gradGlow;

                    ctx.moveTo(projected[0].x, projected[0].y);
                    for (let i = 1; i < projected.length; i++) {
                        ctx.lineTo(projected[i].x, projected[i].y);
                    }
                    ctx.closePath(); // Seamless closed loop
                    ctx.stroke();

                    // Draw 2: Sharp core line
                    ctx.beginPath();
                    ctx.lineWidth = 3.2; // Sleek bold core line

                    const gradCore = ctx.createLinearGradient(0, 0, width, height);
                    gradCore.addColorStop(0, "rgba(250, 207, 63, 0.85)");   // Gold (#FACF3F)
                    gradCore.addColorStop(0.3, "rgba(103, 232, 249, 0.85)"); // Cyan (#67E8F9)
                    gradCore.addColorStop(0.6, "rgba(168, 85, 247, 0.85)");  // Purple (#A855F7)
                    gradCore.addColorStop(0.85, "rgba(249, 168, 212, 0.85)"); // Pink (#F9A8D4)
                    gradCore.addColorStop(1, "rgba(250, 207, 63, 0.85)");   // Gold Loop
                    ctx.strokeStyle = gradCore;

                    ctx.moveTo(projected[0].x, projected[0].y);
                    for (let i = 1; i < projected.length; i++) {
                        ctx.lineTo(projected[i].x, projected[i].y);
                    }
                    ctx.closePath(); // Seamless closed loop
                    ctx.stroke();
                }
            }

            // Draw initial render
            drawKnot();
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
