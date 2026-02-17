# Dipsticks Engineering Website — Modernization Plan

## Executive Summary

Complete rebuild of dipsticksengineering.co.uk from a legacy Bootstrap 3 / jQuery static site into a modern, performant, accessible, and SEO-optimized website. Hosted on Netlify with a proper build pipeline.

---

## Current State Assessment

| Area | Score | Key Issues |
|------|-------|------------|
| **Performance** | 3/10 | 1.3MB+ page weight, render-blocking assets, no image optimization |
| **SEO** | 3/10 | No Open Graph, no canonical tags, deprecated structured data, HTTP sitemap |
| **Accessibility** | 3/10 | `user-scalable=no`, 12 ARIA attrs across 3,315 lines, no skip links |
| **Code Quality** | 3/10 | 200KB+ unused JS, broken mailto links, inconsistent URL casing |
| **UI/UX** | 4/10 | Dated Bootstrap 3 design, no modern interactions, weak mobile experience |
| **Security** | 6/10 | reCAPTCHA v2 (should be v3), no security headers, HTTP references |

### Critical Bugs in Current Site
- Malformed `mailto://` links on every page (should be `mailto:`)
- Broken internal links: `About.html` vs `about.html`, `Contact.aspx` references
- Duplicate conflicting viewport meta tags
- Copyright hardcoded to 2020
- 131KB `holder.js` (dev-only library) shipped to production
- 80KB+ SyntaxHighlighter library loaded but never used
- CSS source map (271KB) deployed to production

---

## 1. Technical Architecture

### Recommended Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | **Astro** | Zero JS by default, component-based, built-in image optimization, perfect for content/marketing sites, first-class Netlify support |
| **Styling** | **Tailwind CSS v4** | Utility-first, tiny production CSS (~10KB), excellent responsive system, no unused styles shipped |
| **Interactivity** | **Vanilla JS + Astro Islands** | Minimal JS footprint, progressive enhancement, no jQuery dependency |
| **Carousel** | **Swiper.js** (or CSS-only) | Modern, lightweight, touch-friendly, accessible |
| **Image format** | **AVIF/WebP with fallback** | 50-80% size reduction via Astro's `<Image>` component |
| **Icons** | **Astro Icon** (Iconify) | SVG icons, tree-shaken, no font files needed |
| **Forms** | **Netlify Forms** | Already partially integrated, add Netlify-native spam filtering |
| **Analytics** | **Google Tag Manager** (keep) | Retain existing GTM container |
| **Fonts** | **Self-hosted WOFF2 only** | 2-3 font weights max, `font-display: swap` |
| **Build** | **Astro build + Netlify** | Static output, automatic deployment on git push |

### Project Structure

```
/
├── astro.config.mjs              # Astro + Netlify adapter config
├── tailwind.config.mjs           # Tailwind theme (brand colors, fonts)
├── package.json
├── public/
│   ├── fonts/                    # Self-hosted WOFF2 files
│   ├── downloads/                # PDF guides (unchanged)
│   ├── favicon.svg               # Modern SVG favicon
│   ├── robots.txt                # Generated or static
│   └── _redirects                # Netlify redirects (old URLs → new)
├── src/
│   ├── assets/
│   │   └── images/               # Source images (Astro optimizes these)
│   ├── components/
│   │   ├── Header.astro          # Site header with responsive nav
│   │   ├── Footer.astro          # Site footer
│   │   ├── Navigation.astro      # Mobile + desktop nav
│   │   ├── Hero.astro            # Hero section component
│   │   ├── ProductCard.astro     # Reusable product card
│   │   ├── Carousel.astro        # Image carousel (Swiper or CSS)
│   │   ├── ContactForm.astro     # Netlify-powered form
│   │   ├── FAQ.astro             # Collapsible FAQ item
│   │   ├── TankTypeCard.astro    # Tank type showcase card
│   │   ├── Breadcrumbs.astro     # SEO breadcrumbs
│   │   ├── CookieConsent.astro   # GDPR cookie banner
│   │   └── SEO.astro             # Meta tags, OG, JSON-LD component
│   ├── layouts/
│   │   └── BaseLayout.astro      # Shared layout (head, nav, footer)
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── about.astro           # About Us
│   │   ├── contact.astro         # Contact form
│   │   ├── faqs.astro            # FAQs (with schema markup)
│   │   ├── 404.astro             # Custom 404
│   │   └── products/
│   │       ├── dipsticks.astro
│   │       ├── dip-tapes.astro
│   │       └── calibration-charts.astro
│   │   └── guides/
│   │       ├── how-to-use-a-dipstick.astro
│   │       └── dipstick-rubbing-guide.astro
│   ├── content/                  # Content collections (optional)
│   │   └── config.ts
│   └── styles/
│       └── global.css            # Tailwind directives + custom base styles
├── netlify.toml                  # Build settings, headers, redirects
└── .gitignore
```

