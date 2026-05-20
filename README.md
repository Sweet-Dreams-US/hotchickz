# Hot Chickz — Storefront & Admin Suite

A demo website for **Hot Chickz**, a Nashville-style halal hot chicken spot in
Fort Wayne, Indiana. It pairs a creative, animation-rich customer storefront
with online ordering and a full back-of-house admin suite.

Built by **Sweet Dreams** as a concept build.

🔥 **Live demo:** https://sweet-dreams-us.github.io/hotchickz/

---

## What's inside

### Storefront (customer-facing)

- **Cinematic home page** — flame-lit hero, the heat ladder, featured items,
  brand story, catering teaser, and live hours.
- **Menu with one-tap ordering** — every card lets you pick a heat level and
  add to your bag *without leaving the page*. A slide-out cart confirms each
  add with a toast — no detours, no extra steps.
- **Checkout** — pickup or delivery, order notes, and an animated order
  confirmation ticket.
- **Catering** — packages, trays, and a request form.
- **About** and **Find Us** pages, with an embedded Google map and live hours.

### Admin suite (`/#/admin`)

Seven back-of-house modules, all seeded with realistic demo data:

| Module | What it does |
|------------|--------------|
| Dashboard  | Today's KPIs, revenue trend, channel mix, top sellers |
| Orders     | Live kitchen ticket board with status advancement |
| Analytics  | Sales / traffic trends, top items, peak hours, heat mix |
| Accounting | P&L statement, expense breakdown, transaction ledger |
| Socials    | Per-platform stats, follower growth, post performance |
| Staff      | Team roster — add, remove, toggle on-shift |
| Schedule   | Weekly shift grid |
| Events     | Promos, catering bookings, community appearances |

**The connected part:** an order placed on the storefront is written to the
browser and shows up in the admin Orders board. A catering request becomes an
admin Event. It behaves like one system because, to the demo, it is.

> **Demo login:** the credentials are pre-filled — just click **Sign In**.

---

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — custom "Street Heat" design system
- **Framer Motion** — animations and transitions
- **React Router** (HashRouter — refresh-safe on static hosting)
- Hand-built SVG charts (no chart library)
- **GitHub Pages** for hosting; no backend — `localStorage` is the database
- Food photography generated with **Higgsfield** (`nano_banana_pro`)

---

## Deploying to GitHub Pages

This repo ships with a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds and deploys on every push to
`main`. To switch it on **once**:

1. Go to the repo's **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or re-run the latest workflow). The site deploys to
   `https://sweet-dreams-us.github.io/hotchickz/`.

> The Vite `base` is set to `/hotchickz/` to match the repo name. If the repo
> is ever renamed, update `base` in `vite.config.ts`.

---

## Local development

```bash
npm install
npm run dev      # http://localhost:5173/hotchickz/
```

Other scripts:

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run typecheck  # TypeScript check
```

---

## Project structure

```
src/
  data/            menu, business info, heat levels, catering, admin seed
  lib/             helpers — cart/order types, formatting, storage, metrics
  context/         CartContext (storefront) + AdminDataContext (admin)
  components/
    brand/         Flame, HeatMeter, HeatPicker, Logo, SmokeWisps
    ui/            Button, Badge, Reveal, Marquee, Eyebrow
    site/          Navbar, Footer, CartDrawer, MenuItemCard, …
    admin/         AdminCard, StatCard, charts/ (Area/Bar/Donut/Sparkline)
  pages/
    site/          Home, Menu, Checkout, Catering, About, FindUs, …
    admin/         AdminApp, Dashboard, Orders, Analytics, Accounting, …
public/assets/     Higgsfield-generated food photography
```

---

## Demo notes

- **No backend.** The cart, orders, and all admin edits persist in the
  browser's `localStorage`. Clearing site data resets everything.
- **Reset demo data** — the admin sidebar has a button to regenerate the
  seeded orders, staff, schedule, and financials.
- The **Dill Chips** side is the restaurant's classic dill side — rename it in
  `src/data/menu.ts` if a different label is preferred.
- Online ordering is **order-ahead, pay-in-store** — no real payment
  processing is wired up (this is a concept demo).
