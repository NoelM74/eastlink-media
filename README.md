# Eastlink Media — Website Project

The website for **Eastlink Media**, founded by Noel Murphy. The site has two doors:

- **For Chinese companies selling abroad:** the **Eastlink Borderfree System** (Chinese: Eastlink 无界出海系统), five services that win overseas buyers and keep them: brand and positioning, multilingual website with SEO and GEO, LinkedIn and digital outreach, trade show strategy and follow-up, and cross-cultural sales training.
- **For brands buying from China:** the founder's sister companies in Shenzhen: China Factory Sourcing, China Fulfillment and Parcel From China (PFC Express).

Don't call the system the "Global Growth System": that name is trademarked by someone else. "Borderfree" on its own is also an existing cross-border ecommerce brand (Global-e), so always use the full name, "Eastlink Borderfree System".

Static HTML, CSS and JavaScript, served by a Cloudflare Worker (`src/worker.js`) that also handles the contact form.

---

## Pages

| File | Language | Design | Description |
|------|----------|--------|-------------|
| `index.html` | English | New (`site.css`) | Homepage, for businesses that want a website that sells: proof-led hero (China Fulfillment 4,862 → 28,430 visits a month, April to September 2026, with a before/after bar chart), results, how we build, packages with £/€/$ prices, guarantee, process, merch, founder letter, quotes, the two China doors (Borderfree System, Buy from China), free website check form |
| `borderfree-system.html` | English | New (`site.css`) | The Eastlink Borderfree System in full: where buyers drop away, each of the five services, where to start, how we work, FAQ, contact form |
| `buy-from-china.html` | English | New (`site.css`) | For brands buying from China: factory-to-customer chain, China Factory Sourcing, China Fulfillment, Parcel From China, FAQ, enquiry form |
| `seo-geo-authority.html` | English | New (`site.css`) | Websites, SEO & GEO (part 02 of the system): results, latest launches and videos, SEO vs GEO, website packages, what each includes, Grow timeline, the guarantee, FAQ, contact form |
| `zh/index.html`, `zh/borderfree-system.html`, `zh/buy-from-china.html`, `zh/seo-geo-authority.html` | 中文 | New (`site.css`) | Chinese pages, written for Chinese exporters (prices in USD). The Chinese homepage leads with the Borderfree System and the PFC proof (4.8× enquiries after the English site rebuild) |
| `privacy-policy.html`, `terms-of-service.html` | English | New (`site.css`) | Privacy policy and terms of service |

China Fulfillment and PFC Express are the founder's own companies, and the headlines say so. Keep that disclosure next to any headline that uses their numbers. All proof on the site is real client results (China Fulfillment, Tech Aluminum, Eriu Sourcing, PFC Express). Don't add figures that can't be checked. Tech Aluminum is an Egyptian smelter, so describe the case studies as "companies that sell across borders", not "Chinese companies". Facts about the sister companies (delivery times, 30+ carriers, 200+ countries, free storage) come from their own websites; update them here if those sites change. The brand logos (Triangl, Spark Paws, Scrubba) are brands China Fulfillment has shipped for, so always label them that way.

## Features (new design)

