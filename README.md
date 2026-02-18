# Dipsticks Engineering Website

The official website for **Dipsticks Engineering Services Ltd** — a UK manufacturer of calibrated dipsticks, dip tapes, and calibration charts for liquid storage tanks. Over 35 years of specialist experience.

**Live site:** [dipsticksengineering.co.uk](https://www.dipsticksengineering.co.uk)

## Tech Stack

- [Astro](https://astro.build/) — static site generator
- [Tailwind CSS 4](https://tailwindcss.com/) — utility-first styling
- [TypeScript](https://www.typescriptlang.org/) — strict mode
- [Netlify](https://www.netlify.com/) — hosting, forms, and redirects
- [PDFKit](https://pdfkit.org/) — PDF guide generation

## Getting Started

### Prerequisites

- Node.js 22+

### Install & Run

```bash
npm install
npm run dev       # Start dev server
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

## Project Structure

```
src/
├── pages/
│   ├── index.astro                    # Homepage
│   ├── about.astro                    # Company background
│   ├── contact.astro                  # Contact form
│   ├── contact-success.astro          # Contact confirmation
│   ├── request-a-quote.astro          # Quote request form
│   ├── quote-success.astro            # Quote confirmation
│   ├── faqs.astro                     # FAQs
│   ├── 404.astro                      # Error page
│   ├── products/
│   │   ├── dipsticks.astro            # Dipsticks product page
│   │   ├── dip-tapes.astro            # Dip tapes product page
│   │   └── calibration-charts.astro   # Calibration charts page
│   └── guides/
│       ├── how-to-use-a-dipstick.astro
│       └── dipstick-rubbing-guide.astro
├── components/
│   ├── Header.astro          # Sticky nav with mobile menu
│   ├── Footer.astro          # Site footer with sitemap
│   ├── PageHeader.astro      # Page title + breadcrumbs
│   ├── SEO.astro             # Meta, Open Graph, Twitter cards
│   ├── JsonLd.astro          # Schema.org structured data
│   └── CookieConsent.astro   # GDPR cookie banner
├── layouts/
│   └── BaseLayout.astro      # Base HTML wrapper
└── styles/
    └── global.css            # Tailwind config + custom theme

public/
├── images/       # Product and tank photos
├── downloads/    # PDF guides
├── fonts/
└── robots.txt

scripts/
└── generate-pdfs.mjs   # Generates downloadable PDF guides
```

## Forms

Both the **Contact** and **Request a Quote** forms use [Netlify Forms](https://docs.netlify.com/forms/setup/). Email notifications are configured in the Netlify dashboard under **Site configuration > Forms > Form notifications**.

| Form name       | Page                | Success redirect     |
|-----------------|---------------------|----------------------|
| `contact`       | `/contact/`         | `/contact-success/`  |
| `quote-request` | `/request-a-quote/` | `/quote-success/`    |

## PDF Generation

Three branded PDF guides are generated with the `generate-pdfs.mjs` script:

```bash
node scripts/generate-pdfs.mjs
```

Output goes to `public/downloads/`:
- `DipsticksUsageGuide.pdf`
- `DipsticksRubbingGuide.pdf`
- `DipsticksTankMeasurementsForm.pdf`

## Deployment

The site deploys to Netlify on push. Configuration is in `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 22
- Security headers (X-Frame-Options, CSP, etc.)
- Cache rules for static assets
- Redirects from the old site's `.html` and `.aspx` URLs to the new structure
