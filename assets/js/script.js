document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    const heroTl = gsap.timeline();

    // Initial GSAP setup if needed
    // const heroTl = gsap.timeline();

    // Title lines are now revealed using CSS animations (see style.css) to improve LCP Google Pagespeed Score

    // Scroll Fade Up animations for all other elements
    const fadeElements = document.querySelectorAll(".js-fade-up");
    fadeElements.forEach((el) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Trigger when element hits 85% of viewport
                toggleActions: "play none none reverse"
            }
        });
    });

    // Abstract Image Parallax Effect
    const parallaxImages = document.querySelectorAll(".parallax-image img");
    parallaxImages.forEach((img) => {
        gsap.to(img, {
            y: "15%",
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Abstract Glow Parallax
    if (document.querySelector(".abstract-glow")) {
        gsap.to(".abstract-glow", {
            y: 300,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Lazy load and play videos when they enter the viewport
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // Force hide loader after a few seconds, preventing infinite loading
                    // on slow network or iOS low-power mode quirks
                    setTimeout(() => {
                        let loader = video.parentNode.querySelector('.js-vid-loader');
                        if (loader && !loader.dataset.hiding) {
                            loader.dataset.hiding = "true";
                            gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => loader.remove() });
                        }
                    }, 4000);

                    let playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            // Successfully playing, no action needed here as event listeners handle it
                        }).catch(e => {
                            // Play failed (e.g., due to user interaction restrictions on mobile)
                            // We should hide the loader so they at least see the poster/first frame
                            let loader = video.parentNode.querySelector('.js-vid-loader');
                            if (loader && !loader.dataset.hiding) {
                                loader.dataset.hiding = "true";
                                gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => loader.remove() });
                            }
                        });
                    }
                } else {
                    video.pause(); // Pause when out of sight to save CPU/Battery
                }
            });
        }, {
            // Trigger 1500px before reaching viewport for smoother experience on fast scroll
            rootMargin: "1500px 0px 1500px 0px"
        });

        document.querySelectorAll('video.js-lazy-video').forEach(video => {
            const container = video.parentElement;

            // Ensure any overlay text is above the preloader
            const overlay = container.querySelector('div.absolute');
            if (overlay) overlay.style.zIndex = '10';

            // Create a loading spinner placeholder
            const loader = document.createElement('div');
            loader.className = 'absolute inset-0 flex items-center justify-center bg-gray-200 z-[5] js-vid-loader';
            loader.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-4xl text-gray-400"></i>';
            video.parentNode.insertBefore(loader, video.nextSibling);

            const hideLoader = () => {
                if (loader.parentNode && !loader.dataset.hiding) {
                    loader.dataset.hiding = "true";
                    gsap.to(loader, { opacity: 0, duration: 0.5, onComplete: () => loader.remove() });
                }
            };

            // Remove loader when video has enough data or starts playing
            video.addEventListener('playing', hideLoader);
            video.addEventListener('loadeddata', hideLoader);
            video.addEventListener('canplay', hideLoader);
            video.addEventListener('loadedmetadata', hideLoader);

            // Just in case it's already loaded
            if (video.readyState >= 3 || video.currentTime > 0) {
                hideLoader();
            }

            // Also hide loader if there's an error or stalled loading
            video.addEventListener('error', hideLoader);
            video.addEventListener('suspend', hideLoader);
            video.addEventListener('stalled', hideLoader);

            videoObserver.observe(video);
        });
    }

    // Accessibility fix for Complianz Cookie links
    document.querySelectorAll('.cmplz-link').forEach(link => {
        if (!link.textContent.trim() && !link.getAttribute('aria-label') && !link.getAttribute('title')) {
            link.setAttribute('aria-label', 'Cookie Setting Link');
        }
    });
});


