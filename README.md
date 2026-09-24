# Shadab Khan — Retention, Lifecycle & Growth Portfolio

Single-page portfolio for a senior CRM, Retention & Growth professional. Dark
editorial design by default with a designed Light theme, a signature animated
customer-lifecycle loop (pure SVG + JS, no video or images), tools/channels
sliders, an experience timeline, and a downloadable résumé.

Self-contained **HTML + CSS + vanilla JS**; the only external dependency is
Google Fonts. Free to host on GitHub Pages, Netlify, or Vercel.

## Files

| Path | What it is |
|---|---|
| `index.html` | All content, organised by section comments |
| `styles.css` | All styling — palette & type tokens at the top of the file |
| `script.js` | Theme switch, lifecycle animation, sliders, reveals, tabs, accordions, carousel, cert lightbox, portrait tilt |
| `resume/Shadab-Khan-Resume.pdf` | The résumé behind the Contact "View résumé" / download buttons |
| `images/profile.webp`, `images/profile.jpg` | Portrait in the About section |
| `certs/` | Certificate images (see below) |

## Everyday updates

### Update your résumé
Replace `resume/Shadab-Khan-Resume.pdf` with your new PDF **using the exact
same filename**, then commit/upload. Both résumé buttons pick it up — no code
changes. (GitHub Pages may cache the old file for ~10 minutes; hard-refresh
with Ctrl+Shift+R to check.)

### Change your photo
Replace `images/profile.webp` and `images/profile.jpg` (same names). A portrait
around 4:5 and ~900px wide works best. The supplied photo was cropped, resized,
and had its location/device metadata stripped.

### Add a tool or channel to the slider
In `index.html`, find the **Tools** or **Channels** list in the Capabilities
section and add one line, e.g. `<li>Braze</li>`. The slider clones the list and
loops seamlessly at a constant speed however many items there are. Each row's
`data-speed` (pixels/second) and `data-direction` (`left`/`right`) are editable.

### Add a job to Experience
Copy one `<li class="xp">` block in the Experience section. Set
`data-start="YYYY-MM"` and `data-end="YYYY-MM"` (or `"present"`) — the tenure
label ("1 yr 7 mos") is calculated automatically and stays accurate for the
current role.

### Certificates
Each credential carries `data-cert="certs/<file>"`. If that file exists, a
"view certificate ↗" button appears and opens a lightbox (close with ✕, Esc,
or clicking outside). If the file is missing, no button appears and no error
shows. Add an `<a class="cred-verify">` link when the issuer has a public
verification page.

**Shown now (with proof):** GrowthX Product & Growth Program, The Product
Folks Product-Led Growth 2023, MoEngage CELP 2023.

**Hidden until there is proof:** Klaviyo, CleverTap, Google Analytics and
Braze sit inside an HTML comment at the end of the credentials list in
`index.html`. To show one, move it out of the comment, drop its certificate
image into `certs/`, point `data-cert` at it, and set its status/date.

## ⚠️ Bump the cache version after editing CSS/JS

`index.html` loads `styles.css?v=7` and `script.js?v=7`. **Every time you edit
either file, increase that number** (`?v=8`, …) in both places, or returning
visitors keep running the old cached files.

## ⚠️ Placeholders to fill before publishing

Placeholders render as amber dashed chips on the page and are wrapped in
`<span class="ph">` with a `<!-- PLACEHOLDER -->` comment. Search
`index.html` for `class="ph"`.

| # | Location | Placeholder |
|---|---|---|
| 1 | About | `[ Refine in your own voice ]` — both paragraphs are sample copy |
| 2 | Case Study 1 → Impact | `[ 12× ]` flagship conversion improvement (confirm) |
| 3 | Case Study 1 → Impact | `[ ~18% conversion ]` wishlist abandonment (confirm) |
| 4 | Case Study 1 → Next | `[ Holdout-based incrementality measurement ]` |
| 5 | Case Study 2 → Impact | `[ Clean attribution · compliant data flow · conversion-accuracy improvement ]` |
| 6 | Case Study 3 → Impact | `[ seven-figure, indexed ]` revenue-at-risk |
| 7 | Case Study 4 → Impact | `[ Launch outcomes / reach ]` |
| 9 | Credentials | CleverTap certification `[ add ]` |
| 10 | Credentials | GA4 / Google Analytics certification `[ add ]` |

## Theme switch

| Label | What it is |
|---|---|
| **Dark** (moon) — *default* | Ink ground, paper-white type, acid-lime accent |
| **Light** (sun) | Cool paper ground, navy type, vivid indigo accent |

Saved to `localStorage` and applied before first paint. Edit palettes via the
tokens at the top of `styles.css`: `:root` is Dark, `[data-theme="light"]` is
Light. To make Light the default, swap the two blocks and change `"light"` to
`"dark"` in the small `<script>` in `index.html`'s `<head>`.

## Deploy to GitHub Pages (free)

1. Create a repository (name it `<your-username>.github.io` for a clean root URL).
2. Upload **everything** — `index.html`, `styles.css`, `script.js`, `README.md`
   and the `images/`, `resume/`, `certs/` folders — to the `main` branch.
3. Repo → **Settings → Pages** → Source: `Deploy from a branch` → `main` / `/ (root)` → Save.
4. Live in ~1 minute at `https://<your-username>.github.io/<repo-name>/`.
   Every push to `main` redeploys automatically.

**Netlify/Vercel:** import the repo (no build command, root publish directory),
or drag-and-drop the folder at app.netlify.com/drop.

## Fonts (self-hosted)

Fonts live in `fonts/` and are declared with `@font-face` at the top of
`styles.css` (Space Grotesk 400/500, Inter 400/500/600, IBM Plex Mono
400/500, Latin subset). Serving them from this site instead of Google Fonts
removes two third-party connections from the first load. If you ever use a
new weight (e.g. `font-weight: 700`), add the matching `.woff2` file and an
`@font-face` rule. Licenses: `fonts/LICENSE-*.txt` (SIL OFL 1.1).

## How the JavaScript is structured

`script.js` registers each feature through a `feature(name, fn)` wrapper that
isolates it in its own `try/catch`: if one feature fails on some browser, every
other feature still runs and a warning goes to the console.

## Performance & accessibility

- No frameworks, no trackers; self-hosted fonts; portrait ~42 KB WebP, lazy-loaded.
- Semantic HTML, skip link, visible focus states, accessible accordions, tabs
  and switch; Esc closes the menu and lightbox; sliders pause on hover/focus.
- Scroll reveals and hover motion respect `prefers-reduced-motion`. The small,
  slow decorative loops (lifecycle diagram, sliders, portrait float) keep
  running by design.
