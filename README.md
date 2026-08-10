# Shadab Khan — Portfolio Website

A fast, recruiter-ready personal portfolio for a CRM & Lifecycle Marketing specialist.
Built with **plain HTML, CSS and JavaScript** — no frameworks, no build step, no backend,
no paid services. Deployable for free on GitHub Pages, Netlify, or Vercel.

## Files

| File | What it is |
|---|---|
| `index.html` | All content — every section of the site lives here |
| `styles.css` | All styling — colors/fonts are CSS variables at the top |
| `script.js` | Small vanilla-JS interactions (nav, scroll reveal, stat count-up) |

## ⚠️ Before you publish — replace placeholder metrics

Some metrics were **AI-generated placeholders** so the layout looks complete.
They are visually highlighted on the page (amber background, dashed underline) and
marked in the code with `<!-- PLACEHOLDER: replace with real number -->` comments.

**Find them all:** search `index.html` for `placeholder-metric`.

### Placeholder checklist

| # | Location | Placeholder value | Replace with |
|---|---|---|---|
| 1 | Experience → Nazih Group → "Scaled cart recovery" | `18%` of abandoned carts recovered | Your real cart-recovery rate |
| 2 | Experience → Nazih Group → "Scaled cart recovery" | `AED 250K+` incremental annual revenue | Your real recovered revenue |
| 3 | Experience → Next Big Innovation Labs → "Made the funnel measurable" | `25%` cost-per-qualified-lead reduction | Your real CPL improvement (or delete bullet) |
| 4 | Case Study 1 (GCC retention) → Outcome | `12%` lapsed customers reactivated in 90 days | Your real win-back reactivation rate |
| 5 | Case Study 2 (GA4/GTM rebuild) → Outcome | `95%+` event tracking accuracy | Your real tracking-accuracy figure |
| 6 | Case Study 2 (GA4/GTM rebuild) → Outcome | `60%` monthly reporting time reduction | Your real time saved (or delete) |
| 7 | Case Study 3 (3x revenue engine) → Outcome | `15%` organic share of pipeline (before) | Your real before figure |
| 8 | Case Study 3 (3x revenue engine) → Outcome | `45%` organic share of pipeline (after) | Your real after figure |
| 9 | Case Study 4 (Product Hunt launch) → Outcome | `under 1 hour` sales handoff time | Your real handoff time |

Once a number is real, remove the highlight by deleting the
`<span class="placeholder-metric" ...>` wrapper (keep the number) and the
adjacent `<!-- PLACEHOLDER -->` comment.

### Inferred content to confirm

These items go **beyond the resume** and are marked in the code with `<!-- INFERRED -->`
comments (and small amber "confirm" badges on the page):

- **Your name** — "Shadab Khan" was derived from your email/LinkedIn handle. Confirm spelling everywhere (`<title>`, hero, footer).
- **GitHub URL** — guessed as `github.com/shadabkhansir` from this repo's owner. Confirm or update in the Contact section.
- **Languages** (About → Quick facts) — "English, Hindi" is a guess. Confirm or remove.
- **WhatsApp** as a channel (Skills → Channels) — common in GCC ecommerce CRM but not on your resume.
- **The entire "AI Tools & Experience" section** — your resume doesn't mention AI tools, so all six cards are professionally-plausible drafts. Edit each to match what you actually use.
- **Phone number** is shown publicly in the Contact section (it was on your resume). If you don't want it on a public website, delete that contact card.
- Editorial framing (e.g. company context lines like "one of the Middle East's largest beauty distributors") — confirm accuracy.

After confirming, delete the `inferred-tag` badges from `index.html`
(search for `inferred-tag`).

## Deploy to GitHub Pages (free)

1. Create a repository on GitHub (for a `username.github.io` URL with no path,
   name the repo exactly `<your-username>.github.io`; otherwise any name works).
2. Push these files to the repository's default branch (`main`):
   ```bash
   git init
   git add index.html styles.css script.js README.md
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub, open the repo → **Settings** → **Pages** (left sidebar).
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   choose branch `main` and folder `/ (root)`, then **Save**.
5. Wait ~1 minute. Your site is live at
   `https://<your-username>.github.io/<repo-name>/`
   (or `https://<your-username>.github.io/` if you used the special repo name).
6. Every future `git push` to `main` redeploys automatically.

### Netlify / Vercel (alternative, also free)

Drag-and-drop the folder at [app.netlify.com/drop](https://app.netlify.com/drop),
or import the GitHub repo in Netlify/Vercel — no build command, publish directory = root.

## How to update content later

- **Text**: everything is in `index.html`, organised with section comments
  (`==== HERO ====`, `==== SKILLS ====`, etc.). Edit and push.
- **Colors/branding**: change the CSS variables at the top of `styles.css`.
- **Add a case study**: copy an existing `<article class="case-card">` block and edit it.
- **Add a role**: copy an existing `<article class="timeline-item">` block.

## Performance & accessibility notes

- No frameworks or heavy libraries; one small font request (Inter via Google Fonts).
- Semantic HTML, skip-to-content link, ARIA labels, keyboard-friendly nav.
- All animations are disabled automatically for users with
  `prefers-reduced-motion` enabled.
