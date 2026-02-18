# Website Improvements

Suggested enhancements from a full user-perspective review of the site. Grouped by category, ordered by impact within each group.

---

## Legal / Compliance

- [ ] **Create a Privacy Policy page** — The site collects personal data via forms and loads Google Tag Manager, but has no privacy policy or cookie policy page. This is a UK GDPR/PECR requirement. Create `/privacy-policy/` covering data collection, retention, and user rights. Link it from the cookie banner and the footer.
- [ ] **Fix GTM loading before cookie consent** — Google Tag Manager loads unconditionally in the `<head>` of `BaseLayout.astro` before the user has accepted or declined cookies. GTM should only be injected if `localStorage` confirms prior consent, or after the user clicks "Accept". Currently, clicking "Decline" pushes a dataLayer event but GTM has already loaded and potentially set cookies.

## Content

- [ ] **Fix "Get a Quote" CTAs linking to the wrong page** — The "Get a Quote" buttons on all three product pages (`dipsticks.astro`, `dip-tapes.astro`, `calibration-charts.astro`), the homepage CTA banner, and the About page CTA all link to `/contact/` instead of `/request-a-quote/`. These should point to the dedicated quote form which captures tank dimensions and product details.
- [ ] **Add links to FAQ answers** — Several FAQ answers reference the rubbing guide and measurement guide but provide no clickable links. Convert these to include links to `/guides/dipstick-rubbing-guide/` and the Tank Measurement Guide PDF where referenced.
- [ ] **Reduce duplicate content between homepage and About page** — The "About / Trust" section on the homepage copies large blocks of text verbatim from the About page. Shorten the homepage version to a summary with a "Read more" link, and give the About page unique content (company history, team, workshop photos, certifications).
- [ ] **Add differentiating content to the About page** — The About page reads like a product brochure. Add trust signals: named principal/founder, workshop or team photo, specific industries served, testimonials, or relevant certifications (ISO, UKAS, BSI).
- [ ] **Add pricing to Dip Tapes and Calibration Charts pages** — The dipsticks page shows "from £52" but the other two product pages have no pricing information. Add at least a starting price or explain why pricing is quote-dependent. Also add `offers` to the JSON-LD schema on these pages.

## UX / Design

- [ ] **Add product imagery to the homepage hero** — The hero section is text-only on a gradient background. Adding a photograph of the products in use (e.g. a dipstick being used on a tank) would immediately communicate what the company does and improve first impressions.
- [ ] **Remove `required` from the quote form rod length field** — Many customers (especially homeowners) won't know the rod length. The sidebar even says "fill in what you can and we'll help with the rest", but the form contradicts this by requiring rod length. Make either rod length or tank dimensions sufficient.
- [ ] **Add loading state to form submit buttons** — Neither form has visual feedback on submission. Add JavaScript to disable the button and show "Sending..." text to prevent double-clicks and reassure the user on slower connections.
- [ ] **Replace YouTube iframe with a lightweight facade** — The homepage YouTube embed loads ~500KB of resources from YouTube even if the user never watches the video. Use a click-to-load pattern (static thumbnail + play button) that only loads the iframe on interaction.

## SEO / Technical

- [ ] **Create `/products/` and `/guides/` index pages** — Breadcrumbs on product and guide pages link "Products" and "Guides" to `/` (homepage). Either create proper index pages for these sections or simplify the breadcrumb to skip the intermediate level.
- [ ] **Rename image files to remove spaces** — `Example of our dipsticks.png` and its thumbnail contain spaces. Rename to `example-of-our-dipsticks.png` and update references in `dipsticks.astro`.
- [ ] **Add a Content-Security-Policy header** — `netlify.toml` has good security headers but no CSP. Add one that allows Google Fonts, YouTube, and GTM domains while blocking everything else.
- [ ] **Add Apple Touch Icon and favicon.ico fallback** — Only a single PNG favicon is provided. Add `<link rel="apple-touch-icon">` and a `favicon.ico` at the root for broader compatibility.
- [ ] **Self-host the Inter font** — The Inter font loads from Google Fonts as render-blocking CSS. Self-hosting the woff2 files from `/fonts/` would eliminate the external dependency and improve load time, particularly on slower rural connections.

## Accessibility

- [ ] **Make desktop dropdown navigation keyboard-accessible** — The Products and Guides dropdowns rely on CSS `:hover` only. The `aria-expanded` attribute is hardcoded to `false` and never toggled. Add JavaScript to open/close dropdowns on Enter/Space, update `aria-expanded`, and close on Escape.
- [ ] **Add `aria-hidden="true"` to decorative SVG icons** — Inline SVG icons throughout the Header, Footer, and page content lack `aria-hidden="true"`. Screen readers may announce these as images or read path data. All decorative icons should be hidden from assistive technology.
- [ ] **Add `inputmode="decimal"` to measurement fields on the quote form** — Tank measurement inputs use `type="text"` which shows a full keyboard on mobile. Adding `inputmode="decimal"` gives mobile users a numeric keypad, which is faster for entering dimensions in millimetres.

## Functionality

- [ ] **Fix tank renumbering bug when removing middle tanks** — In the quote form's `renumberTanks()` function, removing a tank from the middle of a list can cause field name/ID mismatches. The function reads `data-tank-index` and replaces it in a single pass, but intermediate state can cause conflicts. Read all old indices before updating any, or store the original index separately.

## Performance

- [ ] **Use Astro's `<Image>` component for optimised images** — Images are served as static files with no build-time optimisation or responsive `srcset`. Moving images to `src/assets/` and using Astro's built-in `<Image>` component would generate WebP/AVIF versions and responsive sizes automatically.
- [ ] **Consolidate repeated inline SVGs** — The same SVG icon paths (phone, email, arrow, checkmark) are duplicated many times across pages. Consider an SVG sprite, a shared Icon component, or the `astro-icon` integration to reduce HTML bloat.
