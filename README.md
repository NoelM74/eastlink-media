# Eastlink Media — Website Project

The website for **Eastlink Media**, founded by Noel Murphy. Eastlink builds websites that are written to sell and built to rank on Google and in AI answers (SEO and GEO), plus logo and brand design and branded merch ordered factory-direct.

Static HTML, CSS and JavaScript, served by a Cloudflare Worker (`src/worker.js`) that also handles the contact form.

> Note: `zh/index.html` (Mandarin homepage) still uses the old design and the old agency positioning, and needs rebuilding to match.

---

## Pages

| File | Language | Design | Description |
|------|----------|--------|-------------|
| `index.html` | English | New (`site.css`) | Homepage: hero, case studies, latest launches and videos, packages with £/€/$ prices, SEO & GEO summary, merch, process, guarantee, founder letter, client quotes, contact form |
| `seo-geo-authority.html` | English | New (`site.css`) | SEO & GEO: real results, SEO vs GEO explainer, what each package includes, Grow timeline, guarantee, FAQ, contact form |
| `zh/seo-geo-authority.html` | 中文 | New (`site.css`) | Mandarin version of the SEO & GEO page, written for Chinese exporters |
| `zh/index.html` | 中文 | Old (`style.css`) | Mandarin homepage, to be rebuilt |
| `privacy-policy.html`, `terms-of-service.html` | English | Old (`style.css` + `legal.css`) | Legal pages |

All proof on the site is real client results (China Fulfillment, Tech Aluminum, Eriu Sourcing, PFC Express). Don't add figures that can't be checked.

## Features (new design)

- Light "Gold, Daylight" design: Fraunces headlines, Hanken Grotesk body, DM Mono labels and prices; Noto Serif SC / Noto Sans SC for Chinese
- Built for phones first, no horizontal scroll at 390px
- Motion: hero underline sweep, brand-stage animation, search/AI diagram, reveal on scroll; all off under `prefers-reduced-motion`
- Currency switch (£ / € / $) that defaults from the visitor's time zone and remembers their choice
- Package buttons preselect the service in the contact form
- Contact form posts to `/api/contact`; messages in English or Chinese depending on the page language
- FAQ uses native `<details>`; FAQPage JSON-LD matches the visible answers
- Launch videos: 720p MP4 with WebM fallback, nothing loads until play

---

## File Structure

```
index.html                     ← English homepage
seo-geo-authority.html         ← English SEO & GEO page
privacy-policy.html, terms-of-service.html
css/
  site.css                     ← New design system (both English pages + zh SEO page)
  style.css, theme.css         ← Old design, still used by zh/index.html and legal pages
  legal.css                    ← Legal page styles
js/
  site.js                      ← New pages: nav, reveals, currency switch, contact form
  main.js                      ← Old pages
  cookie-consent.js            ← Cookie banner (all pages)
images/
  work-*.jpg                   ← Case study screenshots
  build-*.jpg                  ← Latest launches screenshots
  *-promo-poster.jpg           ← Video poster frames
  noel-murphy.jpg
videos/                        ← Launch videos (MP4 + WebM)
zh/
  index.html                   ← Mandarin homepage (old design)
  seo-geo-authority.html       ← Mandarin SEO & GEO page (new design)
  css/zh-style.css, js/zh-main.js  ← Old zh homepage only
src/worker.js                  ← Contact form handler (Resend)
```

---

## Quick Customisation

| What | Where |
|------|-------|
| Colours & fonts | `css/site.css` → `:root` tokens; Chinese font rules at the end of the file |
| Package prices | `.price` elements (`data-gbp`, `data-eur`, `data-usd`) in `index.html`, `seo-geo-authority.html` and `zh/seo-geo-authority.html`, plus the JSON-LD offers on each page |
| Company email | Footer and contact `mailto:` links on every page |
| Contact form | `js/site.js` posts to `/api/contact`, handled in `src/worker.js` (`RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL`) |
| Case study screenshots | `images/work-*.jpg` |

---

## Deployment

Pushes to the repository deploy through Cloudflare Workers (`wrangler.jsonc`). No build step: static files plus the Worker.

---

## Next Steps

1. Rebuild `zh/index.html` on the new design and positioning
2. Move the legal pages onto `site.css`
3. Add analytics (with consent) to measure enquiries per page
4. Confirm merch MOQs and lead times, then show them on the homepage

---

*Last updated: October 2026*