### Build Pipeline

```
Source (Astro components + Tailwind)
  → Astro build (static HTML generation)
  → Image optimization (AVIF/WebP via Sharp)
  → CSS purge (Tailwind removes unused utilities)
  → HTML minification
  → Output: dist/ (~200KB estimated vs current ~7.5MB)
  → Netlify deploy (auto on git push)
```

### Performance Targets

| Metric | Current (est.) | Target |
|--------|---------------|--------|
| **Total page weight** | 1.3MB+ | < 200KB |
| **JavaScript** | 434KB+ | < 20KB |
| **CSS** | 500KB | < 15KB |
| **Largest image** | 907KB | < 100KB (AVIF) |
| **Lighthouse Performance** | ~40 | 95+ |
| **Lighthouse Accessibility** | ~60 | 95+ |
| **Lighthouse SEO** | ~70 | 100 |
| **First Contentful Paint** | ~3s+ | < 1s |
| **Largest Contentful Paint** | ~5s+ | < 2s |
| **Cumulative Layout Shift** | High | < 0.1 |

---

## 2. User Interface Redesign

### Design Philosophy

The current site looks like a 2015-era Bootstrap template. The redesign should convey:
- **Trust & expertise** — 35+ years in the industry
- **Clarity** — visitors should understand what Dipsticks Engineering does in 3 seconds
- **Professionalism** — clean, modern, industrial aesthetic
- **Simplicity** — B2B buyers want information fast, not animations

### Color Palette

Replace the generic Bootstrap blue with a purposeful brand palette:

```
Primary:      #1B4965  (Deep Navy)     — Trust, professionalism, industrial
Secondary:    #CAE9FF  (Light Sky)     — Contrast, CTAs, highlights
Accent:       #F97316  (Warm Orange)   — CTAs, important actions, energy
Neutral 900:  #1A1A2E  (Near Black)    — Body text
Neutral 700:  #4A4A5A  (Dark Gray)     — Secondary text
Neutral 200:  #E8E8ED  (Light Gray)    — Backgrounds, borders
Neutral 50:   #F8F9FA  (Off White)     — Page background
White:        #FFFFFF                   — Cards, content areas
Success:      #059669  (Green)         — Positive feedback
```

### Typography

```
Headings:  Inter (700, 600)     — Clean, modern, highly legible
Body:      Inter (400, 500)     — Same family for consistency
Accent:    (none)               — Remove decorative fonts like Indie Flower
```

Single font family = one network request, fast loading, consistent look.

### Page-by-Page UI Redesign

#### Homepage
```
┌─────────────────────────────────────────────┐
│  Logo    Nav: Products | About | FAQs |     │
│          Guides | Contact    [Call CTA]      │
├─────────────────────────────────────────────┤
│                                             │
│  HERO: Full-width image of dipstick in use  │
│  "Precision Tank Measurement Since 1985"    │
│  "Dipsticks, Dip Tapes & Calibration Charts │
│   manufactured to your exact specifications" │
│  [Get a Quote]  [View Products]             │
│                                             │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Dipsticks│ │Dip Tapes │ │Calibration│   │
│  │  icon    │ │  icon    │ │  Charts   │   │
│  │  brief   │ │  brief   │ │  brief    │   │
│  │ [Learn →]│ │ [Learn →]│ │ [Learn →] │   │
│  └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────┤
│  WHY CHOOSE US                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ 35+ yrs │ │ Custom  │ │ UK Made │      │
│  │ expert. │ │ manufact│ │         │      │
│  └─────────┘ └─────────┘ └─────────┘      │
├─────────────────────────────────────────────┤
│  TANK TYPES WE SERVE                        │
│  Grid of tank type cards with images        │
│  (Rectangular, Horizontal, Vertical, etc.)  │
├─────────────────────────────────────────────┤
│  HOW IT WORKS                               │
│  1. Contact us → 2. We measure → 3. Done   │
├─────────────────────────────────────────────┤
│  TESTIMONIAL / TRUST SECTION                │
│  "Companies House: 10632644"                │
│  Client logos if available                  │
├─────────────────────────────────────────────┤
│  CTA BANNER                                 │
│  "Need a dipstick or calibration chart?"    │
│  [Contact Us]  [Call 0333 567 1654]         │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
│  Nav | Contact info | Downloads | Legal     │
└─────────────────────────────────────────────┘
```

#### Product Pages (Dipsticks, Dip Tapes, Calibration Charts)
- Hero with product image + title + short description
- Key features grid (icons + text)
- Product image gallery (lightbox, responsive)
- Specifications / details section
- "How to order" CTA
- Related products sidebar or bottom section
- FAQ section specific to this product

