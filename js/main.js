/* =============================================
   BRC CLINIC – PREMIUM JAVASCRIPT ENGINE
   All Features: Cursor, Particles, Animations,
   Dark Mode, Language, FAQ, Symptom Checker,
   Stats Counter, Forms, Scroll FX
   ============================================= */

'use strict';

/* ── LOADING SCREEN ── */
function hideLoadingScreen() {
  const ls = document.getElementById('loading-screen');
  if (ls && !ls.classList.contains('hidden')) {
    ls.classList.add('hidden');
    setTimeout(() => ls.remove(), 700);
    showCookieBar();
  }
}
// Try to hide on load
window.addEventListener('load', () => setTimeout(hideLoadingScreen, 1000));
// Safety fallback in case external resources (iframes/images) hang
setTimeout(hideLoadingScreen, 3500);

/* ── COOKIE CONSENT ── */
function showCookieBar() {
  if (localStorage.getItem('brc_cookie_accepted')) return;
  const bar = document.getElementById('cookie-bar');
  if (bar) setTimeout(() => bar.classList.add('show'), 800);
}
document.getElementById('cookieAccept')?.addEventListener('click', () => {
  localStorage.setItem('brc_cookie_accepted', 'true');
  document.getElementById('cookie-bar')?.classList.remove('show');
});
document.getElementById('cookieDecline')?.addEventListener('click', () => {
  document.getElementById('cookie-bar')?.classList.remove('show');
});

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
if (dot && ring) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
  function animRing() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(animRing); }
  animRing();
  document.querySelectorAll('a,button,.service-card,.team-card,.faq-q,.symptom-chip').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.width='16px'; dot.style.height='16px'; ring.style.width='50px'; ring.style.height='50px'; ring.style.borderColor='var(--gold)'; });
    el.addEventListener('mouseleave', () => { dot.style.width='10px'; dot.style.height='10px'; ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='var(--secondary)'; });
  });
}

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#E8B89A' : '#ffffff';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  for (let i = 0; i < 120; i++) particles.push(new Particle());
  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          ctx.strokeStyle = isDark ? 'rgba(232,184,154,' + (0.12 * (1 - dist/100)) + ')' : 'rgba(10,61,98,' + (0.05 * (1 - dist/100)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
const progress = document.getElementById('scroll-progress');
const backTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  // Navbar
  if (navbar) navbar.classList.toggle('scrolled', sy > 60);
  // Progress bar
  if (progress) {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (sy / docH * 100) + '%';
  }
  // Back to top
  if (backTop) backTop.classList.toggle('show', sy > 500);
  // Active nav link
  document.querySelectorAll('#navbar .nav-links a').forEach(link => {
    link.classList.remove('active');
  });
  const sections = ['home','services','why','doctor','conditions','awards','faq','testimonials','appointment','contact'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        document.querySelectorAll(`#navbar .nav-links a[href*="${id}"]`).forEach(a => a.classList.add('active'));
      }
    }
  });
});

/* ── HAMBURGER MENU ── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('menu-overlay');
function openMenu()  { hamburger?.classList.add('open');  mobileMenu?.classList.add('open');  menuOverlay?.classList.add('show');  document.body.style.overflow='hidden'; }
function closeMenu() { hamburger?.classList.remove('open'); mobileMenu?.classList.remove('open'); menuOverlay?.classList.remove('show'); document.body.style.overflow=''; }
hamburger?.addEventListener('click', () => hamburger.classList.contains('open') ? closeMenu() : openMenu());
menuOverlay?.addEventListener('click', closeMenu);
document.querySelectorAll('#mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));

/* ── DARK / LIGHT MODE ── */
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('brc_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeBtn) themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
themeBtn?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('brc_theme', next);
  themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
});

/* ── LANGUAGE TOGGLE ── */
const langBtn = document.getElementById('langToggle');
let currentLang = localStorage.getItem('brc_lang') || 'en';
const translations = {
  hi: {
    '.hero-badge':        '⭐ 4.9 रेटिंग · गुरुग्राम का सबसे भरोसेमंद क्लिनिक',
    '.hero-title':        'दर्द, रीढ़ और जोड़ों का <span class="highlight">उन्नत समग्र उपचार</span>',
    '.btn-hero-primary':  '📅 अपॉइंटमेंट बुक करें',
    '.btn-hero-secondary':'📞 अभी कॉल करें',
    '.cta-banner h2':     'आज ही अपनी उपचार यात्रा शुरू करें',
  },
  en: {
    '.hero-badge':        '⭐ 4.9 Rating · Gurugram\'s Most Trusted Clinic',
    '.hero-title':        'Advanced Holistic Healing for<br/><span class="highlight">Pain, Spine & Joint</span> Rehab',
    '.btn-hero-primary':  '📅 Book Appointment',
    '.btn-hero-secondary':'📞 Call Now',
    '.cta-banner h2':     'Start Your Healing Journey Today',
  }
};
function applyLang(lang) {
  const t = translations[lang];
  if (!t) return;
  Object.entries(t).forEach(([sel, val]) => {
    document.querySelectorAll(sel).forEach(el => { el.innerHTML = val; });
  });
  if (langBtn) langBtn.textContent = lang === 'hi' ? 'EN' : 'हिं';
}
langBtn?.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('brc_lang', currentLang);
  applyLang(currentLang);
});
if (currentLang === 'hi') applyLang('hi');

