/* ============================================================
   EASTLINK MEDIA — COOKIE CONSENT BANNER
   ============================================================ */

(() => {
  'use strict';

  const STORAGE_KEY = 'em-cookie-consent';

  const ZH = /^zh/i.test(document.documentElement.lang);

  const TEXT = ZH ? {
    label: 'Cookie 设置',
    body: `我们只使用让网站正常运行的必要 Cookie，不使用追踪或广告 Cookie。点击<strong>全部接受</strong>，即表示您也同意第三方 CDN 服务（Google Fonts）处理您的 IP 地址以加载字体。详情请见我们的<a href="/privacy-policy.html">隐私政策</a>（英文）。`,
    essential: '仅必要',
    accept: '全部接受',
  } : {
    label: 'Cookie consent',
    body: `We use essential cookies to make this site work. We don't use tracking or advertising cookies.
        By clicking <strong>Accept All</strong> you also consent to Google Fonts receiving your IP address
        so it can serve the site's fonts. Read our <a href="/privacy-policy.html">Privacy Policy</a> for details.`,
    essential: 'Essential Only',
    accept: 'Accept All',
  };

  function buildBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', TEXT.label);
    banner.innerHTML = `
      <p class="cookie-banner__text">${TEXT.body}</p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--essential" id="cookieBtnEssential">${TEXT.essential}</button>
        <button class="cookie-banner__btn cookie-banner__btn--accept" id="cookieBtnAccept">${TEXT.accept}</button>
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