#### About Page
- Company story with timeline
- Key stats (35+ years, X products made, etc.)
- Team / workshop photos
- Values / quality commitment
- CTA to contact

#### Contact Page
- Clean form (Name, Email, Phone, Message, Tank Type dropdown)
- Netlify Forms with honeypot spam protection
- Google reCAPTCHA v3 (invisible)
- Map or address card
- Phone number with click-to-call
- Opening hours

#### FAQ Page
- Collapsible accordion sections
- Grouped by topic (Ordering, Products, Technical)
- JSON-LD FAQPage schema for Google rich results

#### Guide Pages
- Clean article layout
- Step-by-step with images
- Downloadable PDF versions
- Breadcrumb navigation

### Responsive Breakpoints

```
Mobile:    < 640px    (single column, hamburger nav)
Tablet:    640-1024px (2-column layouts)
Desktop:   1024px+    (full layout)
Wide:      1280px+    (max-width container)
```

### Interaction Design
- **No jQuery animations** — use CSS transitions and `@keyframes`
- **Scroll animations** — CSS `animation-timeline: scroll()` or Intersection Observer (no WOW.js)
- **Mobile nav** — CSS-only hamburger or minimal JS drawer
- **Carousels** — CSS scroll-snap or lightweight Swiper.js
- **FAQ accordion** — Native `<details>/<summary>` elements (zero JS)
- **Image lightbox** — Native `<dialog>` element + minimal JS
- **Back to top** — CSS `scroll-behavior: smooth` + small vanilla JS

---

## 3. SEO Strategy

### Technical SEO

#### Meta Tags (every page via SEO.astro component)
```html
<title>{pageTitle} | Dipsticks Engineering</title>
<meta name="description" content="{unique 150-160 char description}">
<link rel="canonical" href="https://www.dipsticksengineering.co.uk/{path}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#1B4965">

<!-- Open Graph -->
<meta property="og:title" content="{pageTitle}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{ogImage}">
<meta property="og:url" content="{canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dipsticks Engineering">
<meta property="og:locale" content="en_GB">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{pageTitle}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{ogImage}">
```

#### JSON-LD Structured Data

**Organization (every page):**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Dipsticks Engineering",
  "url": "https://www.dipsticksengineering.co.uk",
  "telephone": "+443335671654",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "The Lodge, Wood Lane",
    "addressLocality": "Hinstock",
    "addressRegion": "Shropshire",
    "postalCode": "TF9 2TA",
    "addressCountry": "GB"
  },
  "geo": { "@type": "GeoCoordinates", ... },
  "openingHoursSpecification": { ... },
  "sameAs": []
}
```

**Product pages:** `Product` schema with name, description, offers
**FAQ page:** `FAQPage` schema (enables rich snippets in Google)
**Guide pages:** `HowTo` schema (enables rich snippets)
**Breadcrumbs:** `BreadcrumbList` schema (replaces deprecated data-vocabulary.org)

#### Sitemap & Robots

**robots.txt:**
```
User-agent: *
Allow: /

