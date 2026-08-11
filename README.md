# Shadab Khan — Retention & Lifecycle Strategist Portfolio

Single-page portfolio for a senior CRM & Retention professional. Dark editorial
design — ink ground, display type, mono data labels, one acid accent, and a
signature lifecycle-loop diagram. Self-contained **HTML + CSS + vanilla JS**;
the only external dependency is Google Fonts. Free to host on GitHub Pages,
Netlify, or Vercel.

## Files

| File | What it is |
|---|---|
| `index.html` | All content, organised by section comments |
| `styles.css` | All styling — palette & type tokens at the top of the file |
| `script.js` | Menu, scroll reveals, progress line, accordions, cursor glow |

## ⚠️ Placeholders to fill before publishing

Every editable placeholder is wrapped in `<span class="ph">[ ... ]</span>`
(amber, dashed outline on the page) with a `<!-- PLACEHOLDER -->` comment
beside it. Search `index.html` for `class="ph"`. Full list:

| # | Location | Placeholder |
|---|---|---|
| 1 | About | `[ Refine this paragraph in your own voice ]` — sample paragraph provided |
| 2 | Case Study 1 → Impact | `[ 12× ]` flagship conversion improvement (sample from your notes — confirm) |
| 3 | Case Study 1 → Impact | `[ ~18% conversion ]` wishlist abandonment (confirm) |
| 4 | Case Study 1 → Next | `[ Holdout-based incrementality measurement ]` |
| 5 | Case Study 2 → Impact | `[ Clean attribution · compliant data flow · conversion-accuracy improvement ]` |
| 6 | Case Study 3 → Impact | `[ seven-figure, indexed ]` revenue-at-risk |
| 7 | Case Study 4 → Impact | `[ Launch outcomes / reach ]` |
| 8 | Case Study 5 | Entire card is a "coming soon" slot — external DTC lifecycle teardown to build later |
| 9 | Credentials | CleverTap certification `[ add ]` (marked "in progress") |
| 10 | Credentials | GA4 / Google Analytics certification `[ add ]` (marked "in progress") |
| 11 | Testimonials | Two quote slots + name/title placeholders |

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

## Performance & accessibility

- No frameworks, no images, no trackers; one font request.
- Semantic HTML, skip link, visible keyboard focus states, accessible
  accordions (`aria-expanded`/`aria-controls`), Escape closes the menu.
- All motion (reveals, marquee, lifecycle-flow animation, cursor glow)
  is disabled under `prefers-reduced-motion`.
