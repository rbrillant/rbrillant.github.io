// ============ MATRIX CODE RAIN WITH CURSOR REPULSION ============
const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');

const codeChars = '{}[]()<>=/\\;:,.+-*&|!?@#$%^~`const let var function return if else for while class import export default async await Promise try catch throw new this void delete typeof instanceof in of true false null undefined';
const charArray = Array.from(codeChars);

let columns = [];
let mouseX = -1000;
let mouseY = -1000;
const repulsionRadius = 120;
const repulsionForce = 8;
const fontSize = 16;
let lastFrame = 0;
const frameInterval = 33; // ~30fps for performance

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initColumns();
}

function initColumns() {
    const columnCount = Math.floor(canvas.width / fontSize);
    columns = [];

    for (let i = 0; i < columnCount; i++) {
        const charCount = 10 + Math.floor(Math.random() * 15);
        const chars = [];
        for (let j = 0; j < charCount; j++) {
            chars.push({
                char: charArray[Math.floor(Math.random() * charArray.length)],
                brightness: Math.random()
            });
        }
        columns.push({
            x: i * fontSize,
            y: Math.random() * canvas.height * -1,
            speed: 0.4 + Math.random() * 1.5,
            chars: chars,
            opacity: 0.15 + Math.random() * 0.35
        });
    }
}

function drawMatrix(timestamp) {
    if (timestamp - lastFrame < frameInterval) {
        requestAnimationFrame(drawMatrix);
        return;
    }
    lastFrame = timestamp;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const canvasW = canvas.width;
    const canvasH = canvas.height;

    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.y += col.speed;

        if (col.y > canvasH + 200) {
            col.y = -200 - Math.random() * 400;
            col.speed = 0.4 + Math.random() * 1.5;
            for (let j = 0; j < col.chars.length; j++) {
                if (Math.random() > 0.7) {
                    col.chars[j].char = charArray[Math.floor(Math.random() * charArray.length)];
                }
            }
        }

        for (let j = 0; j < col.chars.length; j++) {
            const charY = col.y + j * fontSize;
            if (charY < -20 || charY > canvasH + 20) continue;

            const dx = col.x - mouseX;
            const dy = charY - mouseY;
            const distSq = dx * dx + dy * dy;
            const radiusSq = repulsionRadius * repulsionRadius;

            let offsetX = 0;
            let offsetY = 0;
            let scale = 1;

            if (distSq < radiusSq && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const force = (1 - dist / repulsionRadius) * repulsionForce;
                offsetX = (dx / dist) * force;
                offsetY = (dy / dist) * force;
                scale = 1 + (1 - dist / repulsionRadius) * 0.3;
            }

            const isHead = j === 0;
            const charData = col.chars[j];
            const brightness = charData.brightness;
            let alpha;

            if (isHead) {
                ctx.fillStyle = '#b4ffb4';
                alpha = 0.95;
            } else {
                const fade = 1 - (j / col.chars.length);
                const r = 30 + brightness * 20 | 0;
                const g = 180 + brightness * 75 | 0;
                const b = 30 + brightness * 20 | 0;
                alpha = col.opacity * fade * (0.6 + brightness * 0.4);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
            }

            if (Math.random() > 0.995) {
                ctx.fillStyle = '#ffffff';
                alpha = 1;
            }

            ctx.globalAlpha = alpha;
            ctx.font = `${fontSize * scale}px "Courier New",monospace`;
            ctx.fillText(charData.char, col.x + offsetX, charY + offsetY);
        }
    }

    ctx.globalAlpha = 1;

    if (mouseX > 0 && mouseY > 0) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, repulsionRadius);
        gradient.addColorStop(0, 'rgba(94,106,210,0.12)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(mouseX - repulsionRadius, mouseY - repulsionRadius, repulsionRadius * 2, repulsionRadius * 2);
    }

    requestAnimationFrame(drawMatrix);
}

document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
document.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });
document.addEventListener('touchmove', (e) => { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', () => { mouseX = -1000; mouseY = -1000; });

// ============ GSAP SCROLL ANIMATIONS ============
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============ PROGRESS BAR ============
function initProgressBar() {
    gsap.to('.progress-bar', {
        width: '100%',
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });
}

// ============ HERO ANIMATIONS ============
function initHeroAnimations() {
    const heroTl = gsap.timeline({ delay: 0.5 });
    heroTl.from('.hero-greeting', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' });
    heroTl.from('.hero-name .anim-split', { opacity: 0, y: 60, rotateX: -30, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.3');
    heroTl.from('.hero-role', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    heroTl.from('.hero-desc', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    heroTl.from('.hero-contact', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    heroTl.from('.hero-actions', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    heroTl.from('.scroll-indicator', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2');
}

// ============ SCROLL-TRIGGERED ANIMATIONS ============
function initScrollAnimations() {
    gsap.from('#about .section-label', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '#about', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.about-headline', { opacity: 0, y: 40, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.about-headline', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.about-desc', { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '.about-desc', start: 'top 85%', toggleActions: 'play none none reverse' } });
    gsap.from('.stat-card', { opacity: 0, x: 50, duration: 0.6, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.about-stats', start: 'top 80%', toggleActions: 'play none none reverse' } });

    gsap.from('#skills .section-label', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '#skills', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.skill-column', { opacity: 0, y: 50, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.skills-showcase', start: 'top 80%', toggleActions: 'play none none reverse' } });

    gsap.from('#projects .section-label', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '#projects', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.project-item', { opacity: 0, y: 40, x: -30, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.projects-showcase', start: 'top 80%', toggleActions: 'play none none reverse' } });

    gsap.from('#contact .section-label', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.contact-headline', { opacity: 0, y: 40, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.contact-headline', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.contact-desc', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.contact-desc', start: 'top 85%', toggleActions: 'play none none reverse' } });
    gsap.from('.contact-actions', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.contact-actions', start: 'top 85%', toggleActions: 'play none none reverse' } });
    gsap.from('.info-card', { opacity: 0, x: 40, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.contact-right', start: 'top 80%', toggleActions: 'play none none reverse' } });

    gsap.utils.toArray('.slide').forEach((slide) => {
        gsap.from(slide.querySelector('.slide-content'), {
            y: 60, opacity: 0.3, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: slide, start: 'top 90%', end: 'top 30%', scrub: 1 }
        });
    });
}

// ============ MAGNETIC BUTTONS ============
function initMagneticButtons() {
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
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
                        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--foreground)' : '';
                    });
                }
            }
        });
    });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, { duration: 1.2, scrollTo: { y: target, offsetY: 72 }, ease: 'power3.inOut' });
            }
        });
    });
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    requestAnimationFrame(drawMatrix);
    window.addEventListener('resize', resizeCanvas);

    if (prefersReducedMotion) {
        gsap.set('[class*="anim-"]', { opacity: 1, y: 0, x: 0, rotateX: 0 });
        initProgressBar();
        initSmoothScroll();
        return;
    }

    initHeroAnimations();
    initScrollAnimations();
    initMagneticButtons();
    initNavHighlight();
    initProgressBar();
    initSmoothScroll();
});
