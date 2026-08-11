# Shadab Khan — Retention, Lifecycle & Growth Portfolio

Single-page portfolio for a senior CRM, Retention & Growth professional. Dark
editorial design — ink ground, display type, mono data labels, one acid accent,
and a signature animated customer-lifecycle loop (pure SVG code, no video or
images). Self-contained **HTML + CSS + vanilla JS**; the only external
dependency is Google Fonts. Free to host on GitHub Pages, Netlify, or Vercel.

## Files

| File | What it is |
|---|---|
| `index.html` | All content, organised by section comments |
| `styles.css` | All styling — palette & type tokens at the top of the file |
| `script.js` | Menu, reveals, tabs, accordions, carousel, cert lightbox, cursor glow |
| `certs/` | Certificate images — see "Certificate images" below |

## ⚠️ Bump the cache version after every edit

`index.html` loads its assets as `styles.css?v=5` and `script.js?v=5`.
**Every time you edit either file, increase that number** (`?v=6`, `?v=7`, …)
in both places. Browsers cache CSS/JS aggressively — without a version bump,
returning visitors (and you, while testing) keep running the *old* files, which
looks exactly like "my changes didn't work."

If something still looks stale, hard-refresh: **Ctrl+Shift+R** (Windows) or
**Cmd+Shift+R** (Mac).

## Theme switch

The nav carries a sliding pill switch with two views:

| Label | What it is |
|---|---|
| **Normal** (droplet icon) | The colour theme — dark ink with the acid accent |
| **Mono** (half-circle icon) | Black & white — black type on paper, no accent colour |

The knob slides, the icons rotate/fade between states, and the whole page
crossfades its colours. The choice is saved to `localStorage` and re-applied
before first paint on the next visit, so there's no flash.

To change either palette, edit the CSS custom properties at the top of
`styles.css`: `:root { … }` is Normal, `[data-theme="mono"] { … }` is Mono.
Nothing else needs touching — every colour on the site derives from those
tokens.

## Certificate images

Each credential in `index.html` carries `data-cert="certs/<file>"`. On load the
site quietly checks whether that file exists:

- **File exists** → a "view certificate ↗" button appears and opens the image
  in a lightbox.
- **File missing** → no button, no error. The credential just lists normally.

Currently `certs/klaviyo.svg` and `certs/moengage.svg` are **placeholder
images** — replace them with your real certificates (keep the filenames, or
update the `data-cert` attributes). The CleverTap/GA4/Braze entries already
point at `certs/clevertap.png`, `certs/ga4.png`, `certs/braze.png` — upload
those files whenever you earn them and the buttons will appear automatically.

The viewer can be closed three ways: the **✕ close** button (top-right, accent
coloured), the **Esc** key, or clicking/tapping the backdrop outside the image.

## ⚠️ Placeholders to fill before publishing

Every editable placeholder is wrapped in `<span class="ph">[ ... ]</span>`
(amber, dashed outline on the page) with a `<!-- PLACEHOLDER -->` comment
beside it. Search `index.html` for `class="ph"`. Full list:

| # | Location | Placeholder |
|---|---|---|
| 1 | About | `[ Refine in your own voice ]` — both paragraphs are sample copy |
| 2 | Case Study 1 → Impact | `[ 12× ]` flagship conversion improvement (sample from your notes — confirm) |
| 3 | Case Study 1 → Impact | `[ ~18% conversion ]` wishlist abandonment (confirm) |
| 4 | Case Study 1 → Next | `[ Holdout-based incrementality measurement ]` |
| 5 | Case Study 2 → Impact | `[ Clean attribution · compliant data flow · conversion-accuracy improvement ]` |
| 6 | Case Study 3 → Impact | `[ seven-figure, indexed ]` revenue-at-risk |
| 7 | Case Study 4 → Impact | `[ Launch outcomes / reach ]` |
| 8 | Case Study 6 | Entire card is a "coming soon" slot — external DTC lifecycle teardown to build later |
| 9 | Credentials | CleverTap certification `[ add ]` (marked "in progress") |
| 10 | Credentials | GA4 / Google Analytics certification `[ add ]` (marked "in progress") |
| 11 | Certificate images | `certs/klaviyo.svg` and `certs/moengage.svg` are placeholder graphics — replace with real certificates |
| 12 | Testimonials | **All three quotes, names, titles and avatar initials are SAMPLE content** (each slide carries a visible "sample — replace" tag) — replace with real quotes before publishing |

To clear one: replace the text, then delete the `<span class="ph">` wrapper
and the adjacent `<!-- PLACEHOLDER -->` comment.

### Content decisions to review

- **Confidentiality by design**: the employer is only ever "a leading GCC beauty
  & cosmetics retailer" and all figures are indexed/anonymised, with a visible
  footnote under the hero stats saying so. No invented revenue numbers.
- **Certifications**: your resume's real certs (Klaviyo CRM Strategist, MoEngage
  Customer Engagement Leadership 2023) are shown as **earned**, even though the
  reference brief listed Klaviyo as "learn later" — correct this if the resume
  cert is a different Klaviyo program. CleverTap/GA4 show as "in progress",
  Braze as "planned".
- **Name** "Shadab Khan" and the LinkedIn URL were filled in from your earlier
  materials.
- Hero stat copy ("56→17", "12×", "5 markets / 11K+ SKUs") comes from your
  reference brief — confirm the figures are safe to publish.

## Deploy to GitHub Pages (free)

1. Create a repository on GitHub (name it `<your-username>.github.io` for a
   clean root URL; any other name works too).
2. Push the four files to the `main` branch:
   ```bash
   git init
   git add index.html styles.css script.js README.md
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → Source: `Deploy from a branch` → `main` /
   `/ (root)` → Save.
4. Live in ~1 minute at `https://<your-username>.github.io/<repo-name>/`.
5. Every push to `main` redeploys automatically.

**Netlify/Vercel:** import the repo (no build command, root publish directory),
or drag-and-drop the folder at app.netlify.com/drop.

## Updating content

- All copy is in `index.html`, marked with `==== SECTION ====` comments.
- Colours/typography: edit the CSS custom properties at the top of `styles.css`.
- New case study: copy an existing `<article class="case">` block; give the
  button a new `aria-controls` id matching the panel's `id`.
- Certifications: each `<li class="cred">` has a status label — use
  `cred-done` class + "earned" text when you complete one.

## How the JavaScript is structured

`script.js` registers each feature through a `feature(name, fn)` wrapper that
isolates it in its own `try/catch`. If one feature fails on some browser or
version, every other feature still runs, and a warning goes to the console
instead of silently breaking the page. The theme switch and the lifecycle
animation are registered first so nothing can affect them.

## Performance & accessibility

- No frameworks, no images, no trackers; one font request.
- Semantic HTML, skip link, visible keyboard focus states, accessible
  accordions (`aria-expanded`/`aria-controls`), Escape closes the menu.
- All motion (reveals, marquee, lifecycle-flow animation, cursor glow)
  is disabled under `prefers-reduced-motion`.
