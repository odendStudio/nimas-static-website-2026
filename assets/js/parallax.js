document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis for Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
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

        // 2.4 Scroll Indicator Fade Out
        const scrollIndicator = document.getElementById("nz-scroll-indicator");
        if (scrollIndicator) {
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

        const aboutElements = aboutSection.querySelectorAll("h2, p");
        aboutElements.forEach(el => gsap.set(el, { willChange: "transform, opacity" }));

        // Redesigned Text Parallax: Slight rotation with scrub
        gsap.fromTo(aboutElements,
            {
                y: 120,
                opacity: 0,
                rotationX: 15,
                transformOrigin: "bottom center"
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top 80%",
                    end: "center 50%",
                    scrub: 1
                }
            }
        );

        // Separate, smoother animation for the button to prevent sudden jumping
        const aboutButton = aboutSection.querySelector("a");
        if(aboutButton) {
           gsap.set(aboutButton, { willChange: "transform, opacity" });
           gsap.fromTo(aboutButton, 
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: aboutButton,
                        start: "top 90%",
                    }
                }
           );
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
            gsap.set(video, { scale: 1.15, transformOrigin: "center center", willChange: "transform" });
            gsap.to(video, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: video.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
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
                    end: "bottom top",
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

        // Floating hand
        const hand = ctaSection.querySelector(".hand-wave");
        if (hand) {
            gsap.to(hand, {
                y: -10,
                rotation: 10,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }
});
