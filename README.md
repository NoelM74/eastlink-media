# Eastlink Media — Website Project

A modern, motion-forward agency website for **Eastlink Media** — a creative-media and ecommerce-growth agency specialising in **SEO, GEO (Generative Engine Optimisation), affiliate marketing, performance advertising, brand & creative, and digital development**.

---

## ✅ Completed Features

### Pages
| File | Language | Description |
|------|----------|-------------|
| `index.html` | English | Homepage (dark/light toggle, full sections) |
| `seo-geo-authority.html` | English | Full SEO & GEO Authority System service page |
| `zh/index.html` | 中文 | Full Mandarin Chinese homepage — native copywriting |
| `zh/seo-geo-authority.html` | 中文 | Full Mandarin GEO Authority System service page |

### Functional Navigation Links
- English homepage → SEO & GEO Authority page: **nav "SEO & GEO ✦"** + **featured card CTA**
- Mandarin homepage → Mandarin GEO page: **nav "SEO & GEO ✦"** + **featured card CTA** + **footer**
- GEO pages → respective homepage contact section: all CTAs
- Language switcher: EN ↔ 中文 on all four pages (cross-linked)

### Homepage Sections (both language versions)
- **Preloader** — branded "E" glyph + progress bar
- **Navigation** — sticky, dark/light toggle, language switcher, mobile full-screen menu
- **Hero** — full-viewport with parallax blobs, social rail, scroll indicator
- **Ticker** — infinite scrolling service-area marquee
- **Services** — 6-card grid (6-column CSS grid, no orphan gaps)
  - **Card 01 (SEO & GEO): full-width featured** with China Fulfillment proof (32→88/100)
  - Cards 02–04 each span 2 of 6 cols; Cards 05–06 each span 3 of 6 cols (fills last row evenly)
  - CTA link on featured card → dedicated GEO service page
- **Numbers** — animated count-up stats (127 brands, 48 programmes, £9.2M revenue, 340% ROAS)
- **Selected Work** — portfolio grid, China Fulfillment featured full-width (first position)
  - 7 project cards total with real images + animated 32→88 score overlay
- **Clients ticker** — infinite name scroll incl. China Fulfillment
- **About** — SEO/GEO-led intro copy, skills matrix, two-column layout
- **Process** — 4-step layout
- **Testimonials** — 3 cards
- **Contact** — split layout with validated form
- **Footer** — full nav columns incl. GEO page link, back-to-top, legal

### SEO & GEO Authority Service Page (English & Mandarin)
- **Hero** — cinematic AI-network background image, animated orbs, AI platform citation badges
- **Problem Statement** — 3 stat cards (60% zero-click, –37% CTR, 3× purchase intent)
- **GEO Explainer** — 4 pillars with AI ecosystem visual
- **Phase 01 Audit** — 8-item deliverables list, 32→88 score overlay on dashboard image
- **Phase 02 Build** — 6-item deliverables list, build-badge checklist
- **Case Study** — China Fulfillment: full challenge, approach, results (score, LCP, 60+ queries)
- **Comparison Table** — 8-row Eastlink Media vs. typical SEO agency
- **Who It's For** — yes/no card pair
- **Process Timeline** — 6 steps with week/month labels
- **FAQ** — 6 accordions with JS-powered expand/collapse
- **CTA** — free 30-min readiness call with trust signals
- **Schema.org Service** structured data (SEO + GEO service entities)

### Custom-generated Images
```
images/
  geo-hero-bg.jpg         ← AI neural-network hero background
  geo-ai-ecosystem.jpg    ← Brand-citation ecosystem diagram
  geo-audit-dashboard.jpg ← Before/after audit score UI mockup
  geo-audit-build.jpg     ← Two-phase process illustration
  work-chinafulfillment.jpg
  work-novaskin.jpg
  work-pulsegear.jpg
  work-arbor.jpg
  work-verdant.jpg
  work-crestwell.jpg
  work-luminos.jpg
```

### Interactivity
- Magnetic custom cursor (desktop)
- Scroll-reveal via IntersectionObserver (`reveal-up` class)
- Count-up numbers on viewport entry
- Scroll-parallax hero blobs
- 3D tilt on work cards
- Active nav-link tracking
- Dark / Light theme toggle (persisted in `localStorage`)
- EN ↔ 中文 language switcher
- FAQ accordion (GEO pages) with smooth expand/collapse
- Smooth-scroll for `geo-scroll-btn` anchor link

---

## 🗺️ File Structure

```
index.html                     ← English homepage
seo-geo-authority.html         ← English GEO service page
css/
  style.css                    ← Main design system & styles
  theme.css                    ← Dark / Light theme variables
  geo.css                      ← GEO service page styles
js/
  main.js                      ← All interactive JS
  geo.js                       ← GEO page FAQ + scroll behaviour
images/                        ← Portfolio & GEO images
zh/
  index.html                   ← Mandarin Chinese homepage
  seo-geo-authority.html       ← Mandarin GEO service page
  css/
    zh-style.css               ← Chinese typography & logo overrides
    zh-geo.css                 ← Chinese GEO page typography overrides
  js/
    zh-main.js                 ← Chinese JS (form labels, theme labels)
```

---

## 🔧 Quick Customisation

| What | Where |
|------|-------|
| Accent colour | `css/style.css` → `--c-accent: #7c5ff5` |
| Company email | All pages → footer `mailto:` links |
| Contact form endpoint | `js/main.js` → `ContactForm.handle()` — wire to Formspree/EmailJS |
| Portfolio images | Replace `images/work-*.jpg` with real screenshots |
| GEO page hero image | Replace `images/geo-hero-bg.jpg` |
| SEO/GEO score data | Service card: both `index.html` & `zh/index.html` line ~207; GEO pages: Phase 01 score overlay |

---

## 🚀 Deployment

Go to the **Publish tab** to deploy with one click. No build step required — 100% static files.

---

## 📋 Recommended Next Steps

1. Wire the contact form to **Formspree** or **EmailJS**
2. Replace placeholder portfolio images with real client screenshots
3. Add Google Tag Manager / Analytics snippet to all four pages
4. Add WeChat / Weibo links in `zh/index.html` footer (currently Twitter/LinkedIn)
5. Expand FAQ on GEO pages with more client-specific questions
6. Add a blog/content section for ongoing SEO compounding
7. Add `hreflang` tags linking EN↔ZH pages for international SEO

---

*Last updated: March 2026*
