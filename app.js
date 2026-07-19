// ============ CODE RAIN WITH CURSOR HOLE ============
const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');

const codeTokens = ['const','let','var','function','return','if','else','for','while','class','import','export','default','async','await','try','catch','throw','new','this','void','delete','typeof','instanceof','true','false','null','undefined','switch','case','break','continue','do','yield','static','get','set','extends','super','0','1','{}','[]','()','=>','===','!==','&&','||','!','+','-','*','/','%','**','++','--','=','+=','-=','*=','/='];

let columns = [];
let mouseX = -9999;
let mouseY = -9999;
const holeRadius = 140;
const fontSize = 15;
let lastTime = 0;
const fps = 28;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initColumns();
}

function initColumns() {
    const count = Math.floor(canvas.width / (fontSize * 2.5));
    columns = [];
    for (let i = 0; i < count; i++) {
        columns.push(createColumn(i));
    }
}

function createColumn(index) {
    const x = index * (canvas.width / Math.floor(canvas.width / (fontSize * 2.5)));
    return {
        x: x,
        y: Math.random() * -canvas.height,
        speed: 0.3 + Math.random() * 1.8,
        opacity: 0.2 + Math.random() * 0.5,
        words: generateWords(),
        headWord: -1
    };
}

function generateWords() {
    const count = 3 + Math.floor(Math.random() * 5);
    const words = [];
    for (let i = 0; i < count; i++) {
        words.push({
            text: codeTokens[Math.floor(Math.random() * codeTokens.length)],
            gap: 10 + Math.floor(Math.random() * 20)
        });
    }
    return words;
}

function draw(timestamp) {
    if (timestamp - lastTime < 1000 / fps) {
        requestAnimationFrame(draw);
        return;
    }
    lastTime = timestamp;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cw = canvas.width;
    const ch = canvas.height;
    const dx = mouseX;
    const dy = mouseY;
    const hr = holeRadius;
    const hr2 = hr * hr;

    ctx.font = `${fontSize}px "Courier New", monospace`;

    for (let c = 0; c < columns.length; c++) {
        const col = columns[c];
        col.y += col.speed;

        if (col.y > ch + 100) {
            col.y = -100 - Math.random() * 300;
            col.speed = 0.3 + Math.random() * 1.8;
            col.words = generateWords();
        }

        let drawY = col.y;
        for (let w = 0; w < col.words.length; w++) {
            const word = col.words[w];
            const wordY = drawY;

            const wordWidth = word.text.length * fontSize;
            const wordCenterX = col.x + wordWidth / 2;
            const wordCenterY = wordY;

            const distX = wordCenterX - dx;
            const distY = wordCenterY - dy;
            const distSq = distX * distX + distY * distY;

            // Push characters away from cursor
            let pushX = 0;
            let pushY = 0;
            if (distSq < hr2 && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const force = (1 - dist / hr) * 40;
                pushX = (distX / dist) * force;
                pushY = (distY / dist) * force;
            }

            // Skip word entirely if in the hole
            if (distSq < hr2 * 0.3) {
                drawY += word.gap + fontSize;
                continue;
            }

            const isHead = w === 0;
            const fade = 1 - (w / col.words.length) * 0.6;

            if (isHead) {
                ctx.globalAlpha = 0.95;
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.globalAlpha = col.opacity * fade;
                // Vary color between blue-ish and green-ish code tones
                const hue = 220 + (w * 15);
                ctx.fillStyle = `hsl(${hue}, 60%, 65%)`;
            }

            ctx.fillText(word.text, col.x + pushX, wordY + pushY);
            drawY += word.gap + fontSize;
        }
    }

    ctx.globalAlpha = 1;

    // Subtle glow around cursor hole
    if (dx > 0 && dy > 0) {
        const gradient = ctx.createRadialGradient(dx, dy, 0, dx, dy, hr);
        gradient.addColorStop(0, 'rgba(94, 106, 210, 0.15)');
        gradient.addColorStop(0.6, 'rgba(94, 106, 210, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dx, dy, hr, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(draw);
}

document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
document.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });
document.addEventListener('touchmove', (e) => { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', () => { mouseX = -9999; mouseY = -9999; });

// ============ GSAP ============
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initProgressBar() {
    gsap.to('.progress-bar', { width: '100%', ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
}

function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.4 });
    tl.from('.hero-greeting', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' });
    tl.from('.hero-name .anim-split', { opacity: 0, y: 40, rotateX: -20, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, '-=0.2');
    tl.from('.hero-role', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    tl.from('.hero-desc', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    tl.from('.hero-contact', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    tl.from('.hero-actions', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    tl.from('.scroll-indicator', { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' }, '-=0.1');
}

function initScrollAnimations() {
    gsap.from('#about .section-label', { opacity: 0, y: 25, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '#about', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.about-headline', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.about-headline', start: 'top 85%', toggleActions: 'play none none reverse' } });
    gsap.from('.about-desc', { opacity: 0, y: 20, duration: 0.5, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.about-desc', start: 'top 88%', toggleActions: 'play none none reverse' } });
    gsap.from('.stat-card', { opacity: 0, x: 40, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.about-stats', start: 'top 85%', toggleActions: 'play none none reverse' } });

    gsap.from('#skills .section-label', { opacity: 0, y: 25, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '#skills', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.skill-column', { opacity: 0, y: 40, duration: 0.6, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.skills-showcase', start: 'top 85%', toggleActions: 'play none none reverse' } });

    gsap.from('#projects .section-label', { opacity: 0, y: 25, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '#projects', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.project-item', { opacity: 0, y: 30, x: -20, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.projects-showcase', start: 'top 85%', toggleActions: 'play none none reverse' } });

    gsap.from('#contact .section-label', { opacity: 0, y: 25, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from('.contact-headline', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.contact-headline', start: 'top 85%', toggleActions: 'play none none reverse' } });
    gsap.from('.contact-desc', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.contact-desc', start: 'top 88%', toggleActions: 'play none none reverse' } });
    gsap.from('.contact-actions', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '.contact-actions', start: 'top 88%', toggleActions: 'play none none reverse' } });
    gsap.from('.info-card', { opacity: 0, x: 30, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.contact-right', start: 'top 85%', toggleActions: 'play none none reverse' } });
}

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

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, { duration: 1.0, scrollTo: { y: target, offsetY: 64 }, ease: 'power3.inOut' });
            }
        });
    });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    requestAnimationFrame(draw);
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
