/* ============================================================
   EASTLINK MEDIA — HOMEPAGE SCRIPT
   Nav, reveal on scroll, the brand stage, currency switch, contact form.
   ============================================================ */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: stuck state, mobile menu, active link ---------- */
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');

  const setStuck = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
  setStuck();
  window.addEventListener('scroll', setStuck, { passive: true });

  const closeMenu = () => {
    menu.hidden = true;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  };
  burger.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); burger.focus(); } });

  const navLinks = Array.from(document.querySelectorAll('.nav__links a'));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => {
        if (a.getAttribute('aria-current') === 'page') return;
        a.setAttribute('aria-current', String(a.hash === '#' + entry.target.id));
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => {
    if (!a.hash || a.pathname !== location.pathname) return; // links to other pages
    const s = document.querySelector(a.hash);
    if (s) spy.observe(s);
  });

  /* ---------- Reveal on scroll, staggered within each group ---------- */
  const reveals = document.querySelectorAll('.rv');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const seen = new IntersectionObserver(entries => {
      let i = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty('--d', (i++ * 0.07) + 's');
        entry.target.classList.add('in');
        seen.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => seen.observe(el));
  }

  // Gold underline under the hero headline
  const sweep = document.querySelector('.sweep');
  if (sweep) requestAnimationFrame(() => sweep.classList.add('in'));

  /* ---------- The brand stage: the mark settles onto each product in turn ---------- */
  const stage = document.getElementById('stage');
  if (stage) {
    const tiles = Array.from(stage.querySelectorAll('.tile'));
    let step = 0, timer = null;
    const tick = () => {
      tiles.forEach((t, k) => {
        t.classList.remove('on');
        if (k === step % tiles.length) { void t.offsetWidth; t.classList.add('on'); }
      });
      step++;
    };
    if (reduceMotion) {
      tiles.forEach(t => t.classList.add('on'));
    } else {
      // only run while the stage is on screen
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !timer) { tick(); timer = setInterval(tick, 1400); }
        else if (!entry.isIntersecting && timer) { clearInterval(timer); timer = null; }
      }).observe(stage);
    }
  }

  /* ---------- Currency switch ---------- */
  const KEY = 'em-currency';
  const curButtons = document.querySelectorAll('[data-cur]');
  const prices = document.querySelectorAll('.price[data-eur]');

  const setCurrency = (cur, animate) => {
    curButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cur === cur)));
    prices.forEach(p => {
      const next = p.dataset[cur];
      if (!next || p.textContent === next) return;
      if (!animate || reduceMotion) { p.textContent = next; return; }
      p.classList.add('swap');
      setTimeout(() => { p.textContent = next; p.classList.remove('swap'); }, 200);
    });
  };

  const guessCurrency = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (/^Europe\/(London|Belfast|Guernsey|Isle_of_Man|Jersey)$/.test(tz)) return 'gbp';
      if (tz.startsWith('Europe/')) return 'eur';
      if (tz.startsWith('America/') || tz.startsWith('Asia/') || tz.startsWith('Australia/')) return 'usd';
    } catch (e) { /* fall through */ }
    return 'eur';
  };

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  setCurrency(['gbp', 'eur', 'usd'].includes(saved) ? saved : guessCurrency(), false);

  curButtons.forEach(b => b.addEventListener('click', () => {
    setCurrency(b.dataset.cur, true);
    try { localStorage.setItem(KEY, b.dataset.cur); } catch (e) { /* storage blocked */ }
  }));

  /* ---------- Buttons that pick a service in the form ---------- */
  const serviceSelect = document.getElementById('fservice');
  document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => {
    if (serviceSelect) serviceSelect.value = a.dataset.service;
  }));

  /* ---------- Contact form ---------- */
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.innerHTML;
    const say = (msg, type) => {
      status.textContent = msg;
      status.className = 'form__status' + (type ? ' is-' + type : '');
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data    = new FormData(form);
      const name    = (data.get('name') || '').trim();
      const email   = (data.get('email') || '').trim();
      const service = (data.get('service') || '').trim();
      const website = (data.get('website') || '').trim();
      let message   = (data.get('message') || '').trim();

      if (!name || !email || !message) { say('Please add your name, email and a few words about your business.', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { say('That email address doesn\'t look right. Please check it.', 'error'); return; }
      if (website) message = 'Website: ' + website + '\n\n' + message;

      btn.disabled = true;
      btn.textContent = 'Sending…';
      say('', '');

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, service, message }),
        });
        const result = await res.json().catch(() => ({}));
        if (res.ok && result.success) {
          form.reset();
          say('Thanks, ' + name.split(' ')[0] + '. We\'ll reply within one working day.', 'success');
        } else {
          say(result.error || 'That didn\'t send. Please try again, or email hello@eastlinkmedia.com.', 'error');
        }
      } catch {
        say('No connection. Check your internet and try again, or email hello@eastlinkmedia.com.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = label;
      }
    });
  }
})();
