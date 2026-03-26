/* ============================================================
   EASTLINK MEDIA — 中文版 JavaScript
   zh/js/zh-main.js
   ============================================================ */

(() => {
  'use strict';

  /* ----------------------------------------------------------
     预加载 PRELOADER
  ---------------------------------------------------------- */
  const Preloader = {
    el:    document.getElementById('preloader'),
    fill:  null,
    count: null,

    init() {
      this.fill  = this.el.querySelector('.preloader__fill');
      this.count = this.el.querySelector('.preloader__count');
      this.run();
    },

    run() {
      const duration = 1800;
      const start    = performance.now();

      const step = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const value    = Math.floor(eased * 100);

        if (this.fill)  this.fill.style.width  = value + '%';
        if (this.count) this.count.textContent  = value + '%';

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          this.finish();
        }
      };
      requestAnimationFrame(step);
    },

    finish() {
      setTimeout(() => {
        this.el.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
        ScrollReveal.init();
        CountUp.init();
        HeroReveal.play();
      }, 300);
    }
  };

  /* ----------------------------------------------------------
     自定义光标 CUSTOM CURSOR
  ---------------------------------------------------------- */
  const Cursor = {
    el:   document.getElementById('cursor'),
    dot:  null,
    ring: null,
    mx: window.innerWidth / 2,
    my: window.innerHeight / 2,
    rx: window.innerWidth / 2,
    ry: window.innerHeight / 2,

    init() {
      if (!this.el) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;

      this.dot  = this.el.querySelector('.cursor__dot');
      this.ring = this.el.querySelector('.cursor__ring');

      document.addEventListener('mousemove', e => {
        this.mx = e.clientX;
        this.my = e.clientY;
      });

      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => this.el.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => this.el.classList.remove('is-hover'));
      });

      this.tick();
    },

    tick() {
      this.rx += (this.mx - this.rx) * 0.14;
      this.ry += (this.my - this.ry) * 0.14;

      if (this.dot)  this.dot.style.transform  = `translate(${this.mx}px, ${this.my}px) translate(-50%,-50%)`;
      if (this.ring) this.ring.style.transform  = `translate(${this.rx}px, ${this.ry}px) translate(-50%,-50%)`;

      requestAnimationFrame(() => this.tick());
    }
  };

  /* ----------------------------------------------------------
     导航 NAVIGATION
  ---------------------------------------------------------- */
  const Nav = {
    nav:    document.getElementById('nav'),
    burger: document.getElementById('navBurger'),
    mobile: document.getElementById('mobileMenu'),
    isOpen: false,

    init() {
      window.addEventListener('scroll', () => {
        this.nav.classList.toggle('is-scrolled', window.scrollY > 60);
      }, { passive: true });

      this.burger.addEventListener('click', () => this.toggle());

      document.querySelectorAll('[data-scroll-to]').forEach(el => {
        el.addEventListener('click', e => {
          e.preventDefault();
          const target = document.getElementById(el.dataset.scrollTo);
          if (target) {
            if (this.isOpen) this.close();
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'smooth' });
            }, this.isOpen ? 400 : 0);
          }
        });
      });
    },

    toggle() { this.isOpen ? this.close() : this.open(); },

    open() {
      this.isOpen = true;
      this.burger.classList.add('is-open');
      this.mobile.classList.add('is-open');
      document.body.classList.add('menu-open');
    },

    close() {
      this.isOpen = false;
      this.burger.classList.remove('is-open');
      this.mobile.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }
  };

  /* ----------------------------------------------------------
     滚动动画 SCROLL REVEAL
  ---------------------------------------------------------- */
  const ScrollReveal = {
    init() {
      const upEls  = document.querySelectorAll('.reveal-up');
      const lineEls = document.querySelectorAll('.reveal-line');

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      const lineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            lineObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      upEls.forEach(el  => observer.observe(el));
      lineEls.forEach(el => lineObserver.observe(el));
    }
  };

  /* ----------------------------------------------------------
     首屏动画 HERO REVEAL
  ---------------------------------------------------------- */
  const HeroReveal = {
    play() {
      const items = document.querySelectorAll('.hero .reveal-line, .hero .reveal-up');
      items.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), 100 + i * 120);
      });
    }
  };

  /* ----------------------------------------------------------
     数字滚动 COUNT-UP
  ---------------------------------------------------------- */
  const CountUp = {
    init() {
      const els = document.querySelectorAll('[data-count]');
      if (!els.length) return;

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      els.forEach(el => observer.observe(el));
    },

    animate(el) {
      const target  = parseFloat(el.dataset.count);
      const prefix  = el.dataset.prefix || '';
      const suffix  = el.dataset.suffix || '';
      const isFloat = String(target).includes('.');
      const duration = 1800;
      const start   = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = eased * target;
        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
      };
      requestAnimationFrame(step);
    }
  };

  /* ----------------------------------------------------------
     视差效果 PARALLAX
  ---------------------------------------------------------- */
  const Parallax = {
    elements: [],
    ticking: false,

    init() {
      this.elements = Array.from(document.querySelectorAll('[data-parallax]')).map(el => ({
        el,
        speed: parseFloat(el.dataset.parallax)
      }));
      if (!this.elements.length) return;

      window.addEventListener('scroll', () => {
        if (!this.ticking) {
          requestAnimationFrame(() => { this.update(); this.ticking = false; });
          this.ticking = true;
        }
      }, { passive: true });

      this.update();
    },

    update() {
      const scrollY = window.scrollY;
      this.elements.forEach(item => {
        const rect = item.el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight * 1.5) return;
        item.el.style.transform = `translateY(${(scrollY + rect.top) * item.speed}px)`;
      });
    }
  };

  /* ----------------------------------------------------------
     联系表单 CONTACT FORM (Chinese validation messages)
  ---------------------------------------------------------- */
  const ContactForm = {
    form:   document.getElementById('contactForm'),
    status: document.getElementById('formStatus'),

    init() {
      if (!this.form) return;
      this.form.addEventListener('submit', e => this.handle(e));
    },

    handle(e) {
      e.preventDefault();
      const data  = new FormData(this.form);
      const name  = data.get('name')?.trim();
      const email = data.get('email')?.trim();
      const msg   = data.get('message')?.trim();

      if (!name || !email || !msg) {
        this.setStatus('请填写所有必填项目。', 'error');
        return;
      }
      if (!this.validEmail(email)) {
        this.setStatus('请输入有效的电子邮箱地址。', 'error');
        return;
      }

      const btn = this.form.querySelector('button[type="submit"]');
      btn.textContent = '发送中…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '发送成功 ✓';
        this.setStatus('感谢您的留言！我们将在 24 小时内与您联系。', 'success');
        this.form.reset();
        setTimeout(() => {
          btn.textContent = '发送消息 →';
          btn.disabled = false;
          this.setStatus('', '');
        }, 5000);
      }, 1200);
    },

    setStatus(msg, type) {
      this.status.textContent = msg;
      this.status.className = 'form-status' + (type ? ' is-' + type : '');
    },

    validEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  };

  /* ----------------------------------------------------------
     返回顶部 BACK TO TOP
  ---------------------------------------------------------- */
  const BackToTop = {
    btn: document.getElementById('backToTop'),
    init() {
      if (!this.btn) return;
      window.addEventListener('scroll', () => {
        this.btn.classList.toggle('is-visible', window.scrollY > 600);
      }, { passive: true });
      this.btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  };

  /* ----------------------------------------------------------
     案例卡片悬停倾斜 WORK TILT
  ---------------------------------------------------------- */
  const WorkTilt = {
    init() {
      document.querySelectorAll('.work-item__media').forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width  - 0.5;
          const y = (e.clientY - rect.top)  / rect.height - 0.5;
          card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
        });
      });
    }
  };

  /* ----------------------------------------------------------
     跑马灯悬停暂停 TICKER PAUSE
  ---------------------------------------------------------- */
  const TickerPause = {
    init() {
      document.querySelectorAll('.ticker__inner, .clients__ticker-inner').forEach(t => {
        t.addEventListener('mouseenter', () => t.style.animationPlayState = 'paused');
        t.addEventListener('mouseleave', () => t.style.animationPlayState = 'running');
      });
    }
  };

  /* ----------------------------------------------------------
     主题切换 THEME TOGGLE (Chinese labels)
  ---------------------------------------------------------- */
  const ThemeToggle = {
    btn:         document.getElementById('themeToggle'),
    btnMobile:   document.getElementById('themeToggleMobile'),
    label:       document.getElementById('themeLabel'),
    labelMobile: document.getElementById('themeLabelMobile'),
    body:  document.body,
    DARK:  'theme-dark',
    LIGHT: 'theme-light',
    KEY:   'em-theme',

    init() {
      const saved = localStorage.getItem(this.KEY) || this.DARK;
      this.applyTheme(saved, false);

      if (this.btn)       this.btn.addEventListener('click',       () => this.toggle());
      if (this.btnMobile) this.btnMobile.addEventListener('click', () => this.toggle());
    },

    toggle() {
      const next = this.body.classList.contains(this.DARK) ? this.LIGHT : this.DARK;
      this.applyTheme(next, true);
    },

    applyTheme(theme, save) {
      this.body.classList.remove(this.DARK, this.LIGHT);
      this.body.classList.add(theme);
      // Chinese labels for dark/light
      const lbl = theme === this.DARK ? '深色' : '浅色';
      if (this.label)       this.label.textContent       = lbl;
      if (this.labelMobile) this.labelMobile.textContent = lbl;
      if (save) localStorage.setItem(this.KEY, theme);
    }
  };

  /* ----------------------------------------------------------
     导航高亮 NAV HIGHLIGHT
  ---------------------------------------------------------- */
  const NavHighlight = {
    sections: [],
    links: [],

    init() {
      this.sections = Array.from(document.querySelectorAll('section[id]'));
      this.links    = Array.from(document.querySelectorAll('.nav__link[data-scroll-to]'));
      if (!this.sections.length || !this.links.length) return;
      window.addEventListener('scroll', () => this.update(), { passive: true });
    },

    update() {
      const scrollMid = window.scrollY + window.innerHeight * 0.4;
      let active = null;
      this.sections.forEach(sec => { if (sec.offsetTop <= scrollMid) active = sec.id; });
      const isDark = document.body.classList.contains('theme-dark');
      this.links.forEach(link => {
        const isActive = link.dataset.scrollTo === active;
        link.style.color = isActive ? (isDark ? 'var(--c-white)' : 'var(--c-text)') : '';
      });
    }
  };

  /* ----------------------------------------------------------
     平滑滚动 SMOOTH SCROLL
  ---------------------------------------------------------- */
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
          const hash   = link.getAttribute('href');
          if (hash === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
          const target = document.querySelector(hash);
          if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
      });
    }
  };

  /* ----------------------------------------------------------
     初始化 INIT ALL
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    ThemeToggle.init();
    Preloader.init();
    Cursor.init();
    Nav.init();
    Parallax.init();
    ContactForm.init();
    BackToTop.init();
    WorkTilt.init();
    TickerPause.init();
    NavHighlight.init();
    SmoothScroll.init();
  });

})();
