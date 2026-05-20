# Hot Chickz — Design & Architecture Notes

## Brand direction — "Street Heat"

A neon-lit, charcoal-dark, maximalist hot-chicken aesthetic: late-night
signage glow, flame, smoke, sauce drips, and kitchen-receipt motifs.

- **Palette** — charcoal blacks (`char`/`coal`/`ash`), a blistering ember red,
  molten orange, ember-yellow `flare`, warm `bone` text, with a sparingly used
  hot-pink `neon`. Five heat levels each carry their own color.
- **Type** — `Anton` (billboard display), `Bricolage Grotesque` (headings/UI),
  `Hanken Grotesk` (body/tables). Deliberately not the generic AI sans set.
- **Signature motifs** — the five-flame *heat meter*, the *order ticket* that
  travels cart → checkout → admin, the rooster logo as a coin/badge, a static
  film-grain overlay, and aggressive scroll + hover motion.

## Architecture decisions

| Decision | Why |
|----------|-----|
| Static SPA on GitHub Pages | No server to run or pay for; the brief calls for a Pages deploy. |
| `localStorage` as the database | Makes the storefront and admin one *connected* system without a backend — an order placed on the site is read back by the admin. |
| `HashRouter` | GitHub Pages can't rewrite deep links; hash routing is refresh-safe with zero config. |
| Hand-built SVG charts | Keeps the bundle lean and lets charts wear the exact brand palette/motion. |
| `FoodImage` with a flame fallback | The site looks intentional with or without generated photography — art is an enhancement, never a load-bearing dependency. |
| Composite cart `lineId` | `itemId#heat#options` — identical configs merge; re-heating a line merges into an existing match instead of duplicating. |
| 30-day admin seed window | Period-over-period analytics need two complete windows, or deltas mislead. |

## The connected seam

`CartContext` writes orders to `localStorage`; `AdminDataContext` reads them
back and folds them into the seeded order history on load. Catering requests
submitted on the storefront surface as admin Events the same way. The demo
behaves like one system because the storage layer *is* shared.

## Asset pipeline

Food photography is generated with Higgsfield `nano_banana_pro` in the dark
brand style, then compressed to ~900px JPEGs (~20× smaller than the raw PNGs)
so the image-heavy Menu page stays fast on GitHub Pages' CDN.
