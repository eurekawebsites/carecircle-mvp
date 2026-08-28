# CareCircle — MVP Demo

A controlled, single-screen demo of **CareCircle**: one private place for parents and
trusted caregivers to coordinate a child's daily care, follow the same interventions,
and see progress over time.

**Live demo:** https://eurekawebsites.github.io/carecircle-mvp/

---

## What this demo is

This is a **controlled MVP demo built for client validation** — not a production
application. Its only job is to let a client walk through the intended workflow and
approve it before the production phase begins.

- **All data is sample data.** The child, caregivers, checklist, goals, and updates
  are hard-coded fixtures.
- **Changes are in-memory only and reset on refresh.** Completing a care item,
  logging a goal success, switching the parent/caregiver view, or posting a
  caregiver update all work for the session and disappear when the page reloads.
- Nothing is saved, sent, or shared anywhere.

## What belongs to the production phase (not in this demo)

The following are intentionally out of scope here and are part of the separately
delivered production build:

- Real **authentication** and password recovery
- **Database persistence** and tenant-safe access rules
- Parent-created care spaces and caregiver **invitations**
- Parent / caregiver **permissions and security rules**
- Full **PWA** behaviour — manifest, installability, offline shell, icons
- Loading, empty, error, validation, and success states
- Responsive / device QA and production deployment

No backend, authentication, database, or community feature is included in this
repository, and none should be added to it — this repo is the demo only.

## Demo walkthrough

1. Switch between the **parent** and **caregiver** view (top-right selector).
2. See what care is already done today and by whom, on **Today**.
3. Complete an outstanding care item and watch the daily completion update.
4. Open **Care plan** to review the care goals and the active intervention.
5. Use **Log a success** on a goal and see its progress move.
6. Open **Progress** to review the trend over time.
7. Open **Updates**, post a caregiver update, and see it appear in the feed.

---

## Tech

- [Vite](https://vite.dev/) + React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Radix UI primitives, `lucide-react` icons
- Static build — no server, no environment variables

## Local development

```bash
npm install
npm run dev        # http://localhost:5173/carecircle-mvp/
```

## Production build

```bash
npm run build      # type-checks, then outputs static files to dist/
npm run preview     # serve the built site locally
```

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes `dist/` to GitHub Pages.

The Vite `base` is set to `/carecircle-mvp/` in [`vite.config.ts`](vite.config.ts) so
assets and the favicon resolve correctly under the project Pages URL. If the
repository or Pages path changes, update `base` to match.

---

Powered by Eureka Websites.
