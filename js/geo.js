/* ============================================================
   EASTLINK MEDIA — GEO PAGE SPECIFIC JS
   js/geo.js
   ============================================================ */
(function () {
  'use strict';

  /* ---- FAQ Accordion ------------------------------------ */
  function initFAQ() {
    document.querySelectorAll('.geo-faq__q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item    = btn.closest('.geo-faq__item');
        var answer  = item.querySelector('.geo-faq__a');
        var isOpen  = btn.getAttribute('aria-expanded') === 'true';

        /* Close all others */
        document.querySelectorAll('.geo-faq__item').forEach(function (el) {
          el.querySelector('.geo-faq__q').setAttribute('aria-expanded', 'false');
          el.querySelector('.geo-faq__a').classList.remove('is-open');
        });

        /* Toggle clicked */
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          answer.classList.add('is-open');
        }
      });
    });
  }

  /* ---- Smooth scroll for in-page anchor buttons --------- */
  function initSmoothScroll() {
    document.querySelectorAll('.geo-scroll-btn, a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---- Number count-up (reuse data-count pattern) ------- */
  function initCountUp() {
    var els = document.querySelectorAll('.geo-metric__value[data-count], .geo-stat-card__num[data-count]');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el      = entry.target;
        var target  = parseFloat(el.dataset.count);
        var suffix  = el.dataset.suffix || '';
        var prefix  = el.dataset.prefix || '';
        var dec     = target % 1 !== 0 ? 1 : 0;
        var start   = 0;
        var dur     = 1800;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / dur, 1);
          var ease = 1 - Math.pow(1 - progress, 3);
          var val = start + (target - start) * ease;
          el.textContent = prefix + val.toFixed(dec) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Reveal on scroll (re-use index.html pattern) ----- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal-up');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el    = entry.target;
          var delay = parseFloat(el.dataset.delay || 0);
          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay * 1000);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Platform badge hover glow effect ----------------- */
  function initPlatformGlow() {
    document.querySelectorAll('.geo-platform').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        el.style.boxShadow = '0 0 16px rgba(124,95,245,0.35)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.boxShadow = '';
      });
    });
  }

  /* ---- Parallax hero orbs ------------------------------- */
  function initOrbParallax() {
    var orb1 = document.querySelector('.geo-hero__orb--1');
    var orb2 = document.querySelector('.geo-hero__orb--2');
    if (!orb1 || !orb2) return;

    window.addEventListener('mousemove', function (e) {
      var xRatio = (e.clientX / window.innerWidth  - 0.5) * 2;
      var yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
      orb1.style.transform = 'translate(' + (xRatio * -18) + 'px,' + (yRatio * -12) + 'px)';
      orb2.style.transform = 'translate(' + (xRatio *  14) + 'px,' + (yRatio *  10) + 'px)';
    });
  }

  /* ---- Init -------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initFAQ();
    initSmoothScroll();
    initCountUp();
    initReveal();
    initPlatformGlow();
    initOrbParallax();
  });

})();
