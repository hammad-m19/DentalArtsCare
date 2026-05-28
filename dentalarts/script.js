/* ----------------------------------------------------------------
   Utility: add ripple to all .btn elements
---------------------------------------------------------------- */
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', addRipple);
});

/* ----------------------------------------------------------------
   Page loader — hide once DOM + fonts are ready
---------------------------------------------------------------- */
const loader = document.getElementById('page-loader');

function hideLoader() {
  loader.classList.add('hidden');
}

if (document.readyState === 'complete') {
  setTimeout(hideLoader, 400);
} else {
  window.addEventListener('load', () => setTimeout(hideLoader, 400));
}

/* ----------------------------------------------------------------
   Navbar: scroll behaviour (frosted glass + shrink)
---------------------------------------------------------------- */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ----------------------------------------------------------------
   Hamburger / mobile nav
---------------------------------------------------------------- */
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMobile = document.getElementById('nav-mobile-menu');
let mobileNavOpen = false;

function toggleMobileNav() {
  mobileNavOpen = !mobileNavOpen;
  hamburgerBtn.classList.toggle('active', mobileNavOpen);
  navMobile.classList.toggle('open', mobileNavOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(mobileNavOpen));
  navMobile.setAttribute('aria-hidden', String(!mobileNavOpen));

  // Prevent body scroll when open
  document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
}

hamburgerBtn.addEventListener('click', toggleMobileNav);

// Close nav on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileNavOpen) toggleMobileNav();
  });
});

/* ----------------------------------------------------------------
   Hero Canvas — animated particles
---------------------------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 55;

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 2.5 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.45 + 0.15);
      this.life = 0;
      this.maxLife = Math.random() * 250 + 150;
      this.color = Math.random() < 0.6 ? '79,195,247' : '129,199,132';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.55;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${alpha})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset(true));
  }, { passive: true });

  init();
  loop();
})();

/* ----------------------------------------------------------------
   Intersection Observer — scroll reveal (staggered)
---------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Observe all .reveal elements with staggered delay for grid children
document.querySelectorAll('.reveal').forEach((el, i) => {
  // Delay grid children by their index within their parent
  const parent = el.parentElement;
  if (parent && (parent.classList.contains('services-grid') ||
    parent.classList.contains('stats-grid') ||
    parent.classList.contains('team-grid'))) {
    const siblings = Array.from(parent.querySelectorAll('.reveal'));
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${idx * 0.1}s`;
  }
  revealObserver.observe(el);
});

/* ----------------------------------------------------------------
   Stats — animated count-up using requestAnimationFrame
---------------------------------------------------------------- */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimal = parseInt(el.dataset.decimal || '0');
  const duration = 1800; // ms
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = easeOutExpo(progress);
    const value = eased * target;

    el.textContent = (decimal > 0 ? value.toFixed(decimal) : Math.floor(value)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = (decimal > 0 ? target.toFixed(decimal) : target) + suffix;
    }
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

/* ----------------------------------------------------------------
   Team cards — keyboard flip support (Enter / Space)
---------------------------------------------------------------- */
document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
      const back = card.querySelector('.team-back');
      back.setAttribute('aria-hidden', String(!card.classList.contains('flipped')));
    }
  });
});

/* ----------------------------------------------------------------
   Testimonials Carousel — auto-play, dot indicators, swipe
---------------------------------------------------------------- */
(function initCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let current = 0;
  let autoTimer = null;
  const DELAY = 4400;

  function goTo(index) {
    // Deactivate current
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    // Activate new
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    slides[current].removeAttribute('aria-hidden');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, DELAY);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index)); startAuto(); });
  });

  // Swipe support
  let touchStartX = 0;
  const slidesContainer = document.getElementById('testimonial-slides');

  slidesContainer.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slidesContainer.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      startAuto();
    }
  }, { passive: true });

  // Pause on hover
  const carousel = document.querySelector('.testimonials-carousel');
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  startAuto();
})();

/* ----------------------------------------------------------------
   Booking Form — validation + success animation
---------------------------------------------------------------- */
(function initForm() {
  const form = document.getElementById('appointment-form');
  const successBox = document.getElementById('form-success');
  const resetBtn = document.getElementById('reset-form-btn');

  // Set min date to today
  const dateField = document.getElementById('field-date');
  const today = new Date().toISOString().split('T')[0];
  dateField.setAttribute('min', today);

  function showError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.add('error');
    error.classList.add('visible');
    field.setAttribute('aria-invalid', 'true');
    // Remove error on input
    field.addEventListener('input', () => {
      field.classList.remove('error');
      error.classList.remove('visible');
      field.removeAttribute('aria-invalid');
    }, { once: true });
  }

  function validate() {
    let valid = true;

    const name = document.getElementById('field-name').value.trim();
    const phone = document.getElementById('field-phone').value.trim();
    const email = document.getElementById('field-email').value.trim();
    const svc = document.getElementById('field-service').value;
    const date = document.getElementById('field-date').value;

    if (!name || name.length < 2) {
      showError('field-name', 'name-error');
      valid = false;
    }

    if (!phone || phone.replace(/\D/g, '').length < 7) {
      showError('field-phone', 'phone-error');
      valid = false;
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRx.test(email)) {
      showError('field-email', 'email-error');
      valid = false;
    }

    if (!svc) {
      showError('field-service', 'service-error');
      valid = false;
    }

    if (!date || date < today) {
      showError('field-date', 'date-error');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validate()) return;

    // Show success
    successBox.classList.add('show');

    // Trigger checkmark animation
    const circle = successBox.querySelector('.checkmark-circle');
    const check = successBox.querySelector('.checkmark-check');
    const wrap = successBox.querySelector('.checkmark-svg');
    wrap.classList.add('checkmark-animate');

    // Scroll to success
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    successBox.classList.remove('show');
    document.querySelector('.checkmark-svg').classList.remove('checkmark-animate');
  });

  // Add ripple to submit button
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.addEventListener('click', addRipple);
})();

/* ----------------------------------------------------------------
   Smooth anchor scroll (enhance default behaviour)
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ----------------------------------------------------------------
   Screen-reader only utility class
---------------------------------------------------------------- */
const srStyle = document.createElement('style');
srStyle.textContent = `.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`;
document.head.appendChild(srStyle);

/* ----------------------------------------------------------------
   Performance: use will-change hints for animated elements
---------------------------------------------------------------- */
document.querySelectorAll('.hero-tooth-wrap, .float-badge, .hero-visual-bg').forEach(el => {
  el.style.willChange = 'transform';
});

