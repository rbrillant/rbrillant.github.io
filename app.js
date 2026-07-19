// ============ MATRIX CODE RAIN WITH CURSOR REPULSION ============
const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');

// Code characters - programming symbols and keywords
const codeChars = '01{}[]()<>=/\\;:,.+-*&|!?@#$%^~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzconst let var function return if else for while class import export default async await Promise try catch throw new this self void delete typeof instanceof in of true false null undefined NaN Infinity break continue switch case default do yield static get set extends super interface type enum implements abstract private protected public readonly async function* Symbol BigInt WeakMap WeakSet Proxy Reflect ArrayBuffer SharedArrayBuffer DataView Float32Array Float64Array Int8Array Int16Array Int32Array Uint8Array Uint16Array Uint32Array Uint8ClampedArray Map Set Promise RegExp Error RangeError ReferenceError SyntaxError TypeError URIError JSON Math Date Number String Boolean Array Object Function';

let columns = [];
let mouseX = -1000;
let mouseY = -1000;
const repulsionRadius = 120;
const repulsionForce = 8;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initColumns();
}

function initColumns() {
    const fontSize = 14;
    const columnCount = Math.floor(canvas.width / fontSize);
    columns = [];

    for (let i = 0; i < columnCount; i++) {
        columns.push({
            x: i * fontSize,
            y: Math.random() * canvas.height * -1,
            speed: 0.5 + Math.random() * 2,
            chars: [],
            fontSize: fontSize,
            opacity: 0.1 + Math.random() * 0.4
        });

        // Pre-generate random chars for this column
        const charCount = 15 + Math.floor(Math.random() * 20);
        for (let j = 0; j < charCount; j++) {
            columns[i].chars.push({
                char: codeChars[Math.floor(Math.random() * codeChars.length)],
                brightness: Math.random()
            });
        }
    }
}

function drawMatrix() {
    // Fade effect for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.001;

    columns.forEach((col, colIndex) => {
        // Update position
        col.y += col.speed;

        // Reset when off screen
        if (col.y > canvas.height + 200) {
            col.y = -200 - Math.random() * 400;
            col.speed = 0.5 + Math.random() * 2;
            // Regenerate some chars
            col.chars.forEach(c => {
                if (Math.random() > 0.7) {
                    c.char = codeChars[Math.floor(Math.random() * codeChars.length)];
                }
            });
        }

        // Draw each character in the column
        col.chars.forEach((charData, charIndex) => {
            const charY = col.y + charIndex * col.fontSize;

            // Skip if off screen
            if (charY < -20 || charY > canvas.height + 20) return;

            // Calculate distance from mouse
            const dx = col.x - mouseX;
            const dy = charY - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Apply repulsion
            let offsetX = 0;
            let offsetY = 0;
            let scale = 1;

            if (dist < repulsionRadius && dist > 0) {
                const force = (1 - dist / repulsionRadius) * repulsionForce;
                offsetX = (dx / dist) * force;
                offsetY = (dy / dist) * force;
                scale = 1 + (1 - dist / repulsionRadius) * 0.3;
            }

            // Color - green with varying brightness
            const isHead = charIndex === 0;
            const brightness = charData.brightness;

            let r, g, b, alpha;
            if (isHead) {
                // Bright white-green head
                r = 180;
                g = 255;
                b = 180;
                alpha = 0.95;
            } else {
                // Gradient green based on position
                const fade = 1 - (charIndex / col.chars.length);
                r = Math.floor(30 + brightness * 20);
                g = Math.floor(180 + brightness * 75);
                b = Math.floor(30 + brightness * 20);
                alpha = col.opacity * fade * (0.6 + brightness * 0.4);
            }

            // Occasional bright flash
            if (Math.random() > 0.995) {
                r = 255;
                g = 255;
                b = 255;
                alpha = 1;
            }

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.font = `${col.fontSize * scale}px "Courier New", monospace`;
            ctx.fillText(charData.char, col.x + offsetX, charY + offsetY);
            ctx.restore();
        });
    });

    // Draw repulsion glow at mouse position
    if (mouseX > 0 && mouseY > 0) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, repulsionRadius);
        gradient.addColorStop(0, 'rgba(94, 106, 210, 0.15)');
        gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(mouseX - repulsionRadius, mouseY - repulsionRadius, repulsionRadius * 2, repulsionRadius * 2);
    }

    requestAnimationFrame(drawMatrix);
}

// Track mouse
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
});

// Touch support
document.addEventListener('touchmove', (e) => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    mouseX = -1000;
    mouseY = -1000;
});

// ============ GSAP SCROLL ANIMATIONS ============
gsap.registerPlugin(ScrollTrigger);

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
    const heroTl = gsap.timeline({ delay: 0.5 });

    heroTl.from('.hero-greeting', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out'
    });

    heroTl.from('.hero-name .anim-split', {
        opacity: 0,
        y: 60,
        rotateX: -30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    }, '-=0.3');

    heroTl.from('.hero-role', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.4');

    heroTl.from('.hero-desc', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

    heroTl.from('.hero-contact', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

    heroTl.from('.hero-actions', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

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
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.about-headline', {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-headline',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.about-desc', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.about-desc',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.stat-card', {
        opacity: 0,
        x: 50,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Skills section
    gsap.from('#skills .section-label', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.skill-column', {
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.skills-showcase',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Projects section
    gsap.from('#projects .section-label', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.project-item', {
        opacity: 0,
        y: 40,
        x: -30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.projects-showcase',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Contact section
    gsap.from('#contact .section-label', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.contact-headline', {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact-headline',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.contact-desc', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-desc',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.contact-actions', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact-actions',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.info-card', {
        opacity: 0,
        x: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact-right',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Slide transitions - parallax effect on sections
    gsap.utils.toArray('.slide').forEach((slide, i) => {
        gsap.from(slide.querySelector('.slide-content'), {
            y: 60,
            opacity: 0.3,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: slide,
                start: 'top 90%',
                end: 'top 30%',
                scrub: 1
            }
        });
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
                x: x * 0.2,
                y: y * 0.2,
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
                    duration: 1.2,
                    scrollTo: { y: target, offsetY: 72 },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    // Always init matrix rain
    resizeCanvas();
    drawMatrix();
    window.addEventListener('resize', resizeCanvas);

    if (prefersReducedMotion) {
        gsap.set('[class*="anim-"]', { opacity: 1, y: 0, x: 0, rotateX: 0 });
        initProgressBar();
        return;
    }

    initHeroAnimations();
    initScrollAnimations();
    initMagneticButtons();
    initNavHighlight();
    initProgressBar();
});
