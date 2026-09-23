/* =====================================================
   AHAVA v3 — Vanilla JS (premium interactions)
   ===================================================== */

(function () {
  'use strict';

  // ============================================================
  // SCROLL PROGRESS BAR
  // ============================================================

  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ============================================================
  // HEADER SCROLL
  // ============================================================

  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ============================================================
  // MAGNETIC BUTTONS (sutil follow del mouse)
  // ============================================================

  const magneticEls = document.querySelectorAll('[data-magnetic]');
  magneticEls.forEach(el => {
    let rafId = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let isHovering = false;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Only attract when close to element center (within radius)
      const dist = Math.sqrt(x * x + y * y);
      const maxDist = Math.max(rect.width, rect.height) * 0.6;
      if (dist > maxDist) return;
      const power = 0.25;
      tx = x * power;
      ty = y * power;
      isHovering = true;
      if (!rafId) tick();
    }

    function onLeave() {
      tx = 0; ty = 0;
      isHovering = false;
    }

    function tick() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 || isHovering) {
        rafId = requestAnimationFrame(tick);
      } else {
        el.style.transform = '';
        rafId = null;
      }
    }

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
  });

  // ============================================================
  // HAMBURGER MENU
  // ============================================================

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================

  const headerH = () => (header ? header.offsetHeight : 84);
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - headerH() + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ============================================================
  // REVEAL ON SCROLL
  // ============================================================

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach((el) => {
      const parentClass = el.parentElement?.className || '';
      if (parentClass.includes('values-grid') ||
          parentClass.includes('services-grid') ||
          parentClass.includes('ventajas-grid') ||
          parentClass.includes('stats-grid')) {
        const idx = Array.from(el.parentElement.children).indexOf(el);
        el.dataset.delay = Math.min(idx * 80, 480);
      }
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ============================================================
  // PHONE LINK
  // ============================================================

  (function buildPhone() {
    const card = document.getElementById('phoneCard');
    if (!card) return;
    const phone = '+' + '52' + '55' + '5674' + '2536';
    card.setAttribute('href', 'tel:' + phone);
  })();

  // ============================================================
  // STAT COUNTERS
  // ============================================================

  const stats = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window && stats.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    stats.forEach(s => obs.observe(s));
  }

  function animateCount(el) {
    const raw = el.textContent.trim();
    const m = raw.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
    if (!m) return;
    const [, prefix, numStr, suffix] = m;
    const target = parseInt(numStr.replace(/,/g, ''), 10);
    const hasComma = numStr.includes(',');
    const dur = 1600;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.floor(eased * target);
      el.textContent = prefix + (hasComma ? v.toLocaleString('en-US') : v) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + (hasComma ? target.toLocaleString('en-US') : target) + suffix;
    }
    requestAnimationFrame(step);
  }

  // ============================================================
  // CONTACT FORM (visual feedback + validation)
  // ============================================================

  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formSubmit = document.getElementById('formSubmit');
  const STORAGE_KEY = 'ahava_v3_contacto_v1';

  // Live validation per field
  function validateField(field, value) {
    const name = field.dataset.field || field.querySelector('input, select, textarea')?.name;
    if (!name) return null;
    if (name === 'nombre') return value.trim().length >= 2;
    if (name === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (name === 'servicio') return value !== '';
    if (name === 'mensaje') return value.trim().length >= 10;
    return true;
  }

  form?.querySelectorAll('.field[data-field]').forEach(field => {
    const input = field.querySelector('input, select, textarea');
    if (!input) return;
    const handler = () => {
      const valid = validateField(field, input.value);
      field.classList.toggle('is-valid', !!valid);
      field.classList.toggle('is-invalid', input.value && !valid);
    };
    input.addEventListener('blur', handler);
    input.addEventListener('input', () => {
      // Reset on input, validate again after a pause
      field.classList.remove('is-invalid', 'is-valid');
      clearTimeout(field._timer);
      field._timer = setTimeout(handler, 400);
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const err = validate(data);
      if (err) {
        showStatus(err, 'error');
        return;
      }

      // Simulate async submit
      formSubmit.classList.add('is-loading');
      formSubmit.disabled = true;

      setTimeout(() => {
        try {
          const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          list.push({ ...data, ts: new Date().toISOString() });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (_) {}
        form.reset();
        form.querySelectorAll('.field').forEach(f => f.classList.remove('is-valid', 'is-invalid'));
        formSubmit.classList.remove('is-loading');
        formSubmit.disabled = false;
        showStatus('¡Gracias! Hemos recibido tu mensaje. Te contactaremos en breve.', 'success');
      }, 900);
    });
  }

  function validate(d) {
    if (!d.nombre || d.nombre.trim().length < 2) return 'Por favor escribe tu nombre completo.';
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Correo electrónico inválido.';
    if (!d.servicio) return 'Selecciona un servicio de interés.';
    if (!d.mensaje || d.mensaje.trim().length < 10) return 'Cuéntanos un poco más sobre tu proyecto (mínimo 10 caracteres).';
    return null;
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
  }

  // ============================================================
  // PARALLAX SUTIL EN FOTO NOSOTROS
  // ============================================================

  const photo = document.querySelector('.nosotros-photo img');
  if (photo) {
    let ticking = false;
    document.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const rect = photo.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const winCenter = window.innerHeight / 2;
        const offset = (center - winCenter) * 0.04;
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          photo.style.transform = `translateY(${offset.toFixed(2)}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  // ============================================================
  // DYNAMIC YEAR
  // ============================================================

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