/* ── SCROLL REVEAL ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initReveal);

/* ── STATS COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || (target >= 1000 ? '+' : '+');
  const duration = 2000;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    const display = current >= 1000 ? current.toLocaleString('en-IN') : current;
    el.textContent = display + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = (target >= 1000 ? target.toLocaleString('en-IN') : target) + suffix;
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = true;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').classList.remove('open');
    });
    // Open clicked (if was closed)
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
    }
  });
});

/* ── SYMPTOM CHECKER ── */
document.querySelectorAll('.symptom-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
    updateSymptomResult();
  });
});
function updateSymptomResult() {
  const selected = document.querySelectorAll('.symptom-chip.selected');
  const result   = document.getElementById('symptomResult');
  const list     = document.getElementById('symptomResultList');
  if (!result || !list) return;
  if (selected.length === 0) { result.classList.remove('show'); return; }
  const allServices = new Set();
  selected.forEach(chip => {
    chip.getAttribute('data-services').split(',').forEach(s => allServices.add(s.trim()));
  });
  list.innerHTML = '';
  allServices.forEach(svc => {
    const tag = document.createElement('span');
    tag.className = 'symptom-result-tag';
    tag.textContent = svc;
    list.appendChild(tag);
  });
  result.classList.add('show');
}

/* ── APPOINTMENT FORM ── */
window.submitForm = function(e) {
  e.preventDefault();
  const name    = document.getElementById('firstName')?.value;
  const phone   = document.getElementById('phone')?.value;
  const service = document.getElementById('service')?.value;
  const home    = document.getElementById('homeVisit')?.checked;
  // Build WhatsApp message
  const msg = encodeURIComponent(
    `Hello BRC Clinic! 🙏\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nHome Visit: ${home ? 'Yes' : 'No'}\n\nI would like to book an appointment.`
  );
  // Open WhatsApp
  window.open(`https://wa.me/919311642999?text=${msg}`, '_blank');
  // Show toast
  showToast('✅ Redirecting to WhatsApp! We\'ll confirm your appointment shortly.');
  e.target.reset();
};
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(80px)'; }, 4000);
}

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── PAGE TRANSITION (internal links) ── */
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { window.location.href = href; }, 300);
    }
  });
});
window.addEventListener('pageshow', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.4s ease';
});

/* ── ACTIVE NAV ON PAGE LOAD ── */
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navbar .nav-links a, #mobile-menu a').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop();
    if (linkPage === page) link.classList.add('active');
    else link.classList.remove('active');
  });
})();

/* ── TILT EFFECT ON CARDS ── */
document.querySelectorAll('.hero-stat-card, .award-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    const tiltX = -(y / rect.height) * 8;
    const tiltY =  (x / rect.width)  * 8;
    card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── TYPING ANIMATION FOR HERO TITLE ── */
(function initTypingEffect() {
  const phrases = [
    'Pain, Spine & Joint Rehab',
    'Fertility & IVF Support',
    'Neurotherapy & Healing',
    'Holistic Root-Cause Care',
  ];
  const el = document.querySelector('.hero-title .highlight');
  if (!el) return;
  // Save original
  const original = el.textContent;
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const  phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  setTimeout(type, 3000);
})();

/* ── WHATSAPP PHONE SELECTOR TOOLTIP ── */
const waBtn = document.getElementById('whatsapp-btn');
if (waBtn) {
  waBtn.setAttribute('title', 'Chat on WhatsApp: +91 93116 42999');
}

console.log('%cBRC Clinic Website', 'color:#E8B89A;font-size:20px;font-weight:bold;');
console.log('%cBuilt with ❤️ for Dr. Arpita Shefali & Team', 'color:#0A3D62;font-size:12px;');

/* ── BEFORE/AFTER SLIDER ── */
const baSlider = document.getElementById('ba-slider');
if (baSlider) {
  const baBefore = baSlider.querySelector('.ba-image.before');
  const baHandle = baSlider.querySelector('.ba-handle');
  let isDragging = false;

  const moveHandler = (e) => {
    if (!isDragging) return;
    const rect = baSlider.getBoundingClientRect();
    let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percentage = (x / rect.width) * 100;
    
    baBefore.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    baHandle.style.left = `${percentage}%`;
  };

  baSlider.addEventListener('mousedown', () => isDragging = true);
  baSlider.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('mousemove', moveHandler);
  window.addEventListener('touchmove', moveHandler);
}

/* ── INTERACTIVE BODY MAP ── */
document.querySelectorAll('.map-part').forEach(part => {
  part.addEventListener('click', () => {
    // Remove active from all
    document.querySelectorAll('.map-part').forEach(p => p.classList.remove('active'));
    // Add active to clicked
    part.classList.add('active');

    // Update info panel
    const infoPanel = document.getElementById('map-info-content');
    const placeholder = document.getElementById('map-info-placeholder');
    if (infoPanel && placeholder) {
      placeholder.style.display = 'none';
      infoPanel.style.display = 'block';
      
      const title = part.getAttribute('data-title') || 'Body Area';
      const desc = part.getAttribute('data-desc') || 'We offer specialized treatments for this area.';
      const treatments = part.getAttribute('data-treatments') || '';
      
      let html = `<h3>${title}</h3><p>${desc}</p>`;
      if (treatments) {
        html += `<ul>` + treatments.split(',').map(t => `<li>${t.trim()}</li>`).join('') + `</ul>`;
      }
      html += `<a href="appointment.html" class="btn-primary" style="margin-top:1rem;">Consult Us</a>`;
      infoPanel.innerHTML = html;
    }
  });
});
