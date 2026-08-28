(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      if (header) header.classList.toggle('is-menu', open);
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      if (header) header.classList.remove('is-menu');
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Reveal-on-scroll
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  // Count-up metrics
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1000;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: .6 });
    counters.forEach(el => counterObserver.observe(el));
  }

  // Cinematic multi-video backgrounds: preload the next clip and crossfade between layers.
  document.querySelectorAll('.video-rotator').forEach(root => {
    const sources = (root.dataset.sources || '').split('|').map(s => s.trim()).filter(Boolean);
    const layers = Array.from(root.querySelectorAll('.bg-video-layer'));
    if (sources.length < 2 || layers.length < 2) return;

    let sourceIndex = 0;
    let activeLayer = 0;
    const prepare = (layer, src) => {
      layer.src = src;
      layer.load();
      const play = () => layer.play().catch(() => {});
      if (layer.readyState >= 3) play(); else layer.addEventListener('canplay', play, { once: true });
    };

    prepare(layers[0], sources[0]);
    prepare(layers[1], sources[1 % sources.length]);

    const rotate = () => {
      const nextIndex = (sourceIndex + 1) % sources.length;
      const nextLayer = activeLayer === 0 ? 1 : 0;
      const next = layers[nextLayer];
      next.pause();
      next.classList.remove('is-active');
      next.src = sources[nextIndex];
      next.load();
      const show = () => {
        next.play().catch(() => {});
        requestAnimationFrame(() => next.classList.add('is-active'));
        layers[activeLayer].classList.remove('is-active');
        layers[activeLayer].pause();
        activeLayer = nextLayer;
        sourceIndex = nextIndex;
      };
      if (next.readyState >= 3) show(); else next.addEventListener('canplay', show, { once: true });
    };

    const interval = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 18000 : 9000;
    const timer = setInterval(rotate, interval);
    root.addEventListener('mouseenter', () => layers[activeLayer].play().catch(() => {}));
    window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
  });

  // Set minimum booking date to today, using local date.
  const bookingDate = document.getElementById('b-date');
  if (bookingDate) {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    bookingDate.min = localDate;
  }

  // Form handler for Formspree endpoint.
  function wireForm(formId, alertId, sendingText, defaultText, successText) {
    const form = document.getElementById(formId);
    const alertEl = document.getElementById(alertId);
    if (!form || !alertEl) return;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const button = form.querySelector('.form-submit');
      if (button) { button.disabled = true; button.textContent = sendingText; }
      alertEl.className = 'alert';
      alertEl.textContent = '';
      alertEl.style.display = 'none';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        let result = {};
        try { result = await response.json(); } catch (_) {}
        if (response.ok) {
          form.reset();
          alertEl.className = 'alert success';
          alertEl.textContent = successText;
        } else {
          throw new Error(result.error || 'We could not process the request.');
        }
      } catch (error) {
        alertEl.className = 'alert error';
        alertEl.textContent = error.message || 'Connection failed. Please try again or email us directly.';
      } finally {
        alertEl.style.display = 'block';
        if (button) { button.disabled = false; button.textContent = defaultText; }
        alertEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  wireForm(
    'contact-form', 'contact-alert',
    'Sending…', 'Send Message',
    'Message sent successfully. We will get back to you soon.'
  );
  wireForm(
    'booking-form', 'booking-alert',
    'Submitting…', 'Submit Meeting Request',
    'Meeting request received. We will confirm your meeting within one business day.'
  );

  // Carry an Insights topic into the general enquiry form when supplied.
  const topicParam = new URLSearchParams(window.location.search).get('topic');
  const serviceField = document.getElementById('c-service');
  const messageField = document.getElementById('c-message');
  if (topicParam && messageField) {
    messageField.value = 'I would like to discuss: ' + topicParam + '.\n\n';
    if (serviceField && topicParam.toLowerCase().includes('freight')) serviceField.value = 'Freight Logistics';
    if (serviceField && topicParam.toLowerCase().includes('shipping')) serviceField.value = 'Freight Logistics';
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // Prevent external placeholder links from jumping.
  document.querySelectorAll('[data-placeholder-link]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
  });
})();
