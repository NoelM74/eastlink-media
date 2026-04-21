/* ============================================================
   EASTLINK MEDIA — COOKIE CONSENT BANNER
   ============================================================ */

(() => {
  'use strict';

  const STORAGE_KEY = 'em-cookie-consent';

  function buildBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
      <p class="cookie-banner__text">
        We use essential cookies to make this site work. We don't use tracking or advertising cookies.
        By clicking <strong>Accept All</strong> you also consent to third-party CDN services (Google Fonts,
        Font Awesome) processing your IP address to serve assets. Read our
        <a href="/privacy-policy.html">Privacy Policy</a> for details.
      </p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--essential" id="cookieBtnEssential">Essential Only</button>
        <button class="cookie-banner__btn cookie-banner__btn--accept" id="cookieBtnAccept">Accept All</button>
      </div>
    `;
    return banner;
  }

  function dismiss(banner, choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    banner.classList.remove('is-visible');
    setTimeout(() => banner.remove(), 500);
  }

  function init() {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const banner = buildBanner();
    document.body.appendChild(banner);

    // Slight delay so the slide-up animation is visible
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.classList.add('is-visible');
      });
    });

    document.getElementById('cookieBtnAccept').addEventListener('click', () => {
      dismiss(banner, 'all');
    });

    document.getElementById('cookieBtnEssential').addEventListener('click', () => {
      dismiss(banner, 'essential');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
