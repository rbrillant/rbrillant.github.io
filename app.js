// UI/UX Pro Max - GSAP Animation Implementation
// Following skill guidelines: power2.out easing, 400-600ms duration, stagger 0.08s

gsap.registerPlugin(ScrollTrigger);

// Respect reduced-motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============ PROGRESS BAR ============
function initProgressBar() {
    gsap.to('.progress-bar', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
        }
    });
}

// ============ HERO ANIMATIONS ============
function initHeroAnimations() {
    const heroTl = gsap.timeline({ delay: 0.3 });

    // Greeting fade up
    heroTl.from('.hero-greeting', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    });

    // Name split animation (per line)
    heroTl.from('.hero-name .anim-split', {
        opacity: 0,
        y: 40,
        rotateX: -20,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.2');

    // Role fade up
    heroTl.from('.hero-role', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

    // Description fade up
    heroTl.from('.hero-desc', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

    // Contact info fade up
    heroTl.from('.hero-contact', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

    // Actions fade up
    heroTl.from('.hero-actions', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

    // Scroll indicator
    heroTl.from('.scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.2');
}

// ============ SCROLL-TRIGGERED ANIMATIONS ============
function initScrollAnimations() {
    // About section
    gsap.from('#about .section-label', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.about-headline', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.about-headline',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.about-desc', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.about-desc',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.stat-card', {
        opacity: 0,
        x: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    // Skills section
    gsap.from('#skills .section-label', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.skill-column', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.skills-showcase',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    // Projects section
    gsap.from('#projects .section-label', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.project-item', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.projects-showcase',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    // Contact section
    gsap.from('#contact .section-label', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.contact-headline', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-headline',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.contact-desc', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-desc',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.contact-actions', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-actions',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.info-card', {
        opacity: 0,
        x: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-right',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
}

// ============ PARALLAX BLOBS ============
function initParallaxBlobs() {
    gsap.to('.blob-1', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
        }
    });

    gsap.to('.blob-2', {
        y: 80,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
        }
    });

    gsap.to('.blob-3', {
        y: -60,
        x: 40,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2,
        }
    });
}

// ============ MAGNETIC BUTTONS ============
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ============ NAV HIGHLIGHT ============
function initNavHighlight() {
    const sections = document.querySelectorAll('.slide[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => {
                if (self.isActive) {
                    const id = section.getAttribute('id');
                    navLinks.forEach(link => {
                        link.style.color = '';
                        if (link.getAttribute('href') === `#${id}`) {
                            link.style.color = 'var(--foreground)';
                        }
                    });
                }
            }
        });
    });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: target, offsetY: 72 },
                    ease: 'power2.inOut'
                });
            }
        });
    });
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion) {
        // Show everything immediately without animation
        gsap.set('[class*="anim-"]', { opacity: 1, y: 0, x: 0, rotateX: 0 });
        gsap.set('.blob', { opacity: 0.3 });
        initProgressBar();
        return;
    }

    initHeroAnimations();
    initScrollAnimations();
    initParallaxBlobs();
    initMagneticButtons();
    initNavHighlight();
    initProgressBar();
});