Sitemap: https://www.dipsticksengineering.co.uk/sitemap-index.xml
```

**sitemap-index.xml** — auto-generated by Astro with `@astrojs/sitemap`:
- All pages with `<lastmod>` timestamps
- Proper `<changefreq>` and `<priority>` values
- HTTPS URLs

#### URL Structure

Migrate to clean, descriptive URLs with Netlify redirects for old ones:

| Old URL | New URL | Redirect |
|---------|---------|----------|
| `/dipsticks.html` | `/products/dipsticks/` | 301 |
| `/dip_tapes.html` | `/products/dip-tapes/` | 301 |
| `/calibration_charts.html` | `/products/calibration-charts/` | 301 |
| `/how_to_use_a_dipstick.html` | `/guides/how-to-use-a-dipstick/` | 301 |
| `/dipstick_rubbing_guide.html` | `/guides/dipstick-rubbing-guide/` | 301 |
| `/about.html` | `/about/` | 301 |
| `/FAQs.html` | `/faqs/` | 301 |
| `/contact.html` | `/contact/` | 301 |
| `/Contact.aspx` | `/contact/` | 301 |
| `/About.html` | `/about/` | 301 |

#### Netlify Headers (netlify.toml)
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; frame-src https://www.youtube-nocookie.com https://www.google.com; connect-src 'self' https://www.google-analytics.com"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Content SEO Improvements

1. **Unique, keyword-rich titles** for every page
2. **Meta descriptions** rewritten for click-through rate
3. **H1 → H2 → H3 hierarchy** properly structured on each page
4. **Internal linking** between related products and guides
5. **Image alt text** rewritten to be descriptive and keyword-aware
6. **Downloadable PDFs** linked with descriptive anchor text

---

## 4. Accessibility (WCAG 2.1 AA)

- Remove `user-scalable=no` (allow pinch zoom)
- Single correct viewport meta tag
- Skip-to-content link on every page
- Semantic HTML5 elements (`<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`)
- ARIA labels on interactive elements
- Keyboard-navigable dropdown menus
- Focus-visible styles for all interactive elements
- Color contrast ratio 4.5:1+ for all text
- Form labels properly associated with inputs
- Error messages announced to screen readers
- Reduced motion media query respected (`prefers-reduced-motion`)
- Alt text on all images (descriptive, not decorative)
- `lang="en-GB"` on `<html>` element

---

## 5. Netlify Configuration

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# Redirects from old URLs
[[redirects]]
  from = "/dipsticks.html"
  to = "/products/dipsticks/"
  status = 301

[[redirects]]
  from = "/dip_tapes.html"
  to = "/products/dip-tapes/"
  status = 301

[[redirects]]
  from = "/calibration_charts.html"
  to = "/products/calibration-charts/"
  status = 301

[[redirects]]
  from = "/how_to_use_a_dipstick.html"
  to = "/guides/how-to-use-a-dipstick/"
  status = 301

[[redirects]]
  from = "/dipstick_rubbing_guide.html"
  to = "/guides/dipstick-rubbing-guide/"
  status = 301

[[redirects]]
  from = "/about.html"
  to = "/about/"
  status = 301

[[redirects]]
  from = "/FAQs.html"
  to = "/faqs/"
  status = 301

[[redirects]]
  from = "/contact.html"
  to = "/contact/"
  status = 301

[[redirects]]
  from = "/Contact.aspx"
  to = "/contact/"
  status = 301

[[redirects]]
  from = "/About.html"
  to = "/about/"
  status = 301

# SPA fallback for 404
[[redirects]]
  from = "/*"
  to = "/404/"
  status = 404
```

### Netlify Features to Enable
- **Asset optimization** — auto CSS/JS/image optimization
- **Prerendering** — for SEO bots
- **Form handling** — built-in form submissions with email notifications
- **Deploy previews** — for PR-based preview deployments
- **Branch deploys** — staging environment on branches

---

## 6. Implementation Phases

### Phase 1: Foundation (Core Build)
- [ ] Initialize Astro project with Tailwind CSS
- [ ] Create BaseLayout with SEO component
- [ ] Create Header, Navigation, Footer components
- [ ] Build homepage
- [ ] Set up Netlify configuration
- [ ] Configure 301 redirects for all old URLs
- [ ] Set up image optimization pipeline

### Phase 2: Content Pages
- [ ] Build 3 product pages (dipsticks, dip-tapes, calibration-charts)
- [ ] Build 2 guide pages
- [ ] Build about page
- [ ] Build FAQ page with accordion and schema
- [ ] Build contact page with Netlify form
- [ ] Build 404 page

### Phase 3: Polish & SEO
- [ ] Optimize all images (compress, convert to AVIF/WebP)
- [ ] Add JSON-LD structured data to all pages
- [ ] Generate sitemap.xml
- [ ] Add Open Graph images for each page
- [ ] Implement cookie consent banner
- [ ] Cross-browser and device testing
- [ ] Lighthouse audit and fixes

### Phase 4: Launch
- [ ] Final QA pass
- [ ] Set up Netlify deploy from this branch
- [ ] Verify 301 redirects work
- [ ] Submit updated sitemap to Google Search Console
- [ ] Monitor Core Web Vitals post-launch

---

## Summary of Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Framework** | Raw HTML + jQuery + Bootstrap 3 | Astro + Tailwind CSS |
| **Page weight** | 1.3MB+ | < 200KB |
| **JavaScript** | 434KB (mostly unused) | < 20KB |
| **Images** | Unoptimized JPG/PNG | AVIF/WebP, responsive srcset |
| **CSS** | 500KB (Bootstrap 3 + vendor) | ~15KB (Tailwind, purged) |
| **Fonts** | 1.3MB (3 icon fonts + 5 Google fonts) | ~50KB (1 font, WOFF2 only) |
| **SEO** | Missing OG/canonical/schema | Full technical SEO |
| **Accessibility** | Zoom disabled, minimal ARIA | WCAG 2.1 AA compliant |
| **URLs** | `.html` extensions, inconsistent casing | Clean `/products/name/` paths |
| **Build** | None (raw files) | Astro build + Netlify CI/CD |
| **Lighthouse** | ~40 perf / ~60 a11y / ~70 SEO | 95+ across all categories |