- Light "Gold, Daylight" design: Fraunces headlines, Hanken Grotesk body, DM Mono labels and prices; Noto Serif SC / Noto Sans SC for Chinese
- Fonts are self-hosted in `fonts/` (no Google Fonts requests, which are blocked in mainland China). After changing Chinese copy, run `python3 tools/build_fonts.py` so every character used is included
- Built for phones first, no horizontal scroll at 390px
- Motion: hero underline sweep, brand-stage animation, search/AI diagram, reveal on scroll; all off under `prefers-reduced-motion`
- Currency switch (£ / € / $) that defaults from the visitor's time zone and remembers their choice
- Package and service buttons preselect the service in the contact form (`data-service` must match an option in that page's form). Option values stay in English on the Chinese pages, so enquiries arrive in English
- Graphics are HTML, CSS and inline SVG: the China-to-US-and-Europe bridge with the two doors, the buyer's path, the "where buyers drop away" panel, the "writes / hears" table, and the factory-to-customer chain with a moving parcel. All motion stops under `prefers-reduced-motion`
- Contact form posts to `/api/contact`; form messages and menu labels switch to Chinese on `lang="zh-CN"` pages
- FAQ uses native `<details>`; FAQPage JSON-LD matches the visible answers
- Launch videos: 720p MP4 with WebM fallback, nothing loads until play
- No cookies and no third-party requests apart from Cloudflare Web Analytics (cookieless), so there is no cookie banner

---

## File Structure

```
index.html                     ← English homepage
borderfree-system.html         ← The Eastlink Borderfree System
buy-from-china.html            ← Sourcing, fulfilment and shipping (sister companies)
seo-geo-authority.html         ← Websites, SEO & GEO, packages and guarantee
privacy-policy.html, terms-of-service.html
css/
  site.css                     ← Design system for every page (EN, 中文, legal)
  fonts.css, fonts-zh.css      ← Generated by tools/build_fonts.py
fonts/                         ← Self-hosted font files
js/
  site.js                      ← New pages: nav, reveals, currency switch, contact form
images/
  work-*.jpg                   ← Case study screenshots
  build-*.jpg                  ← Latest launches screenshots
  *-promo-poster.jpg           ← Video poster frames
  noel-murphy.jpg
  og-en.jpg, og-zh.jpg         ← Share images for LinkedIn, WeChat, etc. (1200×630)
  brands/                      ← Triangl, Spark Paws, Scrubba logos (one colour)
videos/                        ← Launch videos (MP4 + WebM)
zh/                            ← Chinese versions of the four main pages
llms.txt                       ← Plain-text summary for AI tools (GEO); keep its facts in step with the pages
src/worker.js                  ← Contact form handler (Resend) + security headers on its responses
_headers                       ← Security headers (incl. Content-Security-Policy) and caching for static files
_redirects                     ← 301s from old .html addresses to clean URLs
.well-known/security.txt       ← Security contact; update the Expires date every year (next: Oct 2027)
tools/build_fonts.py           ← Downloads fonts and writes css/fonts*.css (not published)
```

---

## Quick Customisation

| What | Where |
|------|-------|
| Colours & fonts | `css/site.css` → `:root` tokens; Chinese font rules at the end of the file |
| Package prices | `.price` elements (`data-gbp`, `data-eur`, `data-usd`) on the English pages, USD figures on the Chinese pages, the JSON-LD offers on each page, and `llms.txt` |
| Company email | Footer and contact `mailto:` links on every page |
| Contact form | `js/site.js` posts to `/api/contact`, handled in `src/worker.js` (`RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL`) |
| Case study screenshots | `images/work-*.jpg` |

---

## Deployment

Pushes to the repository deploy through Cloudflare Workers (`wrangler.jsonc`). No build step: static files plus the Worker.

## Security

- `_headers` sets HSTS, a strict Content-Security-Policy, and frame, MIME-sniffing, referrer and permissions headers. The CSP only allows files from this domain plus the hash of the one inline script (`document.documentElement.classList.add('js');`) and Cloudflare Web Analytics (`static.cloudflareinsights.com`, `cloudflareinsights.com`), which Cloudflare adds to every page. Adding other analytics, a chat widget or any embed means adding its domain to the CSP, or the browser will block it.
- The contact form API only accepts JSON POSTs from the site's own pages, has a hidden spam-trap field (`company`), caps field lengths, escapes everything it puts in the email, and allows each visitor 5 messages a minute (`CONTACT_LIMITER` in `wrangler.jsonc`).
- `.assetsignore` keeps the Worker code, config, README and tools off the public site.

---

## Next Steps

1. Add WeChat (ID or QR code) to the Chinese pages' contact sections
2. Add real photos (trade shows, factory visits, team, office) and team and office details
3. Add Importing to China once its description is confirmed (importingtochina.com had an expired SSL certificate on 13 October 2026)
4. Have a solicitor review the privacy policy and terms, including passing enquiries to the sister companies in China, and check the "Eastlink Borderfree System" name before registering it
5. Add Chinese versions of the legal pages
6. Track enquiries per page (Cloudflare Web Analytics already counts visits; any new tool must be allowed in the CSP)

---

*Last updated: October 2026*
