// ==================== BACKGROUND CODE RAIN ====================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

const tokens = ['const','let','var','function','return','if','else','for','while','class','import','export','async','await','try','catch','true','false','null','undefined','=>','===','!==','&&','||','0','1','{}','[]','()'];

let drops = [];
let mouse = { x: -999, y: -999 };
let canvasW, canvasH;

function resize() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;
    drops = [];
    const cols = Math.floor(canvasW / 80);
    for (let i = 0; i < cols; i++) {
        drops.push({
            x: Math.random() * canvasW,
            y: Math.random() * canvasH * -1,
            speed: 0.2 + Math.random() * 0.6,
            text: tokens[Math.floor(Math.random() * tokens.length)],
            alpha: 0.03 + Math.random() * 0.06,
            size: 11 + Math.floor(Math.random() * 3)
        });
    }
}

function drawRain() {
    ctx.fillStyle = 'rgba(9, 9, 11, 0.15)';
    ctx.fillRect(0, 0, canvasW, canvasH);

    for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.y += d.speed;

        if (d.y > canvasH + 50) {
            d.y = -50 - Math.random() * 200;
            d.x = Math.random() * canvasW;
            d.text = tokens[Math.floor(Math.random() * tokens.length)];
        }

        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hole = 160;

        if (dist < hole) continue;

        let pushX = 0;
        let pushY = 0;
        if (dist < hole * 2 && dist > 0) {
            const force = (1 - dist / (hole * 2)) * 20;
            pushX = (dx / dist) * force;
            pushY = (dy / dist) * force;
        }

        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = '#6366f1';
        ctx.font = `${d.size}px "JetBrains Mono", monospace`;
        ctx.fillText(d.text, d.x + pushX, d.y + pushY);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(drawRain);
}

document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
document.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
document.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', () => { mouse.x = -999; mouse.y = -999; });

// ==================== GSAP ====================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initAnimations() {
    // Hero
    const hero = gsap.timeline({ delay: 0.3 });
    hero.from('.hero__tag', { opacity: 0, y: 15, duration: 0.5 });
    hero.from('.hero__title', { opacity: 0, y: 25, duration: 0.6, ease: 'power3.out' }, '-=0.2');
    hero.from('.hero__desc', { opacity: 0, y: 15, duration: 0.4 }, '-=0.2');
    hero.from('.hero__actions', { opacity: 0, y: 15, duration: 0.4 }, '-=0.15');
    hero.from('.hero__meta', { opacity: 0, y: 10, duration: 0.4 }, '-=0.1');

    // Sections
    const sections = ['.about', '.skills', '.work', '.contact'];
    const targets = [
        ['.about__lead', '.about__text', '.about__stats'],
        ['.skill-group'],
        ['.work__card'],
        ['.contact__lead', '.contact__actions', '.contact__info']
    ];

    document.querySelectorAll('.section').forEach((section, i) => {
        gsap.from(section.querySelector('.section__num'), {
            opacity: 0, y: 10, duration: 0.4,
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
        gsap.from(section.querySelector('.section__title'), {
            opacity: 0, y: 15, duration: 0.5,
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
    });

    gsap.from('.about__lead', { opacity: 0, y: 20, duration: 0.5, scrollTrigger: { trigger: '.about__lead', start: 'top 88%' } });
    gsap.from('.about__text', { opacity: 0, y: 20, duration: 0.5, delay: 0.1, scrollTrigger: { trigger: '.about__text', start: 'top 88%' } });
    gsap.from('.stat', { opacity: 0, y: 20, duration: 0.4, stagger: 0.08, scrollTrigger: { trigger: '.about__stats', start: 'top 88%' } });

    gsap.from('.skill-group', { opacity: 0, y: 20, duration: 0.4, stagger: 0.08, scrollTrigger: { trigger: '.skills', start: 'top 85%' } });

    gsap.fromTo('.work__card',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: '.work', start: 'top 90%' } }
    );

    gsap.from('.contact__lead', { opacity: 0, y: 20, duration: 0.5, scrollTrigger: { trigger: '.contact__lead', start: 'top 88%' } });
    gsap.from('.contact__actions', { opacity: 0, y: 15, duration: 0.4, scrollTrigger: { trigger: '.contact__actions', start: 'top 90%' } });
    gsap.from('.contact__info', { opacity: 0, y: 15, duration: 0.4, stagger: 0.06, scrollTrigger: { trigger: '.contact__right', start: 'top 88%' } });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                gsap.to(window, { duration: 0.8, scrollTo: { y: target, offsetY: 56 }, ease: 'power2.inOut' });
            }
        });
    });
}

function initNavHighlight() {
    const sections = document.querySelectorAll('.section[id]');
    const links = document.querySelectorAll('.nav__links a');
    sections.forEach(sec => {
        ScrollTrigger.create({
            trigger: sec,
            start: 'top center',
            end: 'bottom center',
            onToggle: self => {
                if (self.isActive) {
                    links.forEach(l => {
                        l.style.color = l.getAttribute('href') === `#${sec.id}` ? 'var(--text)' : '';
                    });
                }
            }
        });
    });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    resize();
    requestAnimationFrame(drawRain);
    window.addEventListener('resize', resize);

    if (reducedMotion) return;

    initAnimations();
    initSmoothScroll();
    initNavHighlight();
});
